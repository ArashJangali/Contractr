import IconButton from '@mui/material/IconButton';
import PlaceIcon from '@mui/icons-material/Place';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from "react-router-dom";

function Preference({ isFreelancer, isClient }) {

let navigate = useNavigate();

    function handleClick() {
        isFreelancer ? navigate("/onboarding") : navigate("/clientonboarding")
    }

    return (
        <div className="preference">
            <IconButton onClick={handleClick} style={{color: "#4040FB", marginLeft: "260px", marginBottom: "650px"}}>
                <PersonIcon fontSize='large' />
            </IconButton>
            {/* <IconButton style={{color: "white"}}>
                <PlaceIcon fontSize='large' />
            </IconButton> */}
        </div>
    );
    
}

export default Preference;