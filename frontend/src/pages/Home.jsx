import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, BarChart3, CalendarCheck2, Compass, Menu, Sparkles, Users } from 'lucide-react';
import mitraLogo from '../assets/frontpage.jpg.jpeg';

const Home = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return <div className="cinema-home">
        <section className="cinema-hero">
            <div className="cinema-image" />
            <div className="cinema-vignette" />
            <div className="cinema-grid" />
            <header className="cinema-header">
                <Link to="/" className="cinema-logo"><img src={mitraLogo} alt="MITRA - Vishnu Institute of Technology" /></Link>
                <div className="cinema-nav"><a href="#story">The idea</a><a href="#ecosystem">Ecosystem</a><Link to="/student-login" className="cinema-student-link">Student Login</Link><Link to="/admin-login" className="cinema-admin-link">Admin Login <ArrowRight size={14} /></Link></div>
                <button className="cinema-menu" title={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><Menu size={19} /></button>
                {menuOpen && <div className="cinema-mobile-nav"><a href="#story" onClick={() => setMenuOpen(false)}>The idea</a><a href="#ecosystem" onClick={() => setMenuOpen(false)}>Ecosystem</a><Link to="/student-login" onClick={() => setMenuOpen(false)}>Student Login</Link><Link to="/admin-login" onClick={() => setMenuOpen(false)}>Admin Login</Link></div>}
            </header>
            <div className="cinema-hero-content">
                <div className="cinema-kicker"><span /> VISHNU INSTITUTE OF TECHNOLOGY <span /></div>
                <h1>Build what<br /><em>moves</em> tomorrow.</h1>
                <p>A living campus network for attendance, ideas, collaboration, and the next generation of builders.</p>
                <div className="cinema-actions"><Link to="/student-login" className="cinema-button bright">Student Login <ArrowRight size={17} /></Link><Link to="/admin-login" className="cinema-button quiet">Admin Login <span>↗</span></Link></div>
            </div>
            <div className="cinema-hero-meta"><span><b>01</b> / 04</span><span className="cinema-scroll"><ArrowDown size={14} /> Explore MITRA</span><span>EST. 2024 <i /></span></div>
        </section>
        <section className="cinema-intro" id="story"><div className="cinema-section-label">01 / THE IDEA</div><div className="cinema-intro-copy"><h2>A campus that<br /><em>keeps moving.</em></h2><p>MITRA connects the rhythm of student life with the clarity of meaningful data. Every class, project, and presence becomes part of a bigger picture: a sharper, more connected VIT.</p><Link to="/student-login" className="cinema-text-link">Explore your campus record <ArrowRight size={16} /></Link></div><div className="cinema-intro-stat"><strong>01</strong><span>shared space<br />for every journey</span></div></section>
        <section className="cinema-ecosystem" id="ecosystem"><div className="cinema-ecosystem-head"><div><div className="cinema-section-label">02 / THE ECOSYSTEM</div><h2>One campus.<br /><em>Many signals.</em></h2></div><p>Quietly powerful tools for the people who make VIT MITRA what it is.</p></div><div className="cinema-feature-grid"><Feature icon={CalendarCheck2} number="01" title="Be present" copy="See your attendance clearly, subject by subject, day by day." /><Feature icon={BarChart3} number="02" title="See the pattern" copy="Turn everyday records into insight you can act on." /><Feature icon={Users} number="03" title="Move together" copy="Give faculty and students one shared academic rhythm." /></div></section>
        <section className="cinema-footer-cta"><div className="cinema-section-label">03 / YOUR NEXT MOVE</div><h2>The next chapter<br /><em>starts here.</em></h2><Link to="/student-login" className="cinema-button bright">Student Login <Compass size={17} /></Link><div className="cinema-footer-line"><img src={mitraLogo} alt="MITRA" /><span>Learning. Presence. Progress.</span><Sparkles size={15} /></div></section>
    </div>;
};

const Feature = ({ icon: Icon, number, title, copy }) => <article className="cinema-feature"><div className="cinema-feature-top"><span>{number}</span><Icon size={19} /></div><h3>{title}</h3><p>{copy}</p><ArrowRight size={17} className="cinema-feature-arrow" /></article>;

export default Home;
