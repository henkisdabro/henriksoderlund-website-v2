// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Skills from './components/Skills';
import WorkExperience from './components/WorkExperience';
import Education from './components/Education';
import Consultation from './components/Consultation';
import Footer from './components/Footer';
import NavigationBox from './components/NavigationBox';
import GitHubLink from './components/GitHubLink';
import ScrollToTop from './components/ScrollToTop';
import "./App.css";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <NavigationBox />
        <GitHubLink />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/expertise" element={<Skills />} />
            <Route path="/work-experience" element={<WorkExperience />} />
            <Route path="/education" element={<Education />} />
            <Route path="/consultancy" element={<Consultation />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
