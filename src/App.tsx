import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ListCargoPage from './pages/ListCargoPage';
import ListVesselPage from './pages/ListVesselPage';

import ContactPage from './pages/ContactPage';
import SignInPage from './pages/SignInPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
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
              <Route path="/sign-in" element={<SignInPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;