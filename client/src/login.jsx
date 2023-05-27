
import IconButton from '@mui/material/IconButton';

function Login() {
    return (
        <div className="login">
           <form style={{margin: "10px"}}>
                <IconButton style={{color: "white", fontFamily: "Verdana, Geneva, Tahoma, sans-serif"}}>
                 <h5>Sign out</h5>
                </IconButton>
           </form>
        </div>
    );
}

export default Login;