import { useState } from 'react';

const LINKS = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#dictionary', label: 'Dictionary' },
    { href: '#faq', label: 'FAQ' },
];

export default function Nav() {
    const [open, setOpen] = useState(false);

    return (
        <header className="nav">
            <div className="container nav-inner">
                <a href="#top" className="nav-logo" onClick={() => setOpen(false)}>
                    <span className="nav-logo-mark">W</span>
                    Word Bank
                </a>

                <nav className={`nav-links${open ? ' open' : ''}`} aria-label="Main">
                    {LINKS.map(({ href, label }) => (
                        <a key={href} href={href} onClick={() => setOpen(false)}>
                            {label}
                        </a>
                    ))}
                    <a href="#download" className="button button-small" onClick={() => setOpen(false)}>
                        Get the app
                    </a>
                </nav>

                <button
                    type="button"
                    className="nav-toggle"
                    aria-expanded={open}
                    aria-label={open ? 'Close menu' : 'Open menu'}
                    onClick={() => setOpen((v) => !v)}
                >
                    {open ? '✕' : '☰'}
                </button>
            </div>
        </header>
    );
}
