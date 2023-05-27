import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./Dashboard";
import Home from "./Home";
import OnBoarding from "./Onboarding";
import Chat from "./Chat";
import { useCookies } from "react-cookie";
import ClientOnBoarding from "./clientOnboarding";
import ClientDashboard from "./ClientDashboard";
import axios from "./axios";
import { useEffect, useState, useContext } from 'react';
import { UserTypeContext } from './UserTypeContext';



function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["userId"]);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);



  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("/auth/user");
        setUserId(response.data.user._id);
      } catch (error) {
        console.error("Could not fetch user");
      }
    };
    getUser();
  }, []);

  const authToken = cookies.AuthToken;

console.log('userType', userType)

  return (
    <UserTypeContext.Provider value={{ userType, setUserType }}>
    <div className="app">
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home />} />

          {(authToken || userId) && "client" && <Route path="/dashboard" element={<Dashboard />} />}

          {(authToken || userId) && "freelancer" && (
            <Route path="/clientdashboard" element={<ClientDashboard />} />
          )}

          {(authToken || userId) && "freelancer" && <Route path="/onboarding" element={<OnBoarding />} />}
          {(authToken || userId) && "client" && (
            <Route path="/clientonboarding" element={<ClientOnBoarding />} />
          )}
        </Routes>
      </BrowserRouter>
    </div>
    </UserTypeContext.Provider>
  );
}

export default App;
