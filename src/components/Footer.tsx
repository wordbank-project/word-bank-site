export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-inner">
                <span>
                    <span className="nav-logo-mark">W</span> Word Bank © {new Date().getFullYear()}
                </span>
                <span className="footer-note">
                    Your personal words vault.
                </span>
            </div>
        </footer>
    );
}
