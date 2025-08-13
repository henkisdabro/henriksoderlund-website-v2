import React from 'react';

const Consultation: React.FC = () => {
  return (
    <div className="consultation-page">
      <h1>Consultation</h1>
      
      <section className="intro-section">
        <p>
          If you need help with technology-related problems or ask questions about close-to anything, feel free book a slot on my calendar and we'll jump on a call. Below is a simple pricing table for easy reference. If you're in doubt, don't worry, just send across a reasonable amount, and we'll tally up after the session.
        </p>
      </section>

      <section className="services-section">
        <h2>📃 Services Offered</h2>
        <ul>
          <li>General Consultation, ask me anything!</li>
          <li>Google Tag Manager
            <ul>
              <li>Client-side solutions, custom integration</li>
              <li>Server-side solutions, setup and planning</li>
              <li>Troubleshooting and building of <code>dataLayer</code> solutions</li>
            </ul>
          </li>
          <li>Google Analytics
            <ul>
              <li>Audits</li>
              <li>Migrations</li>
              <li>Measurement Plans</li>
              <li>Enhanced Ecommerce</li>
              <li>Full Implementations</li>
            </ul>
          </li>
          <li>Other knowledge areas from my <a href="/skills">skills page</a></li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>🪂 Zero Risk Policy</h2>
        <p>
          If the consult did not meet your expected standard, I'll refund any fee paid, no questions asked. I aim to deliver incredible value and solve your problems in the best possible way ❤️
        </p>
      </section>

      <section className="pricing-section">
        <h2>🎫 Appointment Prices & Duration</h2>
        <table className="pricing-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Duration/Type</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>General Questions</td>
              <td>30min</td>
              <td>AUD 150</td>
            </tr>
            <tr>
              <td>GTM & GA Q/A or Feedback</td>
              <td>30min</td>
              <td>AUD 250</td>
            </tr>
            <tr>
              <td>GA4 Audit or Measurement Plan</td>
              <td>Fixed</td>
              <td>AUD 1,500</td>
            </tr>
            <tr>
              <td>GA4 Projects / Implementations</td>
              <td>Varies</td>
              <td>Contact Me</td>
            </tr>
            <tr>
              <td>Setup of Meta CAPI</td>
              <td>Fixed</td>
              <td>AUD 2,500</td>
            </tr>
            <tr>
              <td>Setup of Server-side GTM</td>
              <td>Varies</td>
              <td>Contact Me</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="calendar-section">
        <h2>🗺️ Book a Slot on my Calendar</h2>
        <div className="calendly-placeholder">
          <p><em>Calendly integration will be implemented here</em></p>
          <p>For now, please contact me directly to schedule a consultation.</p>
        </div>
      </section>

    </div>
  );
};

export default Consultation;