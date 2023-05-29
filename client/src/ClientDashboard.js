import Customer from "./Customer";
import Preference from "./preference";
import Engagement from "./engagement";
import Header from "./Header";
import Footer from "./Footer";
import Chat from "./Chat";
import ChatToggle from "./chatToggle";
import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "./axios.js";
import { useCookies } from "react-cookie";
import MessageToggle from "./messageToggle";
import Message from "./Message";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CancelIcon from "@mui/icons-material/Cancel";
import UnmatchButton from "./UnMatchButton";

function ClientDashboard() {
  const [chatActivate, setChatActivate] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies("user");
  const [user, setUser] = useState(null);
  const [messageActivate, setMessageActivate] = useState(false);
  const [thumbs, setThumbs] = useState(null);
  const userId = cookies.UserId;
  const [clickedClient, setClickedClient] = useState(null);
  const location = useLocation();
  const isFreelancer = true;
  const [messageClicked, setMessageClicked] = useState(false);
  const [undoClicked, setUndoClicked] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(false);
  const [unmatchedClients, setUnmatchedClients] = useState([]);
  const [likeClicked, setLikeClicked] = useState(false);
  const [dislikeClicked, setDislikeClicked] = useState(false);
  const [freelancer, setFreelancer] = useState(null);

  useEffect(() => {
    if (user?.user_id) {
      setFreelancer(true);
    }
  }, [user]);

  function handleUndoClick() {
    setUndoClicked(true);
  }

  function handleLikeClick() {
    setLikeClicked(true);
  }

  function handleDislikeClick() {
    setDislikeClicked(true);
  }

  async function getUser() {
    let route;

    if (isFreelancer) route = "freelancerprofile";
    try {
      const response = await axios.get("/freelancerprofile", {
        params: { userId },
      });
      setUser(response.data);
    } catch (err) {
      console.log("error getting user profile info", err);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    freelancer && (
      <div>
        <div className="centerMain">
          <ChatToggle
            chatActivate={chatActivate}
            setChatActivate={setChatActivate}
          />

          <MessageToggle
            messageActivate={messageActivate}
            setMessageActivate={setMessageActivate}
          />
          <div className="chat-message-container">
            <Chat
              isFreelancer={isFreelancer}
              visible={chatActivate || thumbs}
              user={user}
              cookies={cookies}
              removeCookie={removeCookie}
              clickedClient={clickedClient}
              setClickedClient={setClickedClient}
              messageActivate={messageActivate}
              setSelectedPerson={setSelectedPerson}
              selectedPerson={selectedPerson}
              unmatchedClients={unmatchedClients}
            />
            <Message
              isFreelancer={isFreelancer}
              messageVisible={messageActivate || messageClicked}
              removeCookie={removeCookie}
              cookies={cookies}
              user={user}
            />
          </div>
          <div className="main">
            <Engagement
              setThumbs={setThumbs}
              thumbs={thumbs}
              messageClicked={messageClicked}
              setMessageClicked={setMessageClicked}
            />
            <Customer
              user={user}
              getUser={getUser}
              setUndoClicked={setUndoClicked}
              undoClicked={undoClicked}
              setLikeClicked={setLikeClicked}
              likeClicked={likeClicked}
              setDislikeClicked={setDislikeClicked}
              dislikeClicked={dislikeClicked}
            />
            <div className="mainButtons">
              <IconButton
                onClick={handleLikeClick}
                style={{ color: "#F44336" }}
              >
                <FavoriteIcon fontSize="large" />
              </IconButton>
              <IconButton
                onClick={handleDislikeClick}
                style={{ color: "#757575" }}
              >
                <CancelIcon fontSize="large" />
              </IconButton>
              <IconButton
                onClick={handleUndoClick}
                style={{ color: "#2196F3" }}
              >
                <UndoIcon fontSize="large" />
              </IconButton>
              <UnmatchButton
                thumbs={thumbs}
                user={user}
                isFreelancer={isFreelancer}
                selectedPerson={selectedPerson}
                setUnmatchedClients={setUnmatchedClients}
                unmatchedClients={unmatchedClients}
              />
            </div>
            <Preference isFreelancer={true} />
          </div>
          <Footer />
        </div>
      </div>
    )
  );
}

export default ClientDashboard;
