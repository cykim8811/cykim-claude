import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Markdown from "react-markdown";

const ChatBubbleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0.3rem 0;
`;

const ChatOwner = styled.div`
  font-size: 0.8rem;
  color: #0007;
  margin: 0;
`;

const ChatContent = styled.div`
  font-size: 1rem;
  margin: 0.1rem 0;
  padding: 0rem 0.5rem;
  border-radius: 0.5rem;
  background-color: ${({ role }) => (role === "user" ? "#0001" : "#0000")};
`;

const ChatMarkdown = styled(Markdown)`
  margin: -0.2rem 0rem;
  font-family: "Noto Sans KR", sans-serif;
`;

const ChatBubble = ({ chatData }) => {
  const { role, content } = chatData;
  const [text, setText] = useState("");

  useEffect(() => {
    console.log(">", content, typeof content);
    if (typeof content === "string") {
      setText(content);
    } else {
      // fetch response, streaming
      const reader = content.body.getReader();
      let result = "";
      reader.read().then(function processText({ done, value }) {
        if (done) {
          setText(result);
          return;
        }
        result += new TextDecoder("utf-8").decode(value);
        setText(result);
        return reader.read().then(processText);
      });
    }
  }, [content]);

  return (
    <ChatBubbleContainer role={role}>
      <ChatOwner>{role}</ChatOwner>
      <ChatContent role={role}>
        <ChatMarkdown>{text}</ChatMarkdown>
      </ChatContent>
    </ChatBubbleContainer>
  );
};

ChatBubble.propTypes = {
  chatData: PropTypes.shape({
    role: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }).isRequired,
};

export default ChatBubble;
