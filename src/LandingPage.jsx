import { useNavigate } from "react-router-dom";
import "./App.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h1 className="logo-title">photobooth</h1>
      <p className="tagline">Capture the moment, cherish the magic,<br />relive the love</p>
      <button className="start-button" onClick={() => navigate("/booth")}>
        START 📸
      </button>
    </div>
  );
}

export default LandingPage;
