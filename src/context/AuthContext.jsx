import React, { createContext, useState, useContext, useEffect } from 'react';
import { calculateAnaemiaRisk } from '../services/predictionEngine';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Initial mock database
const INITIAL_USERS = [
  {
    email: 'demo@naricycle.com',
    password: 'demo123',
    name: 'Anjali Sharma',
    age: '22',
    language: 'en',
    healthConditions: 'None',
    cycleLength: '28',
    periodLength: '5',
    anaemiaRisk: 'Low',
    guardianName: 'Rahul Sharma',
    guardianPhone: '919876543210',
    onboardingResponses: {
      regularPeriods: 'yes',
      severeCramps: 'no',
      heavyBleeding: 'no',
      fatigue: 'no',
      dizzy: 'no',
      nutrition: 'good'
    }
  },
  {
    email: 'critical@naricycle.com',
    password: 'critical123',
    name: 'Priya Devi',
    age: '19',
    language: 'hi',
    healthConditions: 'Chronic Fatigue',
    cycleLength: '32',
    periodLength: '8',
    anaemiaRisk: 'High',
    isCritical: true,
    guardianName: 'Suresh Devi',
    guardianPhone: '919000000000',
    onboardingResponses: {
      regularPeriods: 'no',
      severeCramps: 'yes',
      heavyBleeding: 'yes',
      fatigue: 'yes',
      dizzy: 'yes',
      nutrition: 'poor'
    }
  }
];

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Initialize mock database if not exists
    const storedUsers = localStorage.getItem('naricycle_users');
    if (!storedUsers) {
      localStorage.setItem('naricycle_users', JSON.stringify(INITIAL_USERS));
      setUsers(INITIAL_USERS);
    } else {
      setUsers(JSON.parse(storedUsers));
    }

    // Check for active session
    const activeEmail = localStorage.getItem('naricycle_active_user') || sessionStorage.getItem('naricycle_active_user');
    if (activeEmail) {
      const allUsers = JSON.parse(localStorage.getItem('naricycle_users') || '[]');
      const foundUser = allUsers.find(u => u.email === activeEmail);
      if (foundUser) {
        setIsAuthenticated(true);
        setUser(foundUser);
      }
    }
  }, []);

  const login = (email, password, rememberMe) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setIsAuthenticated(true);
      setUser(foundUser);
      
      if (rememberMe) {
        localStorage.setItem('naricycle_active_user', email);
      } else {
        sessionStorage.setItem('naricycle_active_user', email);
      }
      
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (userData) => {
    // Check if user exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'User already exists' };
    }

    const newUser = {
      ...userData,
      anaemiaRisk: calculateAnaemiaRisk(userData.onboardingResponses),
      healthConditions: userData.otherConditions || 'None'
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('naricycle_users', JSON.stringify(updatedUsers));
    
    setIsAuthenticated(true);
    setUser(newUser);
    sessionStorage.setItem('naricycle_active_user', userData.email);
    
    return { success: true };
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    const updatedUsers = users.map(u => u.email === user.email ? updatedUser : u);
    
    setUsers(updatedUsers);
    setUser(updatedUser);
    localStorage.setItem('naricycle_users', JSON.stringify(updatedUsers));
    
    return { success: true };
  };

  const initiateSOS = (reason = "Health Emergency") => {
    if (!user || !user.guardianPhone) return;
    
    const message = `🚨 NariCycle SOS: ${user.name} has triggered an emergency alert. Reason: ${reason}. Please check on them immediately!`;
    const whatsappUrl = `https://wa.me/${user.guardianPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Update local state to reflect SOS sent
    updateProfile({ lastSosSent: new Date().toISOString() });
    return true;
  };



  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('naricycle_active_user');
    sessionStorage.removeItem('naricycle_active_user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout, updateProfile, initiateSOS }}>
      {children}
    </AuthContext.Provider>
  );
};
