import styled from "styled-components";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import selectedContextAtom from "../stores/selectedContext";

const ChatSectionContainer = styled.div`
  width: min-content;
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
`;

const ChatSectionInnerContainer = styled.div`
  width: min(100%, 40rem);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const ChatHeader = styled.div`
  width: 100%;
  height: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  margin-bottom: 0.3rem;
`;

const ChatSection = () => {
  const selectedContext = useRecoilValue(selectedContextAtom);
  const [chatData, setChatData] = useState(null);
  useEffect(() => {
    if (selectedContext) {
      console.log(
        `${import.meta.env.VITE_API_URL}/api/history/${selectedContext}`
      );
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/history/${selectedContext}`)
        .then((res) => {
          setChatData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedContext]);

  const handleSubmit = async (value) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/chat/${selectedContext}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: value }),
      }
    );
    setChatData({
      ...chatData,
      history: [
        ...chatData.history,
        { role: "user", content: value },
        { role: "assistant", content: response },
      ],
    });
  };

  return (
    <ChatSectionContainer>
      <ChatHeader />
      <ChatSectionInnerContainer>
        <ChatList chatData={chatData} />
        <ChatInput onSubmit={handleSubmit} />
      </ChatSectionInnerContainer>
    </ChatSectionContainer>
  );
};

export default ChatSection;
