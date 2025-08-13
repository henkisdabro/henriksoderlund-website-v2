import React from 'react';

const Consultation: React.FC = () => {
  return (
    <div className="consultation-page">
      <h1>Strategic Technology Consultancy</h1>
      
      <section className="intro-section">
        <p>
          Transform your business with cutting-edge technology solutions. I provide strategic consultation and implementation services for AI automation, business intelligence, and digital transformation initiatives. From concept to deployment, I deliver enterprise-grade solutions that drive measurable results.
        </p>
      </section>

      <section className="ai-consultancy-section">
        <h2>🤖 AI & Automation Consultancy</h2>
        <p>
          Leverage artificial intelligence to automate workflows, enhance decision-making, and create competitive advantages. I specialize in building intelligent systems that integrate seamlessly with your existing business processes.
        </p>
        
        <div className="ai-services">
          <h3>Core AI Services</h3>
          <ul>
            <li><strong>AI-Enabled Automation Systems</strong> - Custom workflows that reduce manual tasks by 70-90%</li>
            <li><strong>Intelligent Process Migration</strong> - Seamless transition of business processes to AI-enhanced systems</li>
            <li><strong>Retrieval-Augmented Generation (RAG)</strong> - Knowledge systems that provide instant, accurate information access</li>
            <li><strong>AI Agent Development</strong> - Autonomous systems for customer service, data analysis, and task automation</li>
            <li><strong>Machine Learning Integration</strong> - Predictive analytics and intelligent decision support systems</li>
            <li><strong>Natural Language Processing</strong> - Document analysis, content generation, and communication automation</li>
          </ul>
        </div>

        <h3>AI Consultancy Pricing & Timelines</h3>
        <table className="modern-pricing-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Timeline</th>
              <th>Investment</th>
              <th>Deliverables</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>AI Strategy & Feasibility Assessment</td>
              <td>1-2 weeks</td>
              <td>AUD 3,500</td>
              <td>Strategic roadmap, ROI analysis, technical specifications</td>
            </tr>
            <tr>
              <td>Workflow Automation System</td>
              <td>3-6 weeks</td>
              <td>AUD 8,500 - 15,000</td>
              <td>End-to-end automation, integration, training, documentation</td>
            </tr>
            <tr>
              <td>RAG Knowledge System</td>
              <td>4-8 weeks</td>
              <td>AUD 12,000 - 25,000</td>
              <td>Custom RAG implementation, API integration, user interface</td>
            </tr>
            <tr>
              <td>AI Agent Development</td>
              <td>6-12 weeks</td>
              <td>AUD 18,000 - 35,000</td>
              <td>Multi-agent system, monitoring dashboard, performance analytics</td>
            </tr>
            <tr>
              <td>Enterprise AI Migration</td>
              <td>8-16 weeks</td>
              <td>Starting at AUD 45,000</td>
              <td>Full system migration, staff training, ongoing support</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="traditional-services-section">
        <h2>📊 Analytics & Digital Intelligence</h2>
        <p>
          Comprehensive analytics solutions that provide actionable insights and drive data-informed decision making across your organization.
        </p>
        
        <div className="analytics-services">
          <h3>Core Analytics Services</h3>
          <ul>
            <li><strong>Google Analytics 4</strong> - Advanced implementations, custom reporting, and conversion optimization</li>
            <li><strong>Google Tag Manager</strong> - Enterprise-grade tracking solutions, server-side implementations</li>
            <li><strong>Business Intelligence Dashboards</strong> - Real-time reporting and performance monitoring systems</li>
            <li><strong>Data Pipeline Architecture</strong> - Scalable data collection and processing solutions</li>
            <li><strong>Conversion Rate Optimization</strong> - Data-driven testing and optimization strategies</li>
          </ul>
        </div>

        <h3>Analytics Consultation Pricing</h3>
        <table className="modern-pricing-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Timeline</th>
              <th>Investment</th>
              <th>Deliverables</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Strategic Analytics Consultation</td>
              <td>1 hour</td>
              <td>AUD 350</td>
              <td>Expert guidance, Q&A, strategic recommendations</td>
            </tr>
            <tr>
              <td>GA4 Enterprise Audit</td>
              <td>1-2 weeks</td>
              <td>AUD 2,800</td>
              <td>Comprehensive audit report, optimization roadmap</td>
            </tr>
            <tr>
              <td>Advanced Measurement Planning</td>
              <td>2-3 weeks</td>
              <td>AUD 4,500</td>
              <td>Custom measurement framework, KPI mapping, implementation guide</td>
            </tr>
            <tr>
              <td>GTM Server-Side Implementation</td>
              <td>3-4 weeks</td>
              <td>AUD 6,500</td>
              <td>Complete server-side setup, testing, documentation</td>
            </tr>
            <tr>
              <td>Meta CAPI & Advanced Tracking</td>
              <td>2-3 weeks</td>
              <td>AUD 4,200</td>
              <td>Full CAPI implementation, event validation, optimization</td>
            </tr>
            <tr>
              <td>Enterprise Analytics Implementation</td>
              <td>4-8 weeks</td>
              <td>Starting at AUD 12,000</td>
              <td>Complete analytics ecosystem, training, ongoing support</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="policy-section">
        <h2>🛡️ Quality Guarantee</h2>
        <p>
          Every engagement is backed by our commitment to excellence. If the delivered solution doesn't meet the agreed specifications or your satisfaction, we'll work to resolve any issues at no additional cost. Your success is our primary objective.
        </p>
      </section>

      <section className="calendar-section">
        <h2>📅 Schedule Your Strategic Session</h2>
        <div className="calendly-placeholder">
          <p>Ready to transform your business with AI and advanced analytics? Let's discuss your specific needs and explore how we can accelerate your digital transformation.</p>
          <p><strong>Book a complimentary 15-minute discovery call to get started.</strong></p>
          <p><em>Calendly integration coming soon. For immediate consultation booking, please contact me directly.</em></p>
        </div>
      </section>

    </div>
  );
};

export default Consultation;