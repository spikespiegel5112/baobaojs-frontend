import { Outlet, Link } from "react-router";
import { useNavigate, useLocation } from "react-router";
import utils from "@/utils/utils.ts";
import { routeDictionary, type RouteType } from "@/routes";

import { useEffect, useState } from "react";
import "./index.scss";

import { Layout, message } from "antd";
const { Header, Content, Sider } = Layout;

import { useTitle } from "@/hooks/useTitle";

export default function BaobaoLayout() {
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
      id: "Erniebot",
    },
    {
      title: "八股阅读器",
      id: "Interview",
    },
  ];

  useTitle("BAOBAOJS", "");

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
    message.config({
      top: 80,
      duration: 2,
      maxCount: 3,
    });
    (window as any).$message = message;
  }, []);

  const handleEnter = () => {
    setEntranceActive(false);
    setEnterActive(true);
    setStartButtonActive(false);
    setBgActive(true);
  };

  const handleNavigate = (item: MenuList) => {
    if (item.id === "Erniebot") {
      window.open('/chat')
    } else {
      navigate(utils.$findRoutePathById(item.id));
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            selectionColumnWidth: "0.8rem",
            /* 这里是你的组件 token */
          },
        },
      }}
    >
      <Layout className="layout_container">
        <div className={"entrance night " + (entranceActive ? "active" : "")}>
          <div className={"title"}>BAOBAOJS</div>
          <a
            className={"startbutton " + (startButtonActive ? "active" : "")}
            onClick={handleEnter}
          ></a>
        </div>

        <Sider className={"menu " + (enterActive ? "active" : "")} width="6rem">
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
                {(() => {
                  console.log(routeDictionary);

                  const flattenRouteDictionary = utils.$flattenList(routeDictionary);

                  return menuList.map((item) => {
                    return (
                      <li key={item.id}>
                        <Link
                          to={
                            flattenRouteDictionary.find((item2: RouteType) => item.id === item2.id)
                              ?.path
                          }
                          state={{ myInfo: "hello world", userId: 123 }}
                          className={location.pathname === item.id ? "active" : ""}
                          key={item.title}
                          onClick={() => handleNavigate(item)}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  });
                })()}
              </ul>
            </div>
          </div>
        </Sider>

        <Content className="main">
          <Outlet />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
