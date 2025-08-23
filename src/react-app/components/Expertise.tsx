import dashboardImage from '../assets/images/screenshots/dashboard.webp';
import wikiImage from '../assets/images/screenshots/wiki.webp';
import { expertiseData } from '../data/expertise';
import SEOHead from './SEOHead';
import { getSEOData } from '../data/seoData';

const Expertise = () => {
  const imageMap: { [key: string]: string } = {
    dashboardImage,
    wikiImage,
  };
  const seoData = getSEOData('/expertise');

  return (
    <>
      <SEOHead 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        ogType={seoData.ogType}
        schemaData={seoData.schemaData}
      />
      <div className="expertise-page">
      <h1>Expertise</h1>
      
      <section className="consultancy-section">
        <h2>{expertiseData.intro.title}</h2>
        <p>{expertiseData.intro.paragraph}</p>
      </section>

      <section className="leadership-section">
        <h2>{expertiseData.leadershipExpertise.title}</h2>
        <p>{expertiseData.leadershipExpertise.paragraph}</p>
        <div className="skills-grid">
          {expertiseData.leadershipExpertise.categories.map(category => (
            <div className="skill-category" key={category.category}>
              <h3>{category.category}</h3>
              <div className="skills-minimal-pills">
                {category.skills.map(skill => <span className="skill-pill-minimal" key={skill}>{skill}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="technical-skills-section">
        <h2>🛠️ Technical Expertise & Platform Mastery</h2>
        <div className="skills-grid">
          {expertiseData.skillsGrid.map(category => (
            <div className="skill-category" key={category.category}>
              <h3>{category.category}</h3>
              <div className="skills-minimal-pills">
                {category.skills.map(skill => <span className="skill-pill-minimal" key={skill}>{skill}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="platform-experience">
        <h2>{expertiseData.platformExperience.title}</h2>
        <p>{expertiseData.platformExperience.paragraph}</p>
        <div className="skills-minimal-pills">
          {expertiseData.platformExperience.platforms.map(platform => <span className="skill-pill-minimal" key={platform}>{platform}</span>)}
        </div>
      </section>

      <section className="github-contributions">
        <h2>{expertiseData.githubContributions.title}</h2>
        {expertiseData.githubContributions.contributions.map(contribution => (
          <div className="contribution" key={contribution.title}>
            <h3>🔗 <a href={contribution.url} target="_blank" rel="noopener noreferrer">{contribution.title}</a></h3>
            <p dangerouslySetInnerHTML={{ __html: contribution.description }} />
          </div>
        ))}
      </section>

      <section className="dashboards-section">
        <h2>{expertiseData.dashboards.title}</h2>
        <p>{expertiseData.dashboards.paragraph}</p>
        
        <div className="featured-build">
          <p><strong>Featured Build:</strong></p>
          <p><strong>{expertiseData.dashboards.featured.title}</strong></p>
          <img 
            src={imageMap[expertiseData.dashboards.featured.image]}
            alt="Advanced Campaign & Website Performance Dashboard in Looker Studio showing analytics data, conversion metrics, and real-time performance indicators designed by Henrik Söderlund" 
            className="dashboard-image"
          />
        </div>
      </section>

      <section className="wiki-section">
        <h2>{expertiseData.knowledgeManagement.title}</h2>
        <p>{expertiseData.knowledgeManagement.paragraph}</p>
        <img 
          src={imageMap[expertiseData.knowledgeManagement.image]}
          alt="Professional Company Wiki and Knowledge Management System developed in Notion by Henrik Söderlund, featuring organized documentation, process flows, and team collaboration tools" 
          className="wiki-image"
        />
      </section>

      </div>
    </>
  );
};

export default Expertise;