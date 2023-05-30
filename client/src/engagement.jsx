import MessageIcon from "@mui/icons-material/Message";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import WorkIcon from "@mui/icons-material/Work";
import { IconButton } from '@mui/material';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Engagement({
  setChatActivate,
  chatActivate,
  setThumbs,
  thumbs,
  messageClicked,
  setMessageClicked,
}) {
  function handleMessageClick() {
    if (thumbs) {
      {
        messageClicked ? setMessageClicked(false) : setMessageClicked(true);
      }
    }
    if (!thumbs) {
      setMessageClicked(false);
    }
  }

  function handleThumbs() {
    if (thumbs && messageClicked) {
      return null;
    }
    setThumbs(!thumbs);
  }

  return (
    <div className="engagement">
      <IconButton onClick={handleMessageClick} style={{ color: "white" }}>
        <MessageIcon fontSize="large" />
      </IconButton>
      <IconButton onClick={handleThumbs} style={{ color: "white" }}>
        <ThumbUpIcon fontSize="large" />
      </IconButton>
    </div>
  );
}

export default Engagement;
