import React from "react";
import TinderCard from "react-tinder-card";
import "./App.css";
import { useEffect, useState, useRef, useMemo } from "react";
import axios from "./axios.js";
import Chat from "./Chat";
import { useCookies } from "react-cookie";

function Customer({
  isClient,
  isFreelancer,
  user,
  getUser,
  setUndoClicked,
  undoClicked,
  setLikeClicked,
  likeClicked,
  setDislikeClicked,
  dislikeClicked,
}) {
  const [clients, setClients] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [lastDirection, setLastDirection] = useState(null);
  const [swipedCards, setSwipedCards] = useState([]);
  const [updatedConnects, setUpdatedConnects] = useState([]);
  const [unmatchedClients, setUnmatchedClients] = useState([]);
  const userId = user && user["user_id"];

  useEffect(() => {
    async function fetchData() {
      const req = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/clientuser`);

      setClients(req.data);
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function getUnmatchedClients() {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getUnmatchedClients`, {
        params: { userId },
      });
      setUnmatchedClients(response.data);
    }
    if (userId) {
      getUnmatchedClients();
    }
  }, [userId]);

  const likeClient = async (likedClientId) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/addLikedClients`, {
        userId,
        likedClientId,
      });
      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  const outOfFrame = (name) => {
    console.log(name);
  };

  const likedClientIds =
    user?.connects?.map(({ user_id }) => user_id).concat(userId) ?? [];

  const isNotInSwipedCards = (person) => {
    return !swipedCards.some(
      (swipedCard) => swipedCard.clientId === person.client_user_id
    );
  };

  const dislikedClientIds = user?.disliked?.map(({ user_id }) => user_id) ?? [];

  const notLikedClients = clients?.filter(
    (person) =>
      !likedClientIds.includes(person.client_user_id) &&
      isNotInSwipedCards(person) &&
      !updatedConnects.some(
        (connect) => connect.user_id === person.client_user_id
      ) &&
      !dislikedClientIds.includes(person.client_user_id)
  );

  const filteredNotLikedClients = notLikedClients?.filter(
    (notLikedClient) =>
      !unmatchedClients.some(
        (unmatchedClient) =>
          unmatchedClient.user_id === notLikedClient.client_user_id
      )
  );

  const [currentIndex, setCurrentIndex] = useState(null);

  const currentIndexRef = useRef(currentIndex);

  const activeUndo = currentIndex < clients.length - 1;

  const activeSwipe = currentIndex >= 0;

  useEffect(() => {
    setCurrentIndex(filteredNotLikedClients.length - 1);
  }, [clients, swipedCards]);

  const updateCurrentIndex = (value) => {
    if (value !== null) {
      setCurrentIndex(value);
      currentIndexRef.current = value;
    }
  };

  const swiped = (direction, likedClientId, index) => {
    if (direction === "up") {
      likeClient(likedClientId);
    }
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
    setSwipedCards((prevSwipedCards) => [
      ...prevSwipedCards,
      { index, clientId: likedClientId },
    ]);
  };

  // dislike button clicked

  useEffect(() => {
    if (dislikeClicked) {
      async function handleDislike() {
        try {
          if (!activeSwipe) return;

          const dislikedClientId =
            filteredNotLikedClients[currentIndex]?.client_user_id;
          console.log(dislikedClientId);
          await axios.put(`${process.env.REACT_APP_BACKEND_URL}/addDislikedClient`, {
            userId,
            dislikedClientId,
          });
          setLastDirection("down");
          updateCurrentIndex(currentIndex - 1);
          setSwipedCards((prevSwipedCards) => [
            ...prevSwipedCards,
            { index: currentIndex, clientId: dislikedClientId },
          ]);
        } catch (error) {
          console.log(error);
        }
      }
      handleDislike();
      setDislikeClicked(false);
    }
  }, [dislikeClicked]);

  // like button clicked

  useEffect(() => {
    if (likeClicked) {
      async function handleLike() {
        try {
          if (!activeSwipe) return;

          const likedClientId =
            filteredNotLikedClients[currentIndex]?.client_user_id;

          await likeClient(likedClientId);

          setLastDirection("up");
          updateCurrentIndex(currentIndex - 1);
          setSwipedCards((prevSwipedCards) => [
            ...prevSwipedCards,
            { index: currentIndex, clientId: likedClientId },
          ]);
        } catch (error) {
          console.log(error);
        }
      }

      handleLike();

      setLikeClicked(false);
    }
  }, [likeClicked]);

  // undo button clicked

  useEffect(() => {
    if (undoClicked) {
      async function undo() {
        try {
          if (!activeUndo || swipedCards.length === 0) return;

          const lastSwipedCard = swipedCards[swipedCards.length - 1];
          setSwipedCards(swipedCards.slice(0, -1));
          updateCurrentIndex(lastSwipedCard.index);

          if (lastDirection === "up") {
            const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/removeLikedClients`, {
              userId,
              clientId: lastSwipedCard.clientId,
            });
            const updatedUserConnects = response.data.connects;
            setUpdatedConnects(updatedUserConnects);
            window.location.reload();
          } else {
            await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/deleteDislikedClient`, {
              userId,
              dislikedClientId: lastSwipedCard.clientId,
            });
          }
        } catch (err) {
          console.log("err", err);
        }
      }
      undo();
      setUndoClicked(false);
    }
  }, [undoClicked, swipedCards]);

  return (
    <>
      (
        <div className="contractrOne">
          <div className="cardContainer">
            {filteredNotLikedClients.map((person, index) => (
              <TinderCard
                className="swipe"
                key={person.client_user_id}
                preventSwipe={["left", "right"]}
                onSwipe={(dir) => swiped(dir, person.client_user_id, index)}
                onCardLeftScreen={() =>
                  outOfFrame(person.client_first_name, index)
                }
              >
                <div
                  style={{ backgroundImage: "url(" + person.client_url + ")" }}
                  className="card"
                >
                  <h2>{person.client_first_name}</h2>
                  <h4>Looking for: {person.client_talent}</h4>
                  <p>Max Hourly Rate: {"$" + person.client_rate + "/hr"}</p>
                  <img
                    style={{ filter: "inverse" }}
                    className="ratingImg"
                    src={person.ratingUrl}
                  />
                </div>
              </TinderCard>
            ))}
          </div>
        </div>
      )
    </>
  );
}

export default Customer;
