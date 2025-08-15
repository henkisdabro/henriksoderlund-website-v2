import swedenFlag from "../assets/flags/se.svg";

const Education = () => {
  return (
    <div className="education-page">
      <h1>Education</h1>

      <section className="content-entry">
        <h2>
          <img src={swedenFlag} alt="Sweden" className="country-flag" />{" "}
          Tertiary Education
        </h2>
        <p className="dates">1999–2006</p>
        <p>Master of Music [M.Mus.] Instrument: Trombone at Lund University</p>
        <p>Malmö, Sweden</p>
      </section>

      <section className="content-entry">
        <h2>
          <img src={swedenFlag} alt="Sweden" className="country-flag" />{" "}
          Secondary Education
        </h2>
        <p className="dates">1996–1999</p>
        <p>Natural Sciences at Kattegattgymnasiet</p>
        <p>Malmö, Sweden</p>
      </section>

      <section className="content-entry">
        <h2>
          <img src={swedenFlag} alt="Sweden" className="country-flag" /> Primary
          Education
        </h2>
        <p className="dates">1987–1996</p>
        <p>Elementary at Örjanskolan</p>
        <p>Halmstad, Sweden</p>
      </section>
    </div>
  );
};

export default Education;
