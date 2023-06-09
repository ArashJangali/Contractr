import Header from "./Header";
import Footer from "./Footer";
import axios from "./axios.js";
import { useEffect, useState } from "react";

function Connections({
  user,
  setClickedFreelancer,
  clickedFreelancer,
  clickedClient,
  setClickedClient,
  isFreelancer,
  isClient,
  messageClicked,
  setSelectedPerson,
  selectedPerson,
  unmatchedFreelancers,
  unmatchedClients,
}) {
  const userId = user
    ? isClient
      ? user["client_user_id"]
      : user["user_id"]
    : null;

  const likedFreelancerIds =
    user?.client_connects
      ?.map(({ client_user_id }) => client_user_id)
      .concat(userId) ?? [];

  const likedClientIds =
    user?.connects?.map(({ user_id }) => user_id).concat(userId) ?? [];

  const [likedFreelancers, setLikedFreelancers] = useState(null);

  const [likedClients, setLikedClients] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }
    if (isClient) {
      if (!user.client_connects || !Array.isArray(user.client_connects)) {
        return;
      }
      displayLikedFreelancers();
    } else if (isFreelancer) {
      if (!user.connects || !Array.isArray(user.connects)) {
        return;
      }
      displayLikedClients();
    }
  }, [user]);

  // retrieving the liked freelancers

  async function displayLikedFreelancers() {
    if (!likedFreelancerIds || likedFreelancerIds.length === 0) {
      console.log("No liked freelancer IDs available.");
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/freelancerconnects`, {
        params: { userIds: JSON.stringify(likedFreelancerIds) },
      });
      setLikedFreelancers(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  //   retrieving the liked clients

  async function displayLikedClients() {
    if (!likedClientIds || likedClientIds.length === 0) {
      console.log("No liked client IDs available.");
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/likedClients`, {
        params: { likedClientIds: JSON.stringify(likedClientIds) },
      });
      setLikedClients(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  function handleClientClick(likedPerson) {
    setClickedClient(likedPerson);
    selectedPerson ? setSelectedPerson(false) : setSelectedPerson(likedPerson);
    
  }

  
  

  function handleFreelancerClick(likedPerson) {
    setClickedFreelancer(likedPerson);
    selectedPerson ? setSelectedPerson(false) : setSelectedPerson(likedPerson);
  }

  const matchedFreelancers = likedFreelancers?.filter(
    (likedFreelancer) =>
      likedFreelancer.connects.filter((object) => object.user_id == userId)
        .length > 0
  );

  const filteredMatchedFreelancers = matchedFreelancers?.filter(
    (matchedFreelancers) =>
      !unmatchedFreelancers.some(
        (unmatchedFreelancers) =>
          unmatchedFreelancers.client_user_id === matchedFreelancers.user_id
      )
  );

  const matchedClients = likedClients?.filter(
    (likedClient) =>
      likedClient.client_connects.filter(
        (object) => object.client_user_id == userId
      ).length > 0
  );

  const filteredMatchedClients = matchedClients?.filter(
    (matchedClient) =>
      !unmatchedClients.some(
        (unmatchedClient) =>
          unmatchedClient.user_id === matchedClient.client_user_id
      )
  );

  const matched = isFreelancer
    ? filteredMatchedClients
    : filteredMatchedFreelancers;

  return (
    <div className="connects" style={{ overflow: "scroll", height: "300px" }}>
      {matched?.map((likedPerson, _index) => {
        const isSelected = selectedPerson._id === likedPerson._id;
        const imgBorderStyle = isSelected
          ? {
              borderTop: "2px solid lightBlue",
              borderLeft: "2px solid lightBlue",
            }
          : {};

        return (
          <div
            key={{ _index }}
            className="likedPeople"
            onClick={() =>
              isFreelancer
                ? handleClientClick(likedPerson)
                : handleFreelancerClick(likedPerson)
            }
          >
            <div className="img-container">
              <img
                src={
                  likedPerson && isFreelancer
                    ? likedPerson.client_url
                    : likedPerson.url
                }
                alt={
                  likedPerson && isFreelancer
                    ? likedPerson.client_first_name
                    : likedPerson.first_name + "image"
                }
                style={imgBorderStyle}
              />
            </div>

            <h3>
              {likedPerson && isFreelancer
                ? likedPerson.client_first_name
                : likedPerson.first_name}
            </h3>
          </div>
        );
      })}
    </div>
  );
}

export default Connections;
