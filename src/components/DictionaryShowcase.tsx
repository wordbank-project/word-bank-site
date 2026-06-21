import Section from './Section';

export default function DictionaryShowcase() {
    return (
        <Section id="dictionary" className="dictionary">
            <div className="dictionary-inner">
                <div className="dictionary-copy">
                    <h2>A dictionary that speaks your language</h2>
                    <p>
                        Look a word up the moment you meet it. Word Bank shows the definition, part of
                        speech, and IPA pronunciation — then lets you anchor it with the sentence you
                        found it in and your own notes.
                    </p>
                    <p>
                        Words rarely mean just one thing, so every meaning is fetched at once. Search
                        and pick the definition that fits, with parts of speech colour-coded at a glance.
                    </p>
                    <p>
                        Lookups are powered by Wiktionary data through a dedicated dictionary engine, with
                        support for over a hundred languages. English and Dutch are live today; more are
                        on the way.
                    </p>
                    <div className="language-chips" aria-label="Available languages">
                        <span className="chip live">English</span>
                        <span className="chip live">Nederlands</span>
                        <span className="chip">more soon</span>
                    </div>
                </div>

                <div className="word-card" role="img" aria-label="Example saved word card for the word serendipity">
                    <div className="word-card-head">
                        <span className="word-card-word">serendipity</span>
                        <span className="word-card-ipa">/ˌsɛɹ.ənˈdɪp.ɪ.ti/</span>
                    </div>
                    <span className="word-card-pos">noun</span>
                    <p className="word-card-definition">
                        A combination of events which have come together by chance to make a surprisingly
                        good or wonderful outcome.
                    </p>
                    <span className="word-card-switch">Choose other definition (3) ›</span>
                    <div className="word-card-meta">
                        <span className="word-card-label">Sentence</span>
                        <p>“Finding that bookshop in the rain was pure serendipity.”</p>
                    </div>
                    <div className="word-card-meta">
                        <span className="word-card-label">Notes</span>
                        <p>From a Persian fairy tale — “The Three Princes of Serendip”.</p>
                    </div>
                </div>
            </div>
        </Section>
    );
}
