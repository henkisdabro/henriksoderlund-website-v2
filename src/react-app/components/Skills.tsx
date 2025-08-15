import dashboardImage from '../assets/images/screenshots/dashboard.jpg';
import wikiImage from '../assets/images/screenshots/wiki.jpg';
import { skillsData } from '../data/skills';

const Skills = () => {
  const imageMap: { [key: string]: string } = {
    dashboardImage,
    wikiImage,
  };

  return (
    <div className="expertise-page">
      <h1>Expertise</h1>
      
      <section className="consultancy-section">
        <h2>{skillsData.intro.title}</h2>
        <p>{skillsData.intro.paragraph}</p>
      </section>

      <section className="skills-grid">
        {skillsData.skillsGrid.map(category => (
          <div className="skill-category" key={category.category}>
            <h3>{category.category}</h3>
            <div className="skill-tags">
              {category.skills.map(skill => <span className="skill-tag" key={skill}>{skill}</span>)}
            </div>
          </div>
        ))}
      </section>

      <section className="platform-experience">
        <h2>{skillsData.platformExperience.title}</h2>
        <p>{skillsData.platformExperience.paragraph}</p>
        <div className="platform-tags">
          {skillsData.platformExperience.platforms.map(platform => <span className="platform-tag" key={platform}>{platform}</span>)}
        </div>
      </section>

      <section className="github-contributions">
        <h2>{skillsData.githubContributions.title}</h2>
        {skillsData.githubContributions.contributions.map(contribution => (
          <div className="contribution" key={contribution.title}>
            <h3>🔗 <a href={contribution.url} target="_blank" rel="noopener noreferrer">{contribution.title}</a></h3>
            <p dangerouslySetInnerHTML={{ __html: contribution.description }} />
          </div>
        ))}
      </section>

      <section className="dashboards-section">
        <h2>{skillsData.dashboards.title}</h2>
        <p>{skillsData.dashboards.paragraph}</p>
        
        <div className="featured-build">
          <p><strong>Featured Build:</strong></p>
          <p><strong>{skillsData.dashboards.featured.title}</strong></p>
          <img 
            src={imageMap[skillsData.dashboards.featured.image]}
            alt="Campaign & Website Performance Dashboard in Looker Studio" 
            className="dashboard-image"
          />
        </div>
      </section>

      <section className="wiki-section">
        <h2>{skillsData.knowledgeManagement.title}</h2>
        <p>{skillsData.knowledgeManagement.paragraph}</p>
        <img 
          src={imageMap[skillsData.knowledgeManagement.image]}
          alt="Sample Screenshot of Company Wiki developed in Notion" 
          className="wiki-image"
        />
      </section>

    </div>
  );
};

export default Skills;