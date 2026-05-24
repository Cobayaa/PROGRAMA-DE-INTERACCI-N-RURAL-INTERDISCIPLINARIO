import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Whoweare from "./pages/Whoweare";
import News from "./pages/News";
import Contact from "./pages/Contact";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quienes_somos" element={<Whoweare />} />
        <Route path="/noticias" element={<News />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;