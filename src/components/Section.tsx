import type { ReactNode } from 'react';

import { useReveal } from '../hooks/useReveal';

type SectionProps = {
    id?: string;
    className?: string;
    children: ReactNode;
};

/** A page section that fades up the first time it scrolls into view. */
export default function Section({ id, className, children }: SectionProps) {
    const ref = useReveal<HTMLElement>();

    return (
        <section id={id} ref={ref} className={`section reveal${className ? ` ${className}` : ''}`}>
            <div className="container">{children}</div>
        </section>
    );
}
