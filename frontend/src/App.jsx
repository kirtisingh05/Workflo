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

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <AuthProvider>
      <div className={`min-h-screen font-sans antialiased ${isDarkMode ? 'dark' : ''}`}>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
          <BrowserRouter>
            <Header onToggleDarkMode={handleToggleDarkMode} isDarkMode={isDarkMode} />
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
              <Routes>
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/board/:id"
                  element={
                    <PrivateRoute>
                      <BoardDetail />
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
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
              </Routes>
            </main>
          </BrowserRouter>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
