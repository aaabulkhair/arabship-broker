import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ListCargoPage from './pages/ListCargoPage';
import ListVesselPage from './pages/ListVesselPage';
import ContactPage from './pages/ContactPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/list-cargo" element={<ListCargoPage />} />
            <Route path="/list-vessel" element={<ListVesselPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;