import Header from "./Header";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import axios from "./axios";

function MessageInput({
  clickedFreelancer,
  user,
  messageVisible,
  clickedClient,
  isFreelancer,
}) {
  const [textArea, setTextArea] = useState("");
  const content = textArea;
  const senderId = user?._id;
  const senderName = isFreelancer ? user?.first_name : user?.client_first_name;
  const senderImg = isFreelancer ? user?.url : user?.client_url;
  const receiverId = isFreelancer ? clickedClient?._id : clickedFreelancer?._id;
  const receiverName = isFreelancer
    ? clickedClient?.client_first_name
    : clickedFreelancer?.first_name;
  const receiverImg = user?.url;
  const [messageSent, setMessageSent] = useState(null);
  const [messages, setMessages] = useState(null);

  const sendMessage = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/messages`, {
        senderId,
        senderName,
        senderImg,
        content,
        receiverId,
        receiverName,
        receiverImg,
      });

      if (response.status === 200) {
        setMessageSent("Message Delivered!");
        setTextArea("");
        // setTimeout(() => setMessageSent(null), 2000)
      } else {
        setMessageSent(null);
      }
    } catch (err) {
      console.log("Error sending message", err);
    }
  };

  const getMessage = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/messages`, {
        params: {
          senderId: senderId,
          receiverId: receiverId,
          content: content,
        },
      });
      setMessages(response.data);
    } catch (err) {
      console.log("Error fetching messages", err);
    }
  };

  useEffect(() => {
    getMessage();
  }, [messages]);

  return (
    <div className="message-input">
      <textarea
        value={textArea}
        onChange={(e) => setTextArea(e.target.value)}
      />
      <button onClick={sendMessage} type="submit" className="btn-secondary">
        Send
      </button>

      {(messageSent || clickedFreelancer || clickedClient) &&
        messageVisible && (
          <div
            className={`messageSuccess${messageVisible ? " visible" : ""}`}
            style={{ zIndex: "1000" }}
          >
            {messages?.map((messages, index) => {
              return (
                <div key={index}>
                  <div className="profile">
                    <div className="img-container-chat">
                      <img className="sender-img" src={messages?.sender_url} />
                      {messages.sender_first_name !== senderName && (
                        <p className="sendername">
                          {messages.sender_first_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="messages">
                    <p className="message-content">
                      {messages.timestamp &&
                        new Date(messages.timestamp)
                          .toLocaleTimeString()
                          .replace(/:\d\d$/, "")}
                    </p>
                    <p className="message-content">{messages?.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}

export default MessageInput;
