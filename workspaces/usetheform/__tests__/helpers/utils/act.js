import { act as reactAct } from "react";
import { act as domAct } from "react-dom/test-utils";

const act = reactAct || domAct;

export { act };
