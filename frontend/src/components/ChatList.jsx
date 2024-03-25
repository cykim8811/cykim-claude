import styled from "styled-components";
import ChatBubble from "./ChatBubble";
import PropTypes from "prop-types";

const ChatListContainer = styled.div`
  width: min(100%, 40rem);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
`;

const ChatList = ({ chatData }) => {
  return (
    <ChatListContainer>
      {chatData &&
        chatData.history.map((chat, i) => (
          <ChatBubble key={i} chatData={chat} />
        ))}
    </ChatListContainer>
  );
};

ChatList.propTypes = {
  chatData: PropTypes.shape({
    history: PropTypes.arrayOf(
      PropTypes.shape({
        role: PropTypes.string,
        content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      })
    ),
  }),
};

export default ChatList;
