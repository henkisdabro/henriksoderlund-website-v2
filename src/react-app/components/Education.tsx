import React from 'react';
import swedenFlag from '../assets/se.svg';

const Education: React.FC = () => {
  return (
    <div className="education-page">
      <h1>Education</h1>
      
      <section className="content-entry">
        <h2><img src={swedenFlag} alt="Sweden" className="country-flag" /> Tertiary Education</h2>
        <p className="dates">1999–2006</p>
        <p>Master of Music [M.Mus.] Instrument: Trombone at Lund University</p>
        <p>Malmöe, Sweden</p>
      </section>

      <section className="content-entry">
        <h2><img src={swedenFlag} alt="Sweden" className="country-flag" /> Secondary Education</h2>
        <p className="dates">1996–1999</p>
        <p>Natural Sciences at Kattegattgymnasiet</p>
        <p>Malmöe, Sweden</p>
      </section>

      <section className="content-entry">
        <h2><img src={swedenFlag} alt="Sweden" className="country-flag" /> Primary Education</h2>
        <p className="dates">1987–1996</p>
        <p>Elementary at Örjanskolan</p>
        <p>Halmstad, Sweden</p>
      </section>

    </div>
  );
};

export default Education;