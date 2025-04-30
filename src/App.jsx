import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import PhotoBooth from "./PhotoBooth";
import Footer from "./Footer";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/booth" element={<PhotoBooth />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
