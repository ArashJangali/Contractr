import Header from "./Header";
import Footer from "./Footer";
import ChatHeader from "./ChatHeader";
import Connections from "./Connections";
import { useState } from "react";

function Chat({
  visible,
  isClient,
  isFreelancer,
  cookies,
  user,
  removeCookie,
  clickedFreelancer,
  setClickedFreelancer,
  setClickedClient,
  clickedClient,
  messageClicked,
  setSelectedPerson,
  selectedPerson,
  unmatchedFreelancers,
  unmatchedClients,
}) {
  return (
    <div className={`chat-container${visible ? " visible" : ""}`}>
      <div className="chat">
        <ChatHeader
          removeCookie={removeCookie}
          cookies={cookies}
          user={user}
          isFreelancer={isFreelancer}
          isClient={isClient}
        />

        <Connections
          unmatchedFreelancers={unmatchedFreelancers}
          selectedPerson={selectedPerson}
          setSelectedPerson={setSelectedPerson}
          messageClicked={messageClicked}
          user={user}
          isClient={isClient}
          isFreelancer={isFreelancer}
          setClickedFreelancer={setClickedFreelancer}
          clickedFreelancer={clickedFreelancer}
          setClickedClient={setClickedClient}
          clickedClient={clickedClient}
          unmatchedClients={unmatchedClients}
        />
      </div>
    </div>
  );
}

export default Chat;
