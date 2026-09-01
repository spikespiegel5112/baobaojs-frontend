import { Provider } from "react-redux";
import { store } from "./store";

import "./style/common.scss";
import "./style/app.css";
import "normalize.css";

export default function Root({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
