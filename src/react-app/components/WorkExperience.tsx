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

      </div>
    </>
  );
};

export default WorkExperience;