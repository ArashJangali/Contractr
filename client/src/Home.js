import { useState, useContext, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import AuthModal from "./AuthModal";

const Home = ({ setClient, setFreelancer, client, freelancer }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  const loggedIn = false;

  const handleClick = () => {
    setShowAuthModal(true);
    setIsSignUp(true);
  };

  return (
    <div className="viewportHome">
      <Header
        smallState={false}
        setShowAuthModal={setShowAuthModal}
        showAuthModal={showAuthModal}
        setIsSignUp={setIsSignUp}
      />

      <div className="home">
      {!showAuthModal &&
        <div className="user-type">
          <input
            type="radio"
            required={true}
            id="freelancer"
            name="usertype"
            value="freelancer"
            onChange={() => {
              setFreelancer(true);
              setClient(false);
            }}
          />
          <label htmlFor="freelancer">I'm a Freelancer</label>
          <input
            type="radio"
            required={true}
            id="client"
            name="usertype"
            value="client"
            onChange={() => {
              setClient(true);
              setFreelancer(false);
            }}
          />
          <label htmlFor="client">I'm a Client</label>
        </div> }
       {!showAuthModal && <h1 className="title-primary-h1">Match With Your Next Hire®</h1>}
       {!showAuthModal && <button className="btn-primary" onClick={handleClick}>
          {loggedIn ? "Signout" : "Create Account"}
        </button>}

        {showAuthModal ? (
          <AuthModal
            client={client}
            freelancer={freelancer}
            isSignUp={isSignUp}
            setShowAuthModal={setShowAuthModal}
            showAuthModal={showAuthModal}
          />
        ) : null}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
