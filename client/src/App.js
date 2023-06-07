import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Home from "./Home";
import OnBoarding from "./Onboarding";
import { useCookies } from "react-cookie";
import ClientOnBoarding from "./clientOnboarding";
import ClientDashboard from "./ClientDashboard";
import axios from "./axios";
import { useEffect, useState } from "react";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["userId"]);
  const [userId, setUserId] = useState(null);

  const [client, setClient] = useState(false);
  const [freelancer, setFreelancer] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/auth/user`
        );
        setUserId(response.data.user._id);
      } catch (error) {
        console.error("Could not fetch user");
      }
    };
    getUser();
  }, []);

  const authToken = cookies.AuthToken;


  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                freelancer={freelancer}
                setFreelancer={setFreelancer}
                setClient={setClient}
                client={client}
              />
            }
          />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/clientdashboard"
            element={
              <ClientDashboard
                freelancer={freelancer}
                setFreelancer={setFreelancer}
              />
            }
          />

          <Route
            path="/onboarding"
            element={<OnBoarding freelancer={freelancer} />}
          />

          <Route path="/clientonboarding" element={<ClientOnBoarding />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
