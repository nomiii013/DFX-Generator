// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import DXFForm from "./components/DXFForm";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard"; // ✅ Move import to top (not inside JSX)

function App() {
  return (
    <Router>
      {/* ✅ Navbar har page par hoga */}
      <Navbar />

      {/* ✅ Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/generate" element={<DXFForm />} />
        <Route path="/admin" element={<AdminDashboard />} /> {/* ✅ New route */}
      </Routes>

      {/* ✅ Footer har page par hoga */}
      <Footer />
    </Router>
  );
}

export default App;
