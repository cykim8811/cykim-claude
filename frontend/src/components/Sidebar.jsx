import styled from "styled-components";
import { useRecoilState } from "recoil";
import selectedContextAtom from "../stores/selectedContext";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

const SidebarContainer = styled.div`
  position: relative;
  width: ${(props) => (props.$show ? "20rem" : "0rem")};
  height: 100%;
  background-color: #f6f5f1;
  color: #000c;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-x: hidden;
  transition: width 0.3s ease-out;
`;

const SidebarLogoContainer = styled.div`
  width: 100%;
  height: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
`;

const SidebarLogo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  margin-left: 1rem;
  color: #0007;
  text-transform: uppercase;
`;

const HRBar = styled.hr`
  width: 90%;
  border: 1px solid #0003;
  margin: 0;
`;

const HistoryList = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  list-style-type: none;
  padding: 0;
  margin: 0.3rem;
`;

const HistoryItem = styled.li`
  width: calc(100% - 3rem);
  margin: 0;
  height: 1.7rem;
  display: flex;
  font-size: 1rem;
  align-items: center;
  padding: 0.2rem 1rem;
  font-family: "Pretendard-Regular";
  justify-content: flex-start;
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;
  border-radius: 0.3rem;
  background-color: ${(props) =>
    props.selected ? "#0000002a" : "transparent"};
  &:hover {
    background-color: ${(props) =>
      props.selected ? "#0000002a" : "#0000000e"};
  }
`;

const ToggleExpandButton = styled.div`
  position: fixed;
  bottom: 1rem;
  z-index: 1;
  left: ${(props) => (props.$show ? "21rem" : "1rem")};
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #00000010;
  color: #0005;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background-color 0.3s ease-out, left 0.3s ease-out;
  &:hover {
    background-color: #00000020;
  }
`;

const Sidebar = () => {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/history`).then((res) => {
      setHistory(res.data);
      console.log(res.data);
    });
  }, []);

  const [selectedContext, setSelectedContext] =
    useRecoilState(selectedContextAtom);
  const [show, setShow] = useState(true);
  return (
    <SidebarContainer $show={show}>
      <SidebarLogoContainer>
        <SidebarLogo>cykim.claude</SidebarLogo>
      </SidebarLogoContainer>
      <HRBar />
      <HistoryList>
        <HistoryItem
          onClick={() => setSelectedContext(null)}
          selected={selectedContext === null}
        >
          <FontAwesomeIcon icon={faAdd} style={{ marginRight: "0.5rem" }} />
          Create New
        </HistoryItem>
        {history.map((item) => (
          <HistoryItem
            key={item.id}
            onClick={() => setSelectedContext(item.id)}
            selected={selectedContext === item.id}
          >
            {item.preview}
          </HistoryItem>
        ))}
      </HistoryList>
      <ToggleExpandButton onClick={() => setShow(!show)} $show={show}>
        {show ? (
          <FontAwesomeIcon icon={faAngleLeft} />
        ) : (
          <FontAwesomeIcon icon={faAngleRight} />
        )}
      </ToggleExpandButton>
    </SidebarContainer>
  );
};

export default Sidebar;
