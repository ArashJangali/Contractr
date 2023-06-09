import Header from "./Header";
import Footer from "./Footer";
import Message from "./Message";
import MessageInput from "./MessageInput";

function ChatTab({
  clickedFreelancer,
  user,
  messageVisible,
  clickedClient,
  isFreelancer,
}) {

  console.log(clickedClient)
  return (
    <>
      <MessageInput
        clickedFreelancer={clickedFreelancer}
        clickedClient={clickedClient}
        user={user}
        messageVisible={messageVisible}
        isFreelancer={isFreelancer}
      />
    </>
  );
}

export default ChatTab;
