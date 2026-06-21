import { STEPS } from '../content';
import Section from './Section';

export default function HowItWorks() {
    return (
        <Section id="how-it-works" className="how">
            <h2>How it works</h2>
            <p className="section-sub">Three steps, then it becomes a habit.</p>
            <ol className="steps">
                {STEPS.map(({ title, description }, i) => (
                    <li key={title} className="step">
                        <span className="step-number">{i + 1}</span>
                        <h3>{title}</h3>
                        <p>{description}</p>
                    </li>
                ))}
            </ol>
        </Section>
    );
}
