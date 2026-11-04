
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";

function Onboarding() {
  const navigate = useNavigate();

  function handleGetStarted() {
    navigate("/home");
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">

        {/* Illustration Section */}

        <div className="onboarding-illustration">

          <div className="decoration-circle"></div>

          <div className="wave-pattern wave-top">
            ≋≋≋
            <br />
            ≋≋≋
            <br />
            ≋≋≋
          </div>

          <div className="wave-pattern wave-bottom">
            ≋≋≋
            <br />
            ≋≋≋
            <br />
            ≋≋≋
          </div>

        </div>

        {/* Content Section */}

        <div className="onboarding-content">

          <h1>Manage What To Do</h1>

          <p>
            The best way to manage what you have to do,
            don't forget your plans
          </p>

          <button
            className="get-started-button"
            onClick={handleGetStarted}
          >
            Get Started
          </button>

        </div>

      </div>
    </div>
  );
}

export default Onboarding;
