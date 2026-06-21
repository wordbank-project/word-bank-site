import type { Tech } from '../content';
import { REPO_URL, TECH } from '../content';
import { useReveal } from '../hooks/useReveal';

/** One marquee chip — a link to the technology's GitHub repo. */
function TechChip({ tech, duplicate }: { tech: Tech; duplicate?: boolean }) {
    return (
        <a
            className={`tech-chip${tech.highlight ? ' tech-chip-accent' : ''}`}
            href={tech.url}
            target="_blank"
            rel="noopener noreferrer"
            // The second copy exists only to make the loop seamless — hide it from
            // assistive tech and keep it out of the tab order.
            aria-hidden={duplicate || undefined}
            tabIndex={duplicate ? -1 : undefined}
        >
            {tech.name}
        </a>
    );
}

export default function TechMarquee() {
    const ref = useReveal<HTMLElement>();

    return (
        <section ref={ref} className="section tech reveal" aria-label="Built with open source">
            <div className="container tech-head">
                <h2>Built with open source</h2>
                <p>
                    Word Bank is free and <a href={REPO_URL} target="_blank" rel="noopener noreferrer"> open source</a>. <br />
                    Feel free to report issues and contribute.
                </p>
            </div>

            {/* Continuous horizontal marquee. The list is rendered twice so the track
                can translate -50% and loop seamlessly; the second copy is decorative. */}
            <div className="marquee">
                <div className="marquee-track">
                    {TECH.map((tech) => (
                        <TechChip key={tech.name} tech={tech} />
                    ))}
                    {TECH.map((tech) => (
                        <TechChip key={`dup-${tech.name}`} tech={tech} duplicate />
                    ))}
                </div>
            </div>
        </section>
    );
}
