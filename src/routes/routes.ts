import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

export interface RouteType {
  id: string;
  path: string;
  filePath: string;
  children?: RouteType[];
  component: ComponentType | LazyExoticComponent<ComponentType>;
}

type RouteDictionaryType = Omit<RouteType, "children"> & {
  active?: boolean;
  abbreviation?: string;
  hidden?: boolean;
  title?: string;
  children?: RouteDictionaryType[];
};

const _routeDictionary: RouteDictionaryType[] = [
  {
    id: "BaobaoLayout",
    path: "/",
    filePath: "./views/BaobaoLayout/BaobaoLayout.tsx",
    component: lazy(() => import("@/views/BaobaoLayout/BaobaoLayout.tsx")),
    hidden: true,
    children: [
      {
        id: "Homepage",
        path: "Homepage",
        filePath: "./views/Homepage/Homepage.tsx",
        component: lazy(() => import("@/views/Homepage/Homepage.tsx")),
        active: false,
        hidden: true,
      },
      {
        id: "ErnieBot",
        path: "ErnieBot",
        filePath: "./views/ErnieBot/ErnieBot.tsx",
        component: lazy(() => import("@/views/ErnieBot/ErnieBot.tsx")),
        title: "文心一言",
        active: false,
      },
      {
        id: "Interview",
        path: "Interview",
        filePath: "./views/Interview/Interview.tsx",
        component: lazy(() => import("@/views/Interview/Interview.tsx")),
        title: "百科全书",
        active: false,
      },

      {
        id: "MessageBoard",
        path: "MessageBoard",
        filePath: "./views/MessageBoard/MessageBoard.tsx",
        component: lazy(() => import("@/views/MessageBoard/MessageBoard.tsx")),
        title: "留言板",
        active: false,
      },
      {
        id: "ThreeJSBarChart",
        path: "ThreeJSBarChart",
        filePath: "./views/ThreeJSBarChart/ThreeJSBarChart.tsx",
        component: lazy(() => import("@/views/ThreeJSBarChart/ThreeJSBarChart.tsx")),
        title: "Three.js饼状图",
        abbreviation: "饼状图",
        active: false,
      },

      {
        id: "Houchejishi",
        path: "Houchejishi",
        filePath: "./views/Houchejishi/Houchejishi.tsx",
        component: lazy(() => import("@/views/Houchejishi/Houchejishi.tsx")),
        active: false,
        title: "厚车吉市",
      },
      {
        id: "LeadersAndStructures",
        path: "LeadersAndStructures",
        filePath: "./views/LeadersAndStructures/LeadersAndStructures.tsx",
        component: lazy(() => import("@/views/LeadersAndStructures/LeadersAndStructures.tsx")),
        title: "Leaders & Structures",
        abbreviation: "LS",
        active: false,
      },
      {
        id: "EasyTrademarkChina",
        path: "EasyTrademarkChina",
        filePath: "./views/EasyTrademarkChina/EasyTrademarkChina.tsx",
        component: lazy(() => import("@/views/EasyTrademarkChina/EasyTrademarkChina")),
        title: "Easy Trademark China",
        abbreviation: "ETC",
        active: false,
      },
      {
        id: "FileDownloader",
        path: "FileDownloader",
        filePath: "./views/FileDownloader/FileDownloader.tsx",
        component: lazy(() => import("@/views/FileDownloader/FileDownloader.tsx")),
        active: false,
        title: "文件下载器",
      },
      {
        id: "Login",
        path: "Login",
        filePath: "./views/Login/Login.tsx",
        component: lazy(() => import("@/views/Login/Login.tsx")),
        hidden: true,
      },
    ],
  },
  {
    id: "NotFound",
    path: "*",
    filePath: "./views/NotFound/NotFound.tsx",
    component: lazy(() => import("@/views/NotFound/NotFound.tsx")),
    hidden: true,
  },
];

export const routeDictionary = _routeDictionary;
