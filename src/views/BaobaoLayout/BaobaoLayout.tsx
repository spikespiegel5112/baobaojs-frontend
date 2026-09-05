import { useEffect, useState, useMemo } from "react";
import { Outlet, Link } from "react-router";
import { useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { App as AntdApp } from "antd";
import { setMessageInstance } from "@/utils/message";

import { setUserInfo, setIsLoggedIn } from "@/store/index";
import type { RootState, AppDispatch } from "@/store";
import utils from "@/utils/utils";
import type { AxiosError } from "axios";
import { routeDictionary, type RouteType } from "@/routes";

import "./BaobaoLayout.scss";

import { Layout, message } from "antd";
import dayjs from "dayjs";

import { useTitle } from "@/hooks/useTitle";

import { getUserInfoRequest, logoutRequest } from "@/api/auth";
import { VerticalAlignTopOutlined } from "@ant-design/icons";

export interface PaginationType {
  page: number;
  pageSize: number;
  total: number | undefined;
}

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
  const { message } = AntdApp.useApp();
  setMessageInstance(message);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);

  const dispatch = useDispatch<AppDispatch>();

  const [menuList, setMenuList] = useState<MenuItem[]>(menuListData);
  const [startButtonActive, setStartButtonActive] = useState(false);
  const [entranceActive, setEntranceActive] = useState(true);
  const [enterActive, setEnterActive] = useState(false);
  const [bgActive, setBgActive] = useState(false);
  const [timePeriod, setTimePeriod] = useState("");
  const [expandButtonFlag, setExpandButtonFlag] = useState(true);

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

      if (utils.$checkIsMobile()) {
        setExpandButtonFlag(true);
      }
    }

    highLightMenu();
    getTimePeriod();
    initMenu();
  }, []);

  useEffect(() => {
    highLightMenu();
  }, [location]);

  useEffect(() => {
    const result = JSON.parse(JSON.stringify(menuList));

    if (!expandButtonFlag) {
      result.forEach((item: MenuItem) => {
        item.title = item.title.slice(0, 2);
      });
    } else {
      result.forEach((item: MenuItem) => {
        const itemData = menuListData.find((item2) => item2.id === item.id);
        item.title = itemData ? itemData.title : item.title;
      });
    }
    setMenuList(result);
    highLightMenu();
  }, [expandButtonFlag]);

  const initMenu = () => {
    let menuStatus = localStorage.getItem("menuStatus");
    let result = true;
    if (utils.$checkIsMobile()) {
      result = true;
    } else {
      if (menuStatus === "expand") {
        result = true;
      } else if (menuStatus === "shrink") {
        result = false;
      }
    }
    setExpandButtonFlag(result);
    menuStatus = result ? "expand" : "shrink";
    localStorage.setItem("menuStatus", menuStatus);
  };

  const siderWidth = useMemo(() => {
    let result = "";
    if (utils.$checkIsMobile()) {
      result = expandButtonFlag ? "100%" : "0";
    } else {
      result = expandButtonFlag ? "6rem" : "1.3rem";
    }
    return result;
  }, [expandButtonFlag]);

  const handleEnter = () => {
    setEntranceActive(false);
    setEnterActive(true);
    setStartButtonActive(false);
    setBgActive(true);
    initMenu();
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
    if (utils.$checkIsMobile()) {
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
            utils.$message.success("注销成功");
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
    const menuStatus = !expandButtonFlag ? "expand" : "shrink";
    localStorage.setItem("menuStatus", menuStatus);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#e6212a",
          colorSuccess: "#00a850",
          colorWarning: "#ffb400",
          colorError: "#e6212a",
          colorInfo: "#1a1a1a",
          colorTextBase: "#333333",
          colorBgBase: "#f5f5f5",
          colorPrimaryBg: "#ffe9ea",
          colorPrimaryBgHover: "#ffd0d2",
          colorPrimaryBorder: "#ff989c",
          colorPrimaryBorderHover: "#ff6b70",
          colorPrimaryHover: "#f04048",
          colorPrimaryActive: "#c0181f",
          colorPrimaryText: "#e6212a",
          colorPrimaryTextHover: "#f04048",
          colorPrimaryTextActive: "#c0181f",
          colorErrorBg: "#ffe9ea",
          colorErrorBgHover: "#ffd0d2",
          colorErrorBorder: "#ff989c",
          colorErrorBorderHover: "#ff6b70",
          colorErrorHover: "#f04048",
          colorErrorActive: "#c0181f",
          colorErrorText: "#e6212a",
          colorErrorTextHover: "#f04048",
          colorErrorTextActive: "#c0181f",
          colorText: "rgba(51, 51, 51, 0.88)",
          colorTextSecondary: "rgba(51, 51, 51, 0.65)",
          colorTextTertiary: "rgba(51, 51, 51, 0.45)",
          colorTextQuaternary: "rgba(51, 51, 51, 0.25)",
          colorTextDisabled: "rgba(51, 51, 51, 0.25)",
          colorBgContainer: "#ffffff",
          colorBgElevated: "#ffffff",
          colorBgLayout: "#f0f0f0",
          colorBgSpotlight: "rgba(26, 26, 26, 0.85)",
          colorBgMask: "rgba(26, 26, 26, 0.45)",
          colorBorder: "#e8e8e8",
          colorBorderSecondary: "#f0f0f0",
          borderRadius: 4,
          borderRadiusXS: 2,
          borderRadiusSM: 3,
          borderRadiusLG: 6,
          padding: 16,
          paddingSM: 12,
          paddingLG: 24,
          margin: 16,
          marginSM: 12,
          marginLG: 24,
          boxShadow: "0 2px 6px 0 rgba(0, 0, 0, 0.06)",
          boxShadowSecondary: "0 4px 10px 0 rgba(0, 0, 0, 0.1)",
        },
        button: {
          root: "border-0 transition-all duration-200",
          content: "font-medium",
        },
        card: {
          root: "border-0 shadow-sm",
          header: "border-b border-gray-100",
        },
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
          <button
            className={"startbutton" + (startButtonActive ? " active" : "")}
            onClick={handleEnter}
          ></button>
        </div>

        <Layout.Sider
          className={
            "menu" +
            (utils.$checkIsMobile() ? " mobile" : "") +
            (enterActive ? " active" : "") +
            (expandButtonFlag ? " expand" : " shrink")
          }
          width={siderWidth}
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
                  <button onClick={handleBackToRoot}>BAOBAOJS</button>
                </h1>
              </div>
            </div>
            <div className={"list " + (bgActive ? "active" : "")}>
              <ul>
                {(() => {
                  const flattenRouteDictionary = utils.$flattenList(routeDictionary);
                  return menuList.map((item) => {
                    return (
                      <li
                        key={item.id}
                        className={item.active ? "active" : '"'}
                      >
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
        </Layout.Sider>

        <Layout.Content className={"main" + (expandButtonFlag ? "expand" : " shrink")}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
}
