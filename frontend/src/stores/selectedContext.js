import { atom } from "recoil";

const selectedContextAtom = atom({
  key: "selectedContext",
  default: null,
});

export default selectedContextAtom;
