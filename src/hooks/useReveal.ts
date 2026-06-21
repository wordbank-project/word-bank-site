import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/**
 * Adds the `revealed` class to the referenced element the first time it
 * scrolls into view. Pair with the `.reveal` CSS class for a fade-up effect.
 */
export function useReveal<T extends HTMLElement>(): RefObject<T | null> {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                }
            },
            { threshold: 0.15 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return ref;
}
