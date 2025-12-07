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
import dayjs from "dayjs";

import { useTitle } from "@/hooks/useTitle";

import { getUserInfoRequest, logoutRequest } from "@/api/auth";
import { VerticalAlignTopOutlined } from "@ant-design/icons";

interface User {
  id: number;
  role: string | null;
  userName: string;
}

interface MenuItem {
  title: string;
  id: string;
  active: boolean;
}

const menuListData = [
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
];

export default function BaobaoLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);

  const dispatch = useDispatch<AppDispatch>();
  // const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const [menuList, setMenuList] = useState<MenuItem[]>(menuListData);
  const [startButtonActive, setStartButtonActive] = useState(false);
  const [entranceActive, setEntranceActive] = useState(true);
  const [enterActive, setEnterActive] = useState(false);
  const [bgActive, setBgActive] = useState(false);
  const [timePeriod, setTimePeriod] = useState("");
  const [expandButtonFlag, setExpandButtonFlag] = useState(true);
  const [currentPathName, setCurrentPathName] = useState("");

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
      setExpandButtonFlag(true);

      if (checkIsMobile()) {
        setExpandButtonFlag(true);
      }
    }
    message.config({
      top: 80,
      duration: 2,
      maxCount: 3,
    });
    (window as any).$message = message;

    highLightMenu();
    getTimePeriod();
  }, []);

  useEffect(() => {
    console.log(location);
    setCurrentPathName(location.pathname);

    setMenuList((prev: MenuList[]) => {
      return menuList.map((item2) => {
        return {
          ...item2,
          active: location.pathname.replaceAll("/", "") === item2.id,
        };
      });
    });
  }, [location]);

  useEffect(() => {
    let result = JSON.parse(JSON.stringify(menuListData));

    if (!expandButtonFlag) {
      result.forEach((item: MenuItem) => {
        item.title = item.title.slice(0, 2);
      });
    } else {
      result.forEach((item: MenuItem) => {
        item.title = item.title;
      });
    }
    setMenuList(result);
  }, [expandButtonFlag]);

  const checkIsMobile = () => {
    const innerWidth = window.innerWidth;
    return innerWidth <= 768;
  };

  const handleEnter = () => {
    setEntranceActive(false);
    setEnterActive(true);
    setStartButtonActive(false);
    setBgActive(true);
    setExpandButtonFlag(true);
  };

  const getTimePeriod = () => {
    const hour = dayjs().hour();
    if (hour >= 6 && hour <= 18) {
      setTimePeriod("day");
    } else {
      setTimePeriod("night");
    }
  };

  const handleNavigate = (item: MenuList) => {
    if (checkIsMobile()) {
      handleToggleExpand();
    }

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
      content: "你确定要注销吗？",
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

  const highLightMenu = () => {
    const currentRoute = utils.$findRouteInfoByPath(location.pathname);
    setMenuList((prev: MenuList[]) => {
      return prev.map((item2) => ({
        ...item2,
        active: currentRoute.id === item2.id,
      }));
    });
  };

  const handleBackToRoot = () => {
    navigate("/");
    setMenuList(
      menuList.map((item) => {
        return {
          ...item,
          active: false,
        };
      }),
    );
  };

  const handleToggleExpand = () => {
    setExpandButtonFlag(!expandButtonFlag);

    // if (checkIsMobile()) {
    //   setExpandButtonFlag(!expandButtonFlag);
    // } else {
    //   setExpandButtonFlag(!expandButtonFlag);
    // }
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
        <div className={`entrance ${timePeriod} ${entranceActive ? " active" : ""}`}>
          <div className="title">BAOBAOJS</div>
          <a
            className={"startbutton" + (startButtonActive ? " active" : "")}
            onClick={handleEnter}
          ></a>
        </div>

        <Sider
          className={
            "menu" +
            (checkIsMobile() ? " mobile" : "") +
            (enterActive ? " active" : "") +
            (expandButtonFlag ? " expand" : " shrink")
          }
          width={expandButtonFlag ? "6rem" : "1.3rem"}
        >
          <div className={"main "}>
            <div className={"menubg" + (bgActive ? " active" : "")}>
              <span className="bg1">
                <div className="rightglow"></div>
              </span>
              <div className="mask">
                <span className="bg1"></span>
              </div>
              <div className="title">
                <h1>
                  <a onClick={handleBackToRoot}>BAOBAOJS</a>
                </h1>
              </div>
            </div>
            <div className={"list " + (bgActive ? "active" : "")}>
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
            <div className="login">
              {!isLoggedIn && (
                <Button>
                  <Link to="/Login">登录</Link>
                </Button>
              )}
              {isLoggedIn && <Button onClick={handleLogout}>注销</Button>}
            </div>
            <div className="expand">
              {expandButtonFlag && (
                <Button
                  className="left"
                  type="text"
                  shape="round"
                  icon={<VerticalAlignTopOutlined />}
                  onClick={handleToggleExpand}
                ></Button>
              )}
              {!expandButtonFlag && (
                <Button
                  className="right"
                  type="text"
                  shape="round"
                  icon={<VerticalAlignTopOutlined />}
                  onClick={handleToggleExpand}
                ></Button>
              )}
            </div>
          </div>
        </Sider>

        <Content className={"main" + (expandButtonFlag ? "expand" : " shrink")}>
          <Outlet />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
