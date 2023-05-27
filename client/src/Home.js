import { useState, useContext, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import AuthModal from "./AuthModal";
import { UserTypeContext } from './UserTypeContext';

const Home = () => {

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  const [client, setClient] = useState(false);
  const [freelancer, setFreelancer] = useState(false);
  const { setUserType } = useContext(UserTypeContext)

  

  const loggedIn = false;

  const handleClick = () => {
    setShowAuthModal(true);
    setIsSignUp(true);
  };
  // useEffect(() => {
  //   setUserType(freelancer ? 'freelancer' : 'client');
  // }, [freelancer, client]);
  
  console.log('freelancer', freelancer)

  return (
    <div className="viewportHome">
      <Header
        smallState={false}
        setShowAuthModal={setShowAuthModal}
        showAuthModal={showAuthModal}
        setIsSignUp={setIsSignUp}
      />

      <div className="home">
        <div className="user-type">
          <input
            type="radio"
            required={true}
            id="freelancer"
            name="usertype"
            value="freelancer"
            onChange={() => {
              setFreelancer(true);
              setClient(false)
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
              setFreelancer(false)
            }}
          />
          <label htmlFor="client">I'm a Client</label>
        </div>
        <h1 className="title-primary">Match With Your Next Hire®</h1>
        <button className="btn-primary" onClick={handleClick}>
          {loggedIn ? "Signout" : "Create Account"}
        </button>

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
