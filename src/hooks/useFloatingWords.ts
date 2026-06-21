import { useEffect, useState } from 'react';
import { HERO_WORDS } from '../content';

type WordRow = { word: string; count: number };

// How often to re-check the backend for newly added words. Light polling keeps
// the hero feeling live without WebSockets — fine for a decorative animation.
const POLL_MS = 30_000;

/**
 * Supplies the words that float behind the Hero. Starts with the curated
 * `HERO_WORDS` fallback (so it is never empty) and, if `VITE_WORDS_API_URL`
 * is set, replaces them with recent words from the backend — re-polling every
 * ~30s so words added in the app drift in without a refresh. Any failure
 * silently keeps whatever words are already shown.
 */
export function useFloatingWords(): string[] {
    const [words, setWords] = useState<string[]>(HERO_WORDS);

    useEffect(() => {
        const base = import.meta.env.VITE_WORDS_API_URL as string | undefined;
        if (!base) return; // No server configured — keep the fallback.

        let controller: AbortController | null = null;

        async function load(): Promise<void> {
            controller?.abort(); // cancel any in-flight poll before starting a new one
            controller = new AbortController();
            try {
                const res = await fetch(`${base}/words?limit=80&order=recent`, {
                    signal: controller.signal,
                });
                if (!res.ok) return;
                const data = (await res.json()) as WordRow[];
                const list = data.map((row) => row.word);
                if (list.length > 0) setWords(list);
            } catch {
                // Network error, abort, or bad JSON — keep the current words silently.
            }
        }

        load();
        const id = setInterval(load, POLL_MS);

        return () => {
            clearInterval(id);
            controller?.abort();
        };
    }, []);

    return words;
}
