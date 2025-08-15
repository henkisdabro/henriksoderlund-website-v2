import React from 'react';
import profileImage from '../assets/images/henrik-profile-small.jpg';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <img 
          src={profileImage} 
          alt="Henrik Söderlund" 
          className="profile-image"
        />
        <h1>Henrik Söderlund</h1>
        <p className="lead">
          Digital Media & AdTech Leader | Strategic Team Leadership | Ex-Founder of Creme Digital | Marketing Technology | Measurement & Data Visualization
        </p>
      </div>

      <section className="content-section">
        <h2>Hello! 👋🏼</h2>
        <p>
          I'm Henrik Söderlund, Media Activations Lead – <a href="https://initiative.com/" target="_blank" rel="noopener noreferrer">Initiative</a> Perth via <a href="https://kinesso.com" target="_blank" rel="noopener noreferrer">KINESSO</a>, part of the <a href="https://www.interpublic.com/" target="_blank" rel="noopener noreferrer">Interpublic Group</a>. As the former founder and technical lead of the award-winning boutique media agency <a href="https://www.cremedigital.com?utm_source=www.henriksoderlund.com&utm_medium=referral" target="_blank" rel="noopener noreferrer">Creme Digital</a> I bring comprehensive expertise in building and leading high-performance teams across Addressable (Programmatic) and Performance advertising channels. My distinctive edge lies in advanced ad performance tracking, measurement architecture, and server-side tagging/analytics implementation.
        </p>
        <p>
          Swedish-born with optimization in my DNA, I've consistently delivered innovative solutions through custom agency performance tracking systems, streamlined operational processes, and effective SOPs. My versatile technology and systems proficiency enables precise management of multi-million dollar annual media budgets while maintaining exceptional resource efficiency and cost control.
        </p>
      </section>

    </div>
  );
};

export default Home;