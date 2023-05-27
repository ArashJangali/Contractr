import logo from "./logo-images/logo.png"
import colorLogo from "./logo-images/logo-color.png"

function Header({smallState, setShowAuthModal, showAuthModal, setIsSignUp}) {



    function handleClick() {
        setShowAuthModal(true);
        setIsSignUp(false);
    }

    const loggedIn = false;

    return (

        <nav>
                <div className='logo-div'>
                    <img className="logo" src={smallState ? colorLogo : logo}/>
                </div>
                {!loggedIn && !smallState && <button
                onClick={handleClick}
                disabled={showAuthModal}
                className="btn-primary">
                Log In
                </button>}
        </nav>

    );
}

export default Header;