/**
 * Make a modal dismissable with the browser / phone Back button instead of it
 * navigating away from the site.
 *
 * Usage:
 *   const { pushOnOpen, requestClose } = backDismiss({ key, isOpen, close });
 *   - call `pushOnOpen()` right after you show the modal (adds a history entry);
 *   - wire `requestClose()` to your ✕ / backdrop / Esc / select handlers;
 *   - keep `close()` as the actual hide — it's what a Back press (popstate) runs.
 *
 * A Back press pops the entry we pushed → `popstate` → `close()`, instead of
 * leaving the page. A manual close routes through `requestClose()`, which pops
 * that same entry (→ popstate → close), so history stays balanced.
 */
export function backDismiss(opts: {
    key: string;
    isOpen: () => boolean;
    close: () => void;
}) {
    window.addEventListener("popstate", () => {
        if (opts.isOpen()) opts.close();
    });

    return {
        pushOnOpen(): void {
            history.pushState({ [opts.key]: true }, "");
        },
        requestClose(): void {
            // If our entry is on top, go back so it's removed; popstate runs close().
            if (history.state && history.state[opts.key]) history.back();
            else opts.close();
        },
    };
}
