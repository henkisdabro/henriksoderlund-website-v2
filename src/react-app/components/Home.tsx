import profileImage from "../assets/images/henrik-profile-small.jpg";

const Home = () => {
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
          Digital Media Leader & AI Solutions Expert.
          <br />
          Former agency founder now architecting performance marketing solutions through automation, advanced analytics, and strategic team development in enterprise environments.
        </p>
      </div>

      <section className="content-section">
        <h2>Hello! 👋🏼</h2>
        <p>
          I'm Henrik Söderlund, a technology leader responsible for
          media activations at{" "}
          <a
            href="https://initiative.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Initiative
          </a>{" "}
          Perth (
          <a
            href="https://kinesso.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            KINESSO
          </a>
          ,{" "}
          <a
            href="https://www.interpublic.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Interpublic Group
          </a>
          ). After founding and scaling the award-winning{" "}
          <a
            href="https://www.cremedigital.com?utm_source=www.henriksoderlund.com&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
          >
            Creme Digital
          </a>
          , I transitioned into senior leadership roles where I architect measurement solutions
          and guide high-performance teams across programmatic and performance
          marketing channels. With an inherent drive for optimisation and systematic thinking, I've
          built my career on developing sophisticated systems and automation workflows that transform how
          teams operate—from advanced analytics and server-side implementations to, more recently, intelligent AI-powered solutions that deliver measurable results at scale.
        </p>
        <p>
          Beyond technical innovation, my leadership approach centres on
          developing high-performing teams and cultivating lasting client
          relationships. Throughout my career, I've successfully rebuilt teams
          during challenging transitions, mentored 20+ professionals, and delivered compelling
          presentations that have secured major partnerships. My exceptionally broad
          technical skillset combined with solutions-driven mindset enables me to solve complex, multi-faceted challenges that
          others find intractable—whether designing custom performance tracking
          systems or implementing intelligent automation workflows that transform team operations.
        </p>
        
        <div className="expertise-link-section">
          <a href="/expertise" className="expertise-link">
            Explore My Expertise <span style={{fontSize: '1.2em'}}>→</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
