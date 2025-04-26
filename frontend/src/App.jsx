import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import Header from "./pages/Header";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import BoardDetail from "./pages/BoardDetail";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <AuthProvider>
      <div className={isDarkMode ? 'dark-mode' : ''}>
        <BrowserRouter>
          <Header onToggleDarkMode={handleToggleDarkMode} isDarkMode={isDarkMode} />
          <div className="content">
            <Routes>
              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard isDarkMode={isDarkMode} />
                </PrivateRoute>
              } />
              <Route path="/board/:id" element={
                <PrivateRoute>
                  <BoardDetail isDarkMode={isDarkMode} />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
