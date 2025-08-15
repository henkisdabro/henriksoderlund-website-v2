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
          Digital Strategy Executive & Technology Leader<br/>
          Transforming marketing performance through advanced measurement architecture and data-driven team leadership | Ex-Founder | AdTech Innovation Specialist
        </p>
      </div>

      <section className="content-section">
        <h2>Hello! 👋🏼</h2>
        <p>
          I'm Henrik Söderlund, a digital strategy executive currently leading media activations at <a href="https://initiative.com/" target="_blank" rel="noopener noreferrer">Initiative</a> Perth (<a href="https://kinesso.com" target="_blank" rel="noopener noreferrer">KINESSO</a>, <a href="https://www.interpublic.com/" target="_blank" rel="noopener noreferrer">Interpublic Group</a>). Over the past several years, I've evolved from founding and scaling the award-winning <a href="https://www.cremedigital.com?utm_source=www.henriksoderlund.com&utm_medium=referral" target="_blank" rel="noopener noreferrer">Creme Digital</a> into a senior leadership role where I architect measurement solutions and guide high-performance teams across programmatic and performance marketing channels. My strength lies in my exceptionally broad technical skillset and solutions-driven mindset—from advanced analytics and server-side implementations to AI-integrated workflows—enabling me to solve complex, multi-faceted challenges that others find intractable.
        </p>
        <p>
          With an inherent drive for optimization and systematic thinking, I've built my career on developing AI-powered solutions that transform how teams operate and perform. From designing custom performance tracking systems to implementing intelligent automation workflows, I combine strategic leadership with hands-on technical expertise to deliver measurable results at scale. This unique approach has enabled me to successfully guide multi-million dollar media investments while pioneering next-generation measurement methodologies that set new industry standards.
        </p>
      </section>

    </div>
  );
};

export default Home;