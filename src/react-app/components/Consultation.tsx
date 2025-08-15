import { consultationData } from '../data/consultation';

const Consultation = () => {
  return (
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
              <li key={item.name}><strong>{item.name}</strong> - {item.description}</li>
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
        <div className="calendly-placeholder">
          {consultationData.scheduling.paragraphs.map((p, i) => <p key={i} dangerouslySetInnerHTML={{ __html: p }} />)}
        </div>
      </section>

    </div>
  );
};

export default Consultation;