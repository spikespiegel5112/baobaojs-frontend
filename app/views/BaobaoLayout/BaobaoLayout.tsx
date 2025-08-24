import { Outlet, Link } from "react-router";
import { useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo, setIsLoggedIn } from "@/store/index";
import type { RootState, AppDispatch } from "@/store";
import utils from "@/utils/utils.ts";
import type { AxiosError } from "axios";
import { routeDictionary, type RouteType } from "@/routes";

import { useEffect, useState } from "react";
import "./index.scss";

import { Layout, message } from "antd";
const { Header, Content, Sider } = Layout;

import { useTitle } from "@/hooks/useTitle";

import { getUserInfoRequest, logoutRequest } from "@/api/auth";

interface User {
  id: number;
  role: string | null;
  userName: string;
}

export default function BaobaoLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);

  const dispatch = useDispatch<AppDispatch>();
  // const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const [menuList, setMenuList] = useState([
    {
      title: "文心一言",
      id: "ErnieBot",
      active: false,
    },
    {
      title: "八股阅读器",
      id: "Interview",
      active: false,
    },
    {
      title: "文件下载器",
      id: "FileDownloader",
      active: false,
    },
    {
      title: "厚车吉市",
      id: "Houchejishi",
      active: false,
    },
  ]);
  const [startButtonActive, setStartButtonActive] = useState(false);
  const [entranceActive, setEntranceActive] = useState(true);
  const [enterActive, setEnterActive] = useState(false);
  const [bgActive, setBgActive] = useState(false);

  interface MenuList {
    title: string;
    id: string;
    active: boolean;
  }

  useTitle("BAOBAOJS", "");

  useEffect(() => {
    getUserInfo();
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
    setMenuList((prev: MenuList[]) => {
      return prev.map((item2) => ({
        ...item2,
        active: item.id === item2.id,
      }));
    });
    navigate(utils.$findRoutePathById(item.id));
  };

  const getUserInfo = () => {
    getUserInfoRequest({
      userName: "admin",
    })
      .then((response: User) => {
        dispatch(setUserInfo(response));
        dispatch(setIsLoggedIn(true));
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "提示",
      content: "你确定要删除吗？",
      okText: "确认",
      cancelText: "取消",
      onOk() {
        logoutRequest({})
          .then(() => {
            $message.success("注销成功");
            dispatch(setUserInfo(null));
            dispatch(setIsLoggedIn(false));
            navigate("Login");
          })
          .catch((error: AxiosError) => {
            console.log(error);
          });
      },
      onCancel() {
        console.log("取消操作");
      },
    });
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
                  const flattenRouteDictionary = utils.$flattenList(routeDictionary);

                  return menuList.map((item) => {
                    return (
                      <li key={item.id} className={item.active ? "active" : '"'}>
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
          <div className="footer">
            {!isLoggedIn && (
              <Button type="link">
                <Link to="/Login">登录</Link>
              </Button>
            )}
            {isLoggedIn && (
              <Button type="link" onClick={handleLogout}>
                注销
              </Button>
            )}
          </div>
        </Sider>

        <Content className="main">
          <Outlet />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
