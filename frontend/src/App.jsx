import ChatSection from "./components/ChatSection";
import Sidebar from "./components/Sidebar";
// recoil
import { RecoilRoot } from "recoil";

import styled from "styled-components";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: #fff;
`;

function App() {
  return (
    <AppContainer className="App">
      <RecoilRoot>
        <Sidebar />
        <ChatSection />
      </RecoilRoot>
    </AppContainer>
  );
}

export default App;
