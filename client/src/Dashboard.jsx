import Contractr from "./Contractr";
import Preference from "./preference";
import Engagement from "./engagement";
import Header from "./Header";
import Footer from "./Footer";
import Chat from "./Chat";
import ChatToggle from "./chatToggle";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import axios from "./axios.js";
import MessageToggle from "./messageToggle";
import Message from "./Message";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CancelIcon from "@mui/icons-material/Cancel";
import UnmatchButton from "./UnMatchButton";
import { UserTypeContext } from './UserTypeContext';

function Dashboard({ people }) {
  const [user, setUser] = useState([]);
  const isClient = true;
  const [messageActivate, setMessageActivate] = useState(false);
  const [clickedFreelancer, setClickedFreelancer] = useState(null);
  const [thumbs, setThumbs] = useState(null);
  const [messageClicked, setMessageClicked] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [undo, setUndo] = useState(false);
  const userId = cookies.UserId;
  const [undoClicked, setUndoClicked] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(false);
  const [unmatchedFreelancers, setUnmatchedFreelancers] = useState([]);
  const [likeClicked, setLikeClicked] = useState(false);
  const [dislikeClicked, setDislikeClicked] = useState(false);
  const { setUserType } = useContext(UserTypeContext)




  function handleUndoClick() {
    setUndoClicked(true);
  }

  function handleLikeClick() {
    setLikeClicked(true)
  }

  function handleDislikeClick() {
    setDislikeClicked(true);
  }

  const getUser = async () => {
    let rote;

    if (isClient) {
      rote = "profile";
    } else {
      rote = "freelancerprofile";
    }
    try {
      const response = await axios.get(`/${rote}`, {
        params: { userId },
      });
      setUser(response.data);
    } catch (err) {
      console.log("error getting user profile info", err);
    }
  };


  useEffect(() => {
    getUser();
  }, []);

  // chatactivate is the liked users button.
  const [chatActivate, setChatActivate] = useState(false);

  const [like, setLike] = useState(null);

 
  return (
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
            removeCookie={removeCookie}
            cookies={cookies}
            user={user}
            isClient={isClient}
            visible={chatActivate || thumbs}
            clickedFreelancer={clickedFreelancer}
            setClickedFreelancer={setClickedFreelancer}
            messageClicked={messageClicked}
            setSelectedPerson={setSelectedPerson}
            selectedPerson={selectedPerson}
            unmatchedFreelancers={unmatchedFreelancers}
          />

          <Message
            messageVisible={messageActivate || messageClicked}
            removeCookie={removeCookie}
            cookies={cookies}
            user={user}
            isClient={isClient}
            clickedFreelancer={clickedFreelancer}
          />
        </div>

        <div className="main">
          <Engagement
            setThumbs={setThumbs}
            thumbs={thumbs}
            messageClicked={messageClicked}
            setMessageClicked={setMessageClicked}
            chatActivate={chatActivate}
            setChatActivate={setChatActivate}
          />
          <Contractr
            getUser={getUser}
            user={user}
            like={like}
            setUndoClicked={setUndoClicked}
            undoClicked={undoClicked}
            setLikeClicked={setLikeClicked}
            likeClicked={likeClicked}
            setDislikeClicked={setDislikeClicked}
            dislikeClicked={dislikeClicked}
            
          />
          <div className="mainButtons">
            <IconButton onClick={handleLikeClick} style={{ color: "#F44336" }}>
              <FavoriteIcon fontSize="large" />
            </IconButton>
            <IconButton onClick={handleDislikeClick} style={{ color: "#757575" }}>
              <CancelIcon fontSize="large" />
            </IconButton>
            <IconButton onClick={handleUndoClick} style={{ color: "#2196F3" }}>
              <UndoIcon fontSize="large" />
            </IconButton>
            <UnmatchButton
              thumbs={thumbs}
              unmatchedFreelancers={unmatchedFreelancers}
              setUnmatchedFreelancers={setUnmatchedFreelancers}
              user={user}
              isClient={isClient}
              selectedPerson={selectedPerson}
            />
          </div>
          <Preference
            isClient={true}
          />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
