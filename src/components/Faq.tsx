import { FAQS } from '../content';
import Section from './Section';

export default function Faq() {
    return (
        <Section id="faq" className="faq">
            <h2>Frequently asked questions</h2>
            <div className="faq-list">
                {FAQS.map(({ question, answer }) => (
                    <details key={question} className="faq-item">
                        <summary>{question}</summary>
                        <p>{answer}</p>
                    </details>
                ))}
            </div>
        </Section>
    );
}
