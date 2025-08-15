import dashboardImage from '../assets/images/screenshots/dashboard.jpg';
import wikiImage from '../assets/images/screenshots/wiki.jpg';
import { expertiseData } from '../data/expertise';

const Expertise = () => {
  const imageMap: { [key: string]: string } = {
    dashboardImage,
    wikiImage,
  };

  return (
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
              <div className="skill-tags">
                {category.skills.map(skill => <span className="skill-tag" key={skill}>{skill}</span>)}
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
              <div className="skill-tags">
                {category.skills.map(skill => <span className="skill-tag" key={skill}>{skill}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="platform-experience">
        <h2>{expertiseData.platformExperience.title}</h2>
        <p>{expertiseData.platformExperience.paragraph}</p>
        <div className="platform-tags">
          {expertiseData.platformExperience.platforms.map(platform => <span className="platform-tag" key={platform}>{platform}</span>)}
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
            alt="Campaign & Website Performance Dashboard in Looker Studio" 
            className="dashboard-image"
          />
        </div>
      </section>

      <section className="wiki-section">
        <h2>{expertiseData.knowledgeManagement.title}</h2>
        <p>{expertiseData.knowledgeManagement.paragraph}</p>
        <img 
          src={imageMap[expertiseData.knowledgeManagement.image]}
          alt="Sample Screenshot of Company Wiki developed in Notion" 
          className="wiki-image"
        />
      </section>

    </div>
  );
};

export default Expertise;