import { MAX_FLOATING_WORDS } from '../content';

/**
 * Deterministic pseudo-random number in [0, 1) seeded by an integer.
 * Keeps each word's layout stable across re-renders (no jumping).
 */
function seeded(n: number): number {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
}

/**
 * Stable integer hash of a word. Seeding layout from the word itself (instead
 * of its list index) means each word keeps its spot when polling prepends new
 * ones — existing words don't shuffle around.
 */
function hashString(str: string): number {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h * 31 + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

function range(value: number, min: number, max: number): number {
    return min + value * (max - min);
}

type Props = {
    words: string[];
    count?: number;
};

/**
 * Decorative layer of softly drifting vocabulary words behind the Hero.
 * Purely visual — hidden from assistive tech.
 */
export default function FloatingWords({ words, count = MAX_FLOATING_WORDS }: Props) {
    const shown = words.slice(0, count);

    return (
        <div className="floating-words" aria-hidden="true">
            {shown.map((word) => {
                const h = hashString(word);
                const left = `${range(seeded(h * 4 + 1), 2, 94).toFixed(2)}%`;
                const top = `${range(seeded(h * 4 + 2), 4, 90).toFixed(2)}%`;
                const fontSize = `${range(seeded(h * 4 + 3), 0.8, 2.2).toFixed(2)}rem`;
                const delay = range(seeded(h * 4 + 4), 0, 8).toFixed(2);
                const duration = range(seeded(h * 4 + 5), 10, 22).toFixed(2);

                return (
                    <span
                        key={word}
                        className="floating-word"
                        style={
                            {
                                left,
                                top,
                                fontSize,
                                ['--delay' as any]: `${delay}s`,
                                ['--duration' as any]: `${duration}s`,
                            } as React.CSSProperties
                        }
                    >
                        {word}
                    </span>
                );
            })}
        </div>
    );
}
