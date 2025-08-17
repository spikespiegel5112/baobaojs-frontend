import { Outlet, Route } from "react-router";
import { useNavigate, useLocation } from "react-router";
import utils from "@//utils/utils.ts";

import { useEffect, useState } from "react";
import "./index.scss";
export default function Homepage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [startButtonActive, setStartButtonActive] = useState(false);
  const [entranceActive, setEntranceActive] = useState(true);
  const [enterActive, setEnterActive] = useState(false);
  const [bgActive, setBgActive] = useState(false);

  interface MenuList {
    title: string;
    id: string;
  }

  const menuList: MenuList[] = [
    {
      title: "文心一言",
      id: "erniebot",
    },
    {
      title: "面试题",
      id: "Interview",
    },
  ];

  useEffect(() => {
    utils.$remResizing({
      baseline: 320,
      fontSize: 30,
      threshold: 640,
    });
    setTimeout(() => {
      setStartButtonActive(true);
    }, 300);

    if (location.pathname !== "/") {
      handleEnter();
    }
  }, []);

  const handleEnter = () => {
    setEntranceActive(false);
    setEnterActive(true);
    setStartButtonActive(false);
    setBgActive(true);
  };

  const handleNavigate = (item: MenuList) => {
    navigate(utils.$findRoutePathById(item.id));
  };

  return (
    <div className="layout_container">
      <div className={"entrance night " + (entranceActive ? "active" : "")}>
        <div className={"title"}>BAOBAOJS</div>
        <a
          className={"startbutton " + (startButtonActive ? "active" : "")}
          onClick={handleEnter}
        ></a>
      </div>

      <aside className={"menu " + (enterActive ? "active" : "")}>
        <div className={"main " + (bgActive ? "active" : "")}>
          <div className="menubg">
            <span className="bg1">
              <div className="rightglow"></div>
            </span>
            <div className="mask">
              <span className="bg1"></span>
            </div>
            <div className="title">BAOBAOJS</div>
          </div>
          <div className="list">
            <ul>
              {menuList.map((item) => (
                <li key={item.title} onClick={() => handleNavigate(item)}>
                  <a>{item.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
