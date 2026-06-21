import PhoneMockup from './PhoneMockup';

export default function Hero() {
    return (
        <section id="top" className="hero">
            <div className="container hero-inner">
                <div className="hero-copy">
                    <h1>
                        Turn the books you read into <span className="accent">vocabulary you keep</span>.
                    </h1>
                    <p className="hero-sub">
                        Word Bank is a reading companion. Track what you want to read, are reading, or have
                        read — and every time a word stops you, save it with its definition, your sentence,
                        and your notes. In your preferred language.
                    </p>
                    <div id="download" className="hero-actions">
                        <a className="button" href="#">
                            Download for Android <small>(beta)</small>
                        </a>
                        <span className="button button-ghost" aria-disabled="true">
                            iOS — coming soon
                        </span>
                        <span className="button button-ghost" aria-disabled="true">
                            Web — coming soon
                        </span>
                    </div>
                    <p className="hero-note">Free during beta · No account · Works offline</p>
                </div>
                <PhoneMockup />
            </div>
        </section>
    );
}
