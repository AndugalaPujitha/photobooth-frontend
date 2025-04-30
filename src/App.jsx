import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import PhotoBooth from "./PhotoBooth";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/booth" element={<PhotoBooth />} />
      </Routes>
    </Router>
  );
}

export default App;
