import Header from "./Header";
import Footer from "./Footer";
import ChatHeader from "./ChatHeader";
import Connections from "./Connections";
import ChatTab from "./ChatTab";
import { useState } from "react";
import axios from "./axios.js";



function MessageToggle({messageActivate, setMessageActivate}) {

    function handleClick() {
        {messageActivate ? setMessageActivate(false) : setMessageActivate(true)}
    }

    return (
    <div className="message-toggle-button-div">
        <button onClick={handleClick} className="chat-buttons">Messages</button>
    </div>

    )
}

export default MessageToggle;