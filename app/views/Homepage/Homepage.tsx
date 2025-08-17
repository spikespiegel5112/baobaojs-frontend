import { useEffect, useState } from "react";
import "./index.scss";
import cityOverviewImage from "@/assets/image/City Overview 1080p.jpg"; // ✅ 使用 import
export default function Homepage() {
  const [startButtonActive, setStartButtonActive] = useState(false);
  const [entranceActive, setEntranceActive] = useState(false);
  const [enterActive, setEnterActive] = useState(false);
  const [bgActive, setBgActive] = useState(false);

  useEffect(() => {
    setEntranceActive(true);
    setTimeout(() => {
      setStartButtonActive(true);
    }, 300);
  }, []);

  const handleEnter = () => {
    setEntranceActive(false);
    setStartButtonActive(false);
    setEnterActive(true);
    setTimeout(() => {
      setBgActive(true);
    }, 800);
  };

  return (
    <div className={"homepage_container"}>
      <div className={"entrance night " + (entranceActive ? "active" : "")}>
        <div className={"title"}>BAOBAOJS</div>
        <a
          className={"startbutton " + (startButtonActive ? "active" : "")}
          onClick={handleEnter}
        ></a>
      </div>

      <div className={"main " + (enterActive ? "active" : "")}>
        <div className={"menu " + (bgActive ? "active" : "")}>
          <div className="menubg">
            <span className="bg1">
              <div className="rightglow"></div>
            </span>
            <span className="bg2"></span>
            <div className="mask">
              <span className="bg1"></span>
              <span className="bg2"></span>
            </div>
            <div className="title">BAOBAOJS</div>
          </div>
        </div>
      </div>
    </div>
  );
}
