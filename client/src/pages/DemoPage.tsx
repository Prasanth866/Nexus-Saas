import './DemoPage.css';

type DemoPageProps = {
  onOpenAuth: (mode?: 'login' | 'signup') => void;
};

export default function DemoPage({ onOpenAuth }: DemoPageProps) {
  return (
    <div className="demo-page">
      <header className="demo-topbar">
        <div className="demo-brand">
          <div className="demo-brand-mark">
            N
            <span>7</span>
          </div>
          <div className="demo-brand-copy">
            <div className="demo-brand-name">exus</div>
            <div className="demo-brand-tag">join together</div>
          </div>
        </div>

        <nav className="demo-nav" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="demo-actions">
          <button type="button" className="demo-pill demo-pill-dark" onClick={() => onOpenAuth('signup')}>
            Sign up
          </button>
          <button type="button" className="demo-pill demo-pill-light" onClick={() => onOpenAuth('login')}>
            Log in
          </button>
        </div>
      </header>

      <main className="demo-main">
        <section className="demo-hero">
          <p className="demo-kicker">
            The digital central command center for modern engineering teams. Streamline your workflows, track velocity, and eliminate operational friction in real time.
          </p>

          <button type="button" className="demo-cta" onClick={() => onOpenAuth('signup')}>
            <span>Get Started</span>
            <span className="demo-cta-badge" aria-hidden="true">
              ▶
            </span>
          </button>
        </section>

        <section className="demo-panels">
          <article className="demo-panel demo-panel-empty" id="features">
            <div className="demo-panel-text">
              <h2>Project Lifecycle Management</h2>
              <p>
                Allows your organization to define, execute, and evaluate operational milestones that align with overarching business goals, promoting cross-functional development and ensuring predictable product delivery windows.
              </p>
              <h3 className="demo-mt">Agile & Sprint Governance</h3>
              <p>
                Simplifies the planning, scoping, and automated tracking of iteration cycles to support data-driven velocity forecasting while maintaining clear alignment with product roadmaps and engineering standards.
              </p>
            </div>
            <div className="demo-panel-visual demo-visual-slot" aria-hidden="true" />
          </article>

          <article className="demo-panel demo-panel-alt demo-panel-empty" id="about">
            <div className="demo-panel-text">
              <h2>Why Team collaboration?</h2>
              <p>
                Because building complex software requires zero friction. Nexus centralizes your team's lifecycle into a single dashboard view, keeping your frontend, backend, and flow management completely aligned from initial code patch to production deployment.
              </p>
            </div>
            <div className="demo-panel-visual demo-visual-slot" aria-hidden="true" />
          </article>

          <article className="demo-panel demo-panel-empty" id="pricing">
            <div className="demo-panel-text">
              <h2>Audit-Ready Activity Stream</h2>
              <p>
                Maintains full operational transparency and accountability by automatically chronologizing all task status changes, structural modifications, and system interventions into an immutable data ledger.
              </p>
              <h3 className="demo-mt">Predictive Velocity Analytics</h3>
              <p>
                Leverages inline analytical dashboards and burndown metrics to deliver data-driven insight into project health, allowing managers to proactively identify, evaluate, and mitigate operational delivery risks early.
              </p>
            </div>
            <div className="demo-panel-visual demo-visual-slot" aria-hidden="true" />
          </article>
        </section>
      </main>

      <footer className="demo-footer" id="contact">
        <div className="demo-footer-brand">
          <div className="demo-brand compact">
            <div className="demo-brand-mark">
              N
              <span>7</span>
            </div>
            <div className="demo-brand-copy">
              <div className="demo-brand-name">exus</div>
              <div className="demo-brand-tag">join together</div>
            </div>
          </div>
          <p>
            Need help setting up your workspace? We'll help you get started and keep everything in sync.
          </p>
          
          <div className="demo-social-links">
            <a href="#" className="demo-social-circle">in</a>
            <a href="#" className="demo-social-circle">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="demo-footer-contact">
          <h4>Contact us</h4>
          <a href="mailto:nexuscorp@gmail.com">Nexuscorp@gmail.com</a>
          <a href="mailto:PBrothers@gmail.com">PBrothers@gmail.com</a>
          <a href="tel:+919363977912">+91 9363977912</a>
        </div>
      </footer>
    </div>
  );
}