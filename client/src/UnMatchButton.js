import axios from "./axios.js";
import { IconButton } from '@mui/material';
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import { useState } from "react";

const UnmatchButton = ({
  selectedPerson,
  setSelectedPerson,
  isFreelancer,
  isClient,
  user,
  setUnmatchedFreelancers,
  unmatchedFreelancers,
  setUnmatchedClients,
  unmatchedClients,
  thumbs,
}) => {
  const id = isClient
    ? selectedPerson?.user_id
    : selectedPerson?.client_user_id;

  const loggedInId = isClient ? user?.client_user_id : user?.user_id;

  const handleUnMatchClick = async () => {
    try {
      if (isClient) {
        const response = await axios.patch("/unmatchFreelancer", {
          id,
          loggedInId,
        });
        const unmatchedFreelancersResponse = response.data.unmatched;
        setUnmatchedFreelancers(unmatchedFreelancersResponse);
      } else if (isFreelancer) {
        const response = await axios.patch("/unmatchClient", {
          id,
          loggedInId,
        });
        const unmatchedClientResponse = response.data.unmatched;
        setUnmatchedClients(unmatchedClientResponse);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="unmatch-button"
      style={{
        display: selectedPerson && thumbs ? "block" : "none",
      }}
    >
      <IconButton onClick={handleUnMatchClick} style={{ color: "black" }}>
        <HeartBrokenIcon fontSize="large" />
      </IconButton>
    </div>
  );
};

export default UnmatchButton;
