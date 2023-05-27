import Header from "./Header";
import Footer from "./Footer";
import ChatTab from "./ChatTab";
import ChatHeader from "./ChatHeader";


function Message({messageVisible, isFreelancer, cookies, user, removeCookie, clickedFreelancer, clickedClient}) {

  return (
    <div className={`message-container${messageVisible ? ' visible' : ''}`}>
    {/* {clickedFreelancer && <ChatTab clickedFreelancer={clickedFreelancer} />} */}
     <div className="message-div">

      <ChatTab
        clickedClient={clickedClient}  
        clickedFreelancer={clickedFreelancer}
        user={user}
        messageVisible={messageVisible}
        isFreelancer={isFreelancer}
      />
    </div>
    
    </div>
  );
}

export default Message;
