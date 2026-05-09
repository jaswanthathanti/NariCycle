import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/Landing/LandingPage';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import SignUp from './pages/Signup/SignUp';
import Profile from './pages/Profile/Profile';
import Anaemia from './pages/HealthConditions/Anaemia';
import PCOS from './pages/HealthConditions/PCOS';
import Endometriosis from './pages/HealthConditions/Endometriosis';
import Nutrition from './pages/HealthConditions/Nutrition';

// New Dashboard Pages
import HealthConditionsMain from './pages/DashboardViews/HealthConditionsMain';
import CycleCalendarPage from './pages/DashboardViews/CycleCalendarPage';
import SymptomTracker from './pages/DashboardViews/SymptomTracker';
import HealthInsights from './pages/DashboardViews/HealthInsights';
import Reminders from './pages/DashboardViews/Reminders';
import NearbyClinics from './pages/DashboardViews/NearbyClinics';

// Component to protect private routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* Educational Routes */}
      <Route path="/conditions/anaemia" element={<Anaemia />} />
      <Route path="/conditions/pcos" element={<PCOS />} />
      <Route path="/conditions/endometriosis" element={<Endometriosis />} />
      <Route path="/conditions/nutrition" element={<Nutrition />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } 
      />
      <Route path="/health-conditions" element={<PrivateRoute><HealthConditionsMain /></PrivateRoute>} />
      <Route path="/calendar" element={<PrivateRoute><CycleCalendarPage /></PrivateRoute>} />
      <Route path="/symptoms" element={<PrivateRoute><SymptomTracker /></PrivateRoute>} />
      <Route path="/insights" element={<PrivateRoute><HealthInsights /></PrivateRoute>} />
      <Route path="/reminders" element={<PrivateRoute><Reminders /></PrivateRoute>} />
      <Route path="/clinics" element={<PrivateRoute><NearbyClinics /></PrivateRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
