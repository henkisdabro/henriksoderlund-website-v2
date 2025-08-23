import { useState } from 'react';
import { consultationData } from '../data/consultation';
import GoogleCalendarWidget from './GoogleCalendarWidget';
import SEOHead from './SEOHead';
import { getSEOData } from '../data/seoData';

const Consultation = () => {
  const [isCaseStudyExpanded, setIsCaseStudyExpanded] = useState(false);
  const seoData = getSEOData('/consultancy');

  return (
    <>
      <SEOHead 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        ogType={seoData.ogType}
        schemaData={seoData.schemaData}
      />
      <div className="consultation-page">
      <h1>{consultationData.intro.title}</h1>
      
      <section className="intro-section">
        <p>{consultationData.intro.paragraph}</p>
      </section>

      <section className="ai-consultancy-section">
        <h2>{consultationData.aiConsultancy.title}</h2>
        <p>{consultationData.aiConsultancy.paragraph}</p>
        
        <div className="ai-services">
          <h3>{consultationData.aiConsultancy.services.title}</h3>
          <ul>
            {consultationData.aiConsultancy.services.items.map(item => (
              <li key={item.name}><strong>{item.name}</strong><br />{item.description}</li>
            ))}
          </ul>
        </div>

        <h3>{consultationData.aiConsultancy.pricing.title}</h3>
        <table className="modern-pricing-table">
          <thead>
            <tr>
              {consultationData.aiConsultancy.pricing.headers.map(header => <th key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {consultationData.aiConsultancy.pricing.rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => <td key={cellIndex} data-label={consultationData.aiConsultancy.pricing.headers[cellIndex]}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="case-study-section">
        <div className="case-study-header">
          <h2>{consultationData.caseStudy.title}</h2>
          <button 
            type="button"
            className="case-study-toggle" 
            onClick={() => setIsCaseStudyExpanded(!isCaseStudyExpanded)}
            {...{ "aria-expanded": isCaseStudyExpanded ? "true" : "false" }}
            aria-label={isCaseStudyExpanded ? "Collapse case study" : "Expand case study"}
          >
            {isCaseStudyExpanded ? '−' : '+'}
          </button>
        </div>
        <h3 className="case-study-subtitle">
          {consultationData.caseStudy.subtitle}
          {!isCaseStudyExpanded && <span className="expand-hint"> (Click + to read case study)</span>}
        </h3>
        
        {isCaseStudyExpanded && (
          <div className="case-study-expandable">
            <div className="client-overview">
              <div className="client-info">
                <strong>Client:</strong> {consultationData.caseStudy.client.type}<br />
                <strong>Team Size:</strong> {consultationData.caseStudy.client.team}<br />
                <strong>Core Challenge:</strong> {consultationData.caseStudy.client.challenge}
              </div>
            </div>

            <div className="case-study-content">
              <div className="challenge-section">
                <h4>{consultationData.caseStudy.challenge.title}</h4>
                <p>{consultationData.caseStudy.challenge.description}</p>
                <ul className="pain-points">
                  {consultationData.caseStudy.challenge.painPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="solution-section">
                <h4>{consultationData.caseStudy.solution.title}</h4>
                <p>{consultationData.caseStudy.solution.description}</p>
                <div className="solution-components">
                  {consultationData.caseStudy.solution.components.map((component, index) => (
                    <div key={index} className="solution-component">
                      <h5>{component.name}</h5>
                      <p>{component.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="results-section">
                <h4>{consultationData.caseStudy.results.title}</h4>
                <p>{consultationData.caseStudy.results.description}</p>
                <div className="results-metrics">
                  {consultationData.caseStudy.results.metrics.map((metric, index) => (
                    <div key={index} className="metric-card">
                      <div className="metric-value">{metric.value}</div>
                      <div className="metric-name">{metric.metric}</div>
                      <div className="metric-description">{metric.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="technology-section">
                <h4>{consultationData.caseStudy.technologies.title}</h4>
                <ul className="technology-list">
                  {consultationData.caseStudy.technologies.items.map((tech, index) => (
                    <li key={index}>{tech}</li>
                  ))}
                </ul>
              </div>

              <div className="testimonial-section">
                <blockquote className="case-study-testimonial">
                  <p>"{consultationData.caseStudy.testimonial.quote}"</p>
                  <cite>— {consultationData.caseStudy.testimonial.author}</cite>
                </blockquote>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="traditional-services-section">
        <h2>{consultationData.analyticsConsultancy.title}</h2>
        <p>{consultationData.analyticsConsultancy.paragraph}</p>
        
        <div className="analytics-services">
          <h3>{consultationData.analyticsConsultancy.services.title}</h3>
          <ul>
            {consultationData.analyticsConsultancy.services.items.map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>

        <h3>{consultationData.analyticsConsultancy.pricing.title}</h3>
        <table className="modern-pricing-table">
          <thead>
            <tr>
              {consultationData.analyticsConsultancy.pricing.headers.map(header => <th key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {consultationData.analyticsConsultancy.pricing.rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => <td key={cellIndex} data-label={consultationData.analyticsConsultancy.pricing.headers[cellIndex]}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="policy-section">
        <h2>{consultationData.qualityGuarantee.title}</h2>
        <p>{consultationData.qualityGuarantee.paragraph}</p>
      </section>

      <section className="calendar-section">
        <h2>{consultationData.scheduling.title}</h2>
        <div className="calendly-intro">
          {consultationData.scheduling.paragraphs.map((p, i) => <p key={i} dangerouslySetInnerHTML={{ __html: p }} />)}
        </div>
        <GoogleCalendarWidget 
          url={'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2pABHRGGEq9T5Wj5DZmo2QvyA9kwKKRqd-eeO3W25C1EdczwDB_VTJmkDvExvyH5sk5aX1jBUL?gv=true'} 
          label={'Book an appointment'}
          className="consultation-booking-widget"
        />
      </section>

      </div>
    </>
  );
};

export default Consultation;