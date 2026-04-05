import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Whoweare from "./pages/Whoweare";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quienes_somos" element={<Whoweare />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;