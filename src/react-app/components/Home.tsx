import { useEffect, useRef } from "react";
import profileImage from "../assets/images/henrik-profile-small.jpg";

const Home = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Keywords to highlight with breathing effect
    const keywords = [
      "leadership",
      "programmatic", 
      "automation",
      "AI-powered",
      "mentored",
      "workflows",
      "technology",
      "measurement",
      "systems",
      "innovation",
      "presentations",
      "analytics",
      "optimisation",
      "solutions",
      "teams",
      "partnerships",
      "scaling",
      "technical",
      "technology leader",
      "AI Solutions Expert",
      "advanced analytics", 
      "performance marketing",
      "intelligent AI-powered solutions",
      "high-performing teams",
      "technical innovation",
      "systematic thinking",
      "sophisticated systems",
      "measurable results",
      "solutions-driven mindset"
    ];

    let animationInterval: NodeJS.Timeout;
    let keywordElements: Element[] = [];
    let currentlyAnimating = false;
    
    const createBreathingEffect = () => {
      if (!contentRef.current) return;
      
      // Clear any existing wrapped keywords first
      const existingWraps = contentRef.current.querySelectorAll('.breathe-keyword');
      existingWraps.forEach(wrap => {
        const parent = wrap.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(wrap.textContent || ''), wrap);
          parent.normalize(); // Merge adjacent text nodes
        }
      });
      
      // Find and wrap keywords
      const walker = document.createTreeWalker(
        contentRef.current,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      const textNodes: Text[] = [];
      let node: Text | null;
      
      while ((node = walker.nextNode() as Text)) {
        if (node.nodeValue && node.nodeValue.trim() && node.parentElement && !node.parentElement.classList.contains('breathe-keyword')) {
          textNodes.push(node);
        }
      }
      
      // Process text nodes to wrap keywords (longest first to avoid conflicts)
      const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
      
      textNodes.forEach(textNode => {
        let content = textNode.nodeValue || "";
        let hasKeyword = false;
        
        sortedKeywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
          if (regex.test(content)) {
            content = content.replace(regex, `<span class="breathe-keyword">$&</span>`);
            hasKeyword = true;
          }
        });
        
        if (hasKeyword && textNode.parentNode) {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = content;
          while (wrapper.firstChild) {
            textNode.parentNode.insertBefore(wrapper.firstChild, textNode);
          }
          textNode.parentNode.removeChild(textNode);
        }
      });
      
      // Get all keyword elements
      keywordElements = Array.from(contentRef.current.querySelectorAll('.breathe-keyword'));
    };

    const animateRandomKeyword = () => {
      if (currentlyAnimating || keywordElements.length === 0) return;
      
      currentlyAnimating = true;
      
      // Clear ALL breathing animations first
      keywordElements.forEach(el => el.classList.remove('breathing'));
      
      const randomElement = keywordElements[Math.floor(Math.random() * keywordElements.length)];
      
      // Force reflow to ensure clean state
      randomElement.offsetHeight; // Force reflow
      randomElement.classList.add('breathing');
      
      // Remove animation after completion
      setTimeout(() => {
        randomElement.classList.remove('breathing');
        currentlyAnimating = false;
      }, 3200); // Slightly longer than animation
    };

    // Initialize
    setTimeout(() => {
      createBreathingEffect();
      
      // Start animation loop
      animationInterval = setInterval(() => {
        animateRandomKeyword();
      }, 4000); // Every 4 seconds
      
    }, 1000);

    // Cleanup
    return () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
      currentlyAnimating = false;
    };
  }, []);
  return (
    <div className="home-page" ref={contentRef}>
      <div className="hero-section">
        <img
          src={profileImage}
          alt="Henrik Söderlund"
          className="profile-image"
        />
        <h1>Henrik Söderlund</h1>
        <p className="lead">
          Digital Media Leader & AI Solutions Expert.
          <br />
          Former agency founder now architecting performance marketing solutions through automation, advanced analytics, and strategic team development in enterprise environments.
        </p>
      </div>

      <section className="content-section">
        <h2>Hello! 👋🏼</h2>
        <p>
          I'm Henrik Söderlund, a technology leader responsible for
          media activations at{" "}
          <a
            href="https://initiative.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Initiative
          </a>{" "}
          Perth (
          <a
            href="https://kinesso.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            KINESSO
          </a>
          ,{" "}
          <a
            href="https://www.interpublic.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Interpublic Group
          </a>
          ). After founding and scaling the award-winning{" "}
          <a
            href="https://www.cremedigital.com?utm_source=www.henriksoderlund.com&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
          >
            Creme Digital
          </a>
          , I transitioned into senior leadership roles where I architect measurement solutions
          and guide high-performance teams across programmatic and performance
          marketing channels. With an inherent drive for optimisation and systematic thinking, I've
          built my career on developing sophisticated systems and automation workflows that transform how
          teams operate—from advanced analytics and server-side implementations to, more recently, intelligent AI-powered solutions that deliver measurable results at scale.
        </p>
        <p>
          Beyond technical innovation, my leadership approach centres on
          developing high-performing teams and cultivating lasting client
          relationships. Throughout my career, I've successfully rebuilt teams
          during challenging transitions, mentored 20+ professionals, and delivered compelling
          presentations that have secured major partnerships. My exceptionally broad
          technical skillset combined with solutions-driven mindset enables me to solve complex, multi-faceted challenges that
          others find intractable—whether designing custom performance tracking
          systems or implementing intelligent automation workflows that transform team operations.
        </p>
        
        <div className="expertise-link-section">
          <a href="/expertise" className="expertise-link">
            Explore My Expertise <span style={{fontSize: '1.2em'}}>→</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
