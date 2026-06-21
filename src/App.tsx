import DictionaryShowcase from './components/DictionaryShowcase';
import Faq from './components/Faq';
import Features from './components/Features';
import Footer from './components/Footer';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Nav from './components/Nav';
import Stats from './components/Stats';
import TechMarquee from './components/TechMarquee';

export default function App() {
    return (
        <>
            <Nav />
            <main>
                <Hero />
                <Stats />
                <Features />
                <HowItWorks />
                <DictionaryShowcase />
                <Faq />
                <TechMarquee />
            </main>
            <Footer />
        </>
    );
}
