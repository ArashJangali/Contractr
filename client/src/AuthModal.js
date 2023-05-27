import { useEffect, useState, useContext } from "react";
import axios from "./axios.js";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import ChatHeader from "./ChatHeader";
import { FaGoogle } from 'react-icons/fa';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import colorLogo from "./logo-images/logo-color.png"
import { UserTypeContext } from './UserTypeContext';


const AuthModal = ({ setShowAuthModal, isSignUp, client, freelancer, showAuthModal }) => {
  const [url, setUrl] = useState(null);
  const [name, setName] = useState(null);

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [googleAuth, setGoogleAuth] = useState(false);
  const [showPages, setShowPages] = useState(false);
  const { setUserType } = useContext(UserTypeContext)

  let navigate = useNavigate();


  function handleClick() {
    setShowAuthModal(false);
  }

 
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (isSignUp && password !== confirmPassword) {
        setError("Passwords need to match!");
        return;
      }

      let route;
      if (freelancer) {
        route = isSignUp ? "signup" : "login";
      } else if (!freelancer) {
        route = isSignUp ? "clientsignup" : "clientlogin";
      }

      try {
        const response = await axios.post(
          `/${route}`,
          { email, password },
          {
            withCredentials: true,
          }
        );

        setName(response.data.name);
        setUrl(response.data.url);

        if (client) {
          setCookie("AuthToken", response.data.token);
          setCookie("UserId", response.data.client_user_id);
        } else if (freelancer) {
          setCookie("AuthToken", response.data.token);
          setCookie("UserId", response.data.userID);
        }

        const success = response.status === 201;

        if (success && isSignUp && freelancer) navigate("/onboarding");
        if (success && isSignUp && client) navigate("/clientonboarding");

        if (success && !isSignUp && client)
          navigate("/dashboard", { state: { client: true } });

        if (success && !isSignUp && freelancer) {
        console.log('freelancer', freelancer)
          navigate("/clientdashboard", { state: { freelancer: true } });
        }

        window.location.reload();
      } catch (error) {
        console.log("error in axios request", error);
      }

      //     const response = await axios.post(`/${isSignUp ? 'clientsignup' : 'clientlogin'}`, {email, password})
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log("error response object", error.response);
      }
      if (error.response.status === 409) {
        setError(
          "The provided email is already in use. Please log in or use a different email to register."
        );
      } else {
        console.log("other error!");
      }
    }
  }
  async function googleSignIn() {
    const userType = freelancer ? "freelancer" : "client";
    const backendUrl = "http://localhost:8001";
    const authUrl = isSignUp
      ? `${backendUrl}/auth/google/${userType}/signup`
      : `${backendUrl}/auth/google/${userType}/login`;

    const authWindow = window.open(authUrl, "_blank", "width=500,height=600");
  }

  useEffect(() => {
    function handleMessage(event) {
      let redirectUrl = "";

      if (event.data.message === "Successful login") {
        if (!isSignUp) {
          if (freelancer) {
            redirectUrl = "/clientdashboard";
          } else {
            redirectUrl = "/dashboard";
          }
        }
      } else if (event.data.message === "Account created successfully!") {
        if (isSignUp) {
          if (freelancer) {
            redirectUrl = "/onboarding";
          } else {
            redirectUrl = "/clientonboarding";
          }
        }
      }

      const userType = freelancer ? freelancer : client;

      if (event.data.status === "success") {
        navigate(redirectUrl, { state: { userType: true } });
      } else if (
        event.data.message === "Login failed. Please press 'CREATE ACCOUNT'"
      ) {
        setError("Login failed. Please Create an Account.");
        
      } else {
        setError("Login failed. Please Create an Account.");
        
      }
    }

    window.addEventListener("message", handleMessage);
    
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  
  return (
    <div className="authModal">
      <div className="cross" onClick={handleClick}>
        <AiOutlineCloseCircle />
      </div>
      <h2>{isSignUp ? "Create Account" : "Log In"}</h2>
      <img className="authmodal-img" src={colorLogo} />

      <form
        className={isSignUp ? "sign-up-form" : null}
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          required={true}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignUp && (
          <input
            type="password"
            id="check-password"
            name="check-password"
            placeholder="Confirm Password"
            required={true}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <input className="btn-secondary" type="submit" />
        <h5>OR</h5>
        <button onClick={googleSignIn} className="btn-secondary" type="button">
          <FaGoogle className="google-icon" />{" "}
          {isSignUp ? "Sign Up With Google" : "Sign In With Google"}
        </button>
        {error && (<p style={{marginTop: "10px"}}>{error}</p>)}
      </form>
    </div>
  );
};

export default AuthModal;
