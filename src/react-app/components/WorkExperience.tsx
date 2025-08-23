import { workExperienceData } from '../data/workExperience';
import SEOHead from './SEOHead';
import { getSEOData } from '../data/seoData';

const WorkExperience = () => {
  const seoData = getSEOData('/work-experience');
  
  return (
    <>
      <SEOHead 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        ogType={seoData.ogType}
        schemaData={seoData.schemaData}
      />
      <div className="work-experience-page">
      <h1>Work Experience</h1>
      
      {workExperienceData.map(job => (
        <section className="content-entry" key={job.title}>
          <h2><img src={job.flag} alt={job.location} className="country-flag" /> {job.title}</h2>
          <p className="dates">{job.dates}</p>
          {job.description.map((p, i) => <p key={i}>{p}</p>)}
        </section>
      ))}

      <section className="cta-section" style={{marginTop: '3rem', textAlign: 'center', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
        <h2>Need Expert Technology Leadership?</h2>
        <p>Leverage my proven experience in AI implementation, team building, and digital transformation for your organisation.</p>
        <div style={{marginTop: '1.5rem'}}>
          <a href="/consultancy" className="nav-button primary" title="Explore AI strategy and technology consultancy services">
            View AI Strategy & Technology Consultancy Services
          </a>
        </div>
      </section>

      </div>
    </>
  );
};

export default WorkExperience;