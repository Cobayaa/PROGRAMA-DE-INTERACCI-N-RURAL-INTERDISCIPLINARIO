import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthApi } from "./Api/AuthApi.js";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Whoweare from "./pages/Whoweare";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Login from "./pages/login.jsx";
import About from "./pages/About.jsx";
import Register from "./pages/register.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// ------------- cms components -------------
import ContactCMS from "./cms/ContactCMS.jsx";
import UsersCMS from "./cms/UsersCMS.jsx";
import ContentCMS from "./cms/ContentCMS.jsx";
import NewsCMS from "./cms/NewsCMS.jsx";

import "./index.css";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthApi();

  if (isCheckingAuth) return null;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthApi();

  if (isCheckingAuth) return null;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  
  return children;
};

const App = () => {
  const { isAuthenticated, isCheckingAuth } = useAuthApi();
  
  if (isCheckingAuth) return null;
  
  return (
    <Router>
      {!isAuthenticated && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quienes_somos" element={<Whoweare />} />
        <Route path="/noticias" element={<News />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/cms/contacto" 
          element={
            <ProtectedRoute>
              <ContactCMS />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cms/contenido" 
          element={
            <ProtectedRoute>
              <ContentCMS />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cms/noticias" 
          element={
            <ProtectedRoute>
              <NewsCMS />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/cms/usuarios" 
          element={
            <AdminRoute>
              <UsersCMS />
            </AdminRoute>
          } 
        />
        
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;