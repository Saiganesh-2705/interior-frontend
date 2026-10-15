import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ChatBot from './components/ChatBot.jsx';
import Preloader from './components/Preloader.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Portfolio from './pages/Portfolio.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import Visualizer from './pages/Visualizer.jsx';
import Estimator from './pages/Estimator.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return (
    <>
      <Preloader />
      <ScrollProgress />
      <ScrollTop />
      <a href="#main" className="skip">Skip to content</a>
      <Navbar />
      {/* Colour wipe that plays on every page change */}
      <motion.div key={location.pathname} className="curtain" aria-hidden="true"
        initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1], delay: 0.05 }} style={{ originY: 0 }} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main id="main" key={location.pathname}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:id" element={<ProjectDetail />} />
            <Route path="/visualizer" element={<Visualizer />} />
            <Route path="/estimator" element={<Estimator />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<div className="wrap page-pad"><h1>Page not found</h1><p>Check the address or go back to the home page.</p></div>} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
      {!isAdmin && <ChatBot />}
    </>
  );
}
