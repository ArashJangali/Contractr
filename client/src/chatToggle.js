import Header from "./Header";
import Footer from "./Footer";
import ChatHeader from "./ChatHeader";
import Connections from "./Connections";
import ChatTab from "./ChatTab";
import { useState } from "react";

function ChatToggle({ chatActivate, setChatActivate }) {
  function handleClick() {
    {
      chatActivate ? setChatActivate(false) : setChatActivate(true);
    }
  }

  return (
    <div className="toggle-button-div">
      <button onClick={handleClick} className="chat-buttons">
        Likes
      </button>
    </div>
  );
}

export default ChatToggle;
