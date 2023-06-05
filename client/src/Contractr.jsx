import TinderCard from "react-tinder-card";
import "./App.css";
import { useEffect, useState, useMemo, useRef } from "react";
import axios from "./axios.js";
import Dashboard from "./Dashboard";
import { debounce } from "lodash";

function Contractr({
  isClient,
  isFreelancer,
  user,
  getUser,
  like,
  setUndoClicked,
  undoClicked,
  setLikeClicked,
  likeClicked,
  setDislikeClicked,
  dislikeClicked,
}) {
  const [lastDirection, setLastDirection] = useState(null);
  const [swipedCards, setSwipedCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const currentIndexRef = useRef(currentIndex);
  const [updatedConnects, setUpdatedConnects] = useState([]);
  const userId = user && user["client_user_id"];
  const [unmatchedFreelancers, setUnmatchedFreelancers] = useState([]);

  const [people, setPeople] = useState([]);

  const activeUndo = currentIndex < people.length - 1;

  const activeSwipe = currentIndex >= 0;

  useEffect(() => {
    async function fetchData() {
      const req = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user`);

      setPeople(req.data);
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function getUnmatched() {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getUnmatchedFreelancers`, {
        params: { userId },
      });
      setUnmatchedFreelancers(response.data);
    }
    if (userId) {
      getUnmatched();
    }
  }, [userId]);

  // the function that puts the userid of the liked freelancer in the signed in users "like array"
  const functionLikeFreelancer = async (likedFreelancerIds) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/addConnect`, {
        userId,
        likedFreelancerIds,
      });

      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setCurrentIndex(filteredNotLikedFreelancers.length - 1);
  }, [people, swipedCards]);

  const updateCurrentIndex = (value) => {
    if (value !== null) {
      setCurrentIndex(value);
      currentIndexRef.current = value;
    }
  };

  const swiped = (direction, likedFreelancerIds, index) => {
    if (direction === "up") {
      functionLikeFreelancer(likedFreelancerIds);
    }

    setLastDirection(direction);
    updateCurrentIndex(index - 1);
    setSwipedCards((prevSwipedCards) => [
      ...prevSwipedCards,
      { index, freelancerId: likedFreelancerIds },
    ]);
  };

  const outOfFrame = (name) => {
    console.log(name);
  };

  const likedFreelancerIds =
    user?.client_connects
      ?.map(({ client_user_id }) => client_user_id)
      .concat(userId) ?? [];

  const isNotInSwipedCards = (person) => {
    return !swipedCards.some(
      (swipedCard) => swipedCard.freelancerId === person.user_id
    );
  };

  const dislikedFreelancerIds =
    user?.disliked?.map(({ client_user_id }) => client_user_id) ?? [];

  const notLikedFreelancers = people?.filter(
    (person) =>
      !likedFreelancerIds.includes(person.user_id) &&
      isNotInSwipedCards(person) &&
      !updatedConnects.some(
        (connect) => connect.client_user_id === person.user_id
      ) &&
      !dislikedFreelancerIds.includes(person.user_id)
  );

  const filteredNotLikedFreelancers = notLikedFreelancers?.filter(
    (notLikedFreelancer) =>
      !unmatchedFreelancers.some(
        (unmatchedFreelancer) =>
          unmatchedFreelancer.client_user_id === notLikedFreelancer.user_id
      )
  );

  // dislike button clicked

  useEffect(() => {
    if (dislikeClicked) {
      async function handleDislike() {
        try {
          if (!activeSwipe) return;

          const dislikedFreelancerId =
            filteredNotLikedFreelancers[currentIndex]?.user_id;
          console.log(dislikedFreelancerId);
          await axios.put(`${process.env.REACT_APP_BACKEND_URL}/addDislikedFreelancer`, {
            userId,
            dislikedFreelancerId,
          });
          setLastDirection("down");
          updateCurrentIndex(currentIndex - 1);
          setSwipedCards((prevSwipedCards) => [
            ...prevSwipedCards,
            { index: currentIndex, freelancerId: dislikedFreelancerId },
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

          const likedFreelancerIds =
            filteredNotLikedFreelancers[currentIndex]?.user_id;
          await functionLikeFreelancer(likedFreelancerIds);
          setLastDirection("up");
          updateCurrentIndex(currentIndex - 1);
          setSwipedCards((prevSwipedCards) => [
            ...prevSwipedCards,
            { index: currentIndex, freelancerId: likedFreelancerIds },
          ]);
        } catch (error) {
          console.log(error);
        }
      }

      handleLike();
      setLikeClicked(false);
    }
  }, [likeClicked, swipedCards, undoClicked]);

  // the undo button is clicked

  useEffect(() => {
    if (undoClicked) {
      async function undo() {
        try {
          if (!activeUndo || swipedCards.length === 0) return;

          const lastSwipedCard = swipedCards[swipedCards.length - 1];
          setSwipedCards(swipedCards.slice(0, -1));
          updateCurrentIndex(lastSwipedCard.index);

          if (lastDirection === "up") {
            const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/removeLikedFreelancers`, {
              userId,
              freelancerId: lastSwipedCard.freelancerId,
            });
            const updatedUserConnects = response.data.client_connects;
            setUpdatedConnects(updatedUserConnects);
            window.location.reload();
          } else {
            await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/deleteDisliked`, {
              userId,
              dislikedFreelancerId: lastSwipedCard.freelancerId,
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

  // unswiped freelancer cards

  return (
    <div className="contractrOne">
      <div className="cardContainer">
        {filteredNotLikedFreelancers.map((person, index) => (
          <TinderCard
            className="swipe"
            key={person.user_id}
            preventSwipe={["left", "right"]}
            onSwipe={(dir) => swiped(dir, person.user_id, index)}
            onCardLeftScreen={() => outOfFrame(person.first_name, index)}
          >
            <div
              style={{ backgroundImage: "url(" + person.url + ")" }}
              className="card"
            >
              <h2>{person.first_name}</h2>
              <h4>{person.about}</h4>
              <p>{"$" + person.rate + "/hr"}</p>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
}

export default Contractr;
