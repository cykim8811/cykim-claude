import { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const InputContainer = styled.div`
  width: min(100%, 40rem);
  height: ${({ lineCount }) => `${lineCount * 1.5 + 2}rem`};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border: 1px solid #0003;
  border-radius: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.textarea`
  width: calc(100% - 8rem);
  height: ${({ lineCount }) => `${lineCount * 1.5}rem`};
  border: none;
  outline: none;
  margin: 0 1rem;
  font-size: 1rem;
  resize: none;
  font-family: "Noto Sans KR", sans-serif;
`;

const SendBtn = styled(FontAwesomeIcon).attrs({
  icon: faPaperPlane,
})`
  margin-right: 1rem;
  color: #0007;
  font-size: 1.5rem;
  cursor: pointer;
`;

const ChatInput = ({ onSubmit }) => {
  const [value, setValue] = useState("");
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey && value.trim() !== "") {
      e.preventDefault();
      onSubmit(value);
      setValue("");
    }
  };

  return (
    <InputContainer lineCount={value.split("\n").length}>
      <Input
        type="text"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        lineCount={value.split("\n").length}
        value={value}
        placeholder="Type your message here"
      />
      <SendBtn onClick={handleSubmit} />
    </InputContainer>
  );
};

ChatInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default ChatInput;
