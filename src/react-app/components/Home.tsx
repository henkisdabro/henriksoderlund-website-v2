import { useEffect, useRef } from "react";
import profileImage from "../assets/images/henrik-profile-small.webp";

const Home = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Capture ref value at effect start to avoid stale closure in cleanup
    const contentElement = contentRef.current;

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
      if (!contentElement) return;

      // Clear any existing wrapped keywords first
      const existingWraps = contentElement.querySelectorAll('.breathe-keyword');
      existingWraps.forEach(wrap => {
        const parent = wrap.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(wrap.textContent || ''), wrap);
          if (parent.normalize) {
            parent.normalize(); // Merge adjacent text nodes
          }
        }
      });
      
      // Safari-compatible text node finding
      const findTextNodes = (element: Element): Text[] => {
        const textNodes: Text[] = [];
        const walker = document.createTreeWalker(
          element,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node: Node) => {
              return node.nodeValue && node.nodeValue.trim() && 
                     node.parentElement && !node.parentElement.classList.contains('breathe-keyword')
                     ? NodeFilter.FILTER_ACCEPT 
                     : NodeFilter.FILTER_REJECT;
            }
          }
        );
        
        let node: Text | null;
        while ((node = walker.nextNode() as Text)) {
          textNodes.push(node);
        }
        return textNodes;
      };
      
      const textNodes = findTextNodes(contentElement);
      
      // Process text nodes to wrap keywords (longest first to avoid conflicts)
      // Using safe DOM manipulation instead of innerHTML to prevent XSS
      const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);

      textNodes.forEach(textNode => {
        const content = textNode.nodeValue || "";
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let hasKeyword = false;

        // Find all keyword matches with their positions
        const matches: { start: number; end: number; text: string }[] = [];
        sortedKeywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
          let match;
          while ((match = regex.exec(content)) !== null) {
            // Check if this position overlaps with an existing match
            const overlaps = matches.some(m =>
              (match!.index >= m.start && match!.index < m.end) ||
              (match!.index + match![0].length > m.start && match!.index + match![0].length <= m.end)
            );
            if (!overlaps) {
              matches.push({ start: match.index, end: match.index + match[0].length, text: match[0] });
            }
          }
        });

        if (matches.length === 0) return;
        hasKeyword = true;

        // Sort matches by position
        matches.sort((a, b) => a.start - b.start);

        // Build fragment using safe DOM methods (no innerHTML)
        matches.forEach(match => {
          // Add text before the match
          if (match.start > lastIndex) {
            fragment.appendChild(document.createTextNode(content.slice(lastIndex, match.start)));
          }
          // Add the wrapped keyword
          const span = document.createElement('span');
          span.className = 'breathe-keyword';
          span.textContent = match.text; // Safe: uses textContent, not innerHTML
          fragment.appendChild(span);
          lastIndex = match.end;
        });

        // Add remaining text
        if (lastIndex < content.length) {
          fragment.appendChild(document.createTextNode(content.slice(lastIndex)));
        }

        if (hasKeyword && textNode.parentNode) {
          textNode.parentNode.replaceChild(fragment, textNode);
        }
      });
      
      // Get all keyword elements with a small delay for Safari
      setTimeout(() => {
        if (contentElement) {
          keywordElements = Array.from(contentElement.querySelectorAll('.breathe-keyword'));
        }
      }, 100);
    };

    const animateRandomKeyword = () => {
      if (currentlyAnimating || keywordElements.length === 0) return;
      
      currentlyAnimating = true;
      
      // Clear ALL breathing animations first
      keywordElements.forEach(el => {
        el.classList.remove('breathing');
        // Force reflow for each element in Safari
        void (el as HTMLElement).offsetHeight;
      });
      
      const randomElement = keywordElements[Math.floor(Math.random() * keywordElements.length)];
      
      // Safari-compatible animation trigger
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          randomElement.classList.add('breathing');
        });
      });
      
      // Remove animation after completion with Safari-safe timing
      setTimeout(() => {
        randomElement.classList.remove('breathing');
        // Double-check removal for Safari
        requestAnimationFrame(() => {
          randomElement.classList.remove('breathing');
          currentlyAnimating = false;
        });
      }, 3300); // Slightly longer than animation for Safari
    };

    // Initialize with Safari-compatible timing
    setTimeout(() => {
      createBreathingEffect();
      
      // Start animation loop with additional delay for Safari
      setTimeout(() => {
        animationInterval = setInterval(() => {
          animateRandomKeyword();
        }, 4000); // Every 4 seconds
      }, 500);
      
    }, 1000);

    // Cleanup - clear interval and remove DOM mutations to prevent memory leaks
    return () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
      currentlyAnimating = false;

      // Clean up wrapped keyword elements on unmount (using captured ref value)
      if (contentElement) {
        const existingWraps = contentElement.querySelectorAll('.breathe-keyword');
        existingWraps.forEach(wrap => {
          const parent = wrap.parentNode;
          if (parent) {
            parent.replaceChild(document.createTextNode(wrap.textContent || ''), wrap);
            if (parent.normalize) {
              parent.normalize(); // Merge adjacent text nodes
            }
          }
        });
      }
    };
  }, []);
  return (
    <div className="home-page" ref={contentRef}>
      <div className="hero-section">
        <img
          src={profileImage}
          alt="Henrik Söderlund - Technology Leader & AI Innovator based in Perth, Australia"
          className="profile-image"
        />
        <h1>Henrik Söderlund</h1>
        <p className="lead">
          Technology Leader & AI Solutions Expert.
          <br />
          Accomplished agency founder and enterprise leader now pursuing strategic consulting opportunities and senior roles, specialising in automation, advanced analytics, and high-performance team development.
        </p>
      </div>

      <section className="content-section">
        <h2>Hello! 👋🏼</h2>
        <p>
          I'm Henrik Söderlund, a technology leader with proven expertise in both entrepreneurial and enterprise environments. After founding and scaling the award-winning{" "}
          <a
            href="https://www.cremedigital.com?utm_source=www.henriksoderlund.com&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
          >
            Creme Digital
          </a>
          , I led media activations at{" "}
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
          ), where I architected measurement solutions and guided high-performance teams across programmatic and performance marketing channels. With an inherent drive for optimisation and systematic thinking, I've built my career on developing sophisticated systems and automation workflows that transform how teams operate - from advanced analytics and server-side implementations to intelligent AI-powered solutions that deliver measurable results at scale.
        </p>
        <p>
          Beyond technical innovation, my leadership approach centres on
          developing high-performing teams and cultivating lasting client
          relationships. Throughout my career, I've successfully rebuilt teams
          during challenging transitions, mentored 20+ professionals, and delivered compelling
          presentations that have secured major partnerships. My exceptionally broad
          technical skillset combined with solutions-driven mindset enables me to solve complex, multi-faceted challenges that
          others find intractable - whether designing custom performance tracking
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
