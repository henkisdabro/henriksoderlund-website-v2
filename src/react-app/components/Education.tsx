import React from 'react';

const Education: React.FC = () => {
  return (
    <div className="education-page">
      <h1>Education</h1>
      
      <section className="education-entry">
        <h4>Tertiary Education</h4>
        <p className="dates"><em>1999–2006</em></p>
        <p>Master of Music [M.Mus.] Instrument: Trombone at Lund University</p>
        <p>Malmöe, Sweden</p>
      </section>

      <section className="education-entry">
        <h4>Secondary Education</h4>
        <p className="dates"><em>1996–1999</em></p>
        <p>Natural Sciences at Kattegattgymnasiet</p>
        <p>Malmöe, Sweden</p>
      </section>

      <section className="education-entry">
        <h4>Primary Education</h4>
        <p className="dates"><em>1987–1996</em></p>
        <p>Elementary at Örjanskolan</p>
        <p>Halmstad, Sweden</p>
      </section>

    </div>
  );
};

export default Education;