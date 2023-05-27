import { useCookies } from "react-cookie";
import axios from "./axios.js";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Contractr from "./Contractr.jsx";
import Customer from "./Customer.js";

function ChatHeader({ isClient, isFreelancer, cookies, user, removeCookie }) {

  console.log('chatheader', isFreelancer )

  let navigate = useNavigate();


  function logout() {
    removeCookie('UserId', cookies.UserId)
    removeCookie('AuthToken', cookies.AuthToken)
    navigate('/')
  }


  return (
    <>
    { user &&
    <div className="chat-header">
      <div className="profile">
        <div className="img-container-chat">
         <img src={isFreelancer ? user.url : user.client_url} alt={"Photo of the logged in user."} />
        </div>
        <h3>{isFreelancer ? user.first_name : user.client_first_name}</h3>
      </div>
      <button onClick={logout} className="icon-logout">⇨</button>
    </div>}
    </>
  );
}

export default ChatHeader;
