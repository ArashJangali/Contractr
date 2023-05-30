

function Header({ smallState, setShowAuthModal, showAuthModal, setIsSignUp }) {
  function handleClick() {
    setShowAuthModal(true);
    setIsSignUp(false);
  }

  const loggedIn = false;

  return (
    <nav>
      <div className="logo-div">
      <img className="logo" src={smallState ? "/images/logo-color.png" : "/images/logo.png"} alt="logo" />
      </div>
      {!loggedIn && !smallState && (
        <button
          onClick={handleClick}
          disabled={showAuthModal}
          className="btn-primary"
        >
          Log In
        </button>
      )}
    </nav>
  );
}

export default Header;
