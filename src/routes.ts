import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

export interface RouteType {
  id: string;
  path: string;
  filePath: string;
  children?: RouteType[];
  component: ComponentType | LazyExoticComponent<ComponentType>;
}

const _routeDictionary: RouteType[] = [
  {
    id: "BaobaoLayout",
    path: "/",
    filePath: "./views/BaobaoLayout/BaobaoLayout.tsx",
    component: lazy(() => import("@/views/BaobaoLayout/BaobaoLayout.tsx")),
    children: [
      {
        id: "Homepage",
        path: "Homepage",
        filePath: "./views/Homepage/Homepage.tsx",
        component: lazy(() => import("@/views/Homepage/Homepage.tsx")),
      },
      {
        id: "Interview",
        path: "Interview",
        filePath: "./views/Interview/Interview.tsx",
        component: lazy(() => import("@/views/Interview/Interview.tsx")),
      },
      {
        id: "ErnieBot",
        path: "ErnieBot",
        filePath: "./views/ErnieBot/ErnieBot.tsx",
        component: lazy(() => import("@/views/ErnieBot/ErnieBot.tsx")),
      },
      {
        id: "FileDownloader",
        path: "FileDownloader",
        filePath: "./views/FileDownloader/FileDownloader.tsx",
        component: lazy(() => import("@/views/FileDownloader/FileDownloader.tsx")),
      },
      {
        id: "Houchejishi",
        path: "Houchejishi",
        filePath: "./views/Houchejishi/Houchejishi.tsx",
        component: lazy(() => import("@/views/Houchejishi/Houchejishi.tsx")),
      },
      {
        id: "LeadersAndStructures",
        path: "LeadersAndStructures",
        filePath: "./views/LeadersAndStructures/LeadersAndStructures.tsx",
        component: lazy(() => import("@/views/LeadersAndStructures/LeadersAndStructures.tsx")),
      },
      {
        id: "Login",
        path: "Login",
        filePath: "./views/Login/Login.tsx",
        component: lazy(() => import("@/views/Login/Login.tsx")),
      },
    ],
  },
  {
    id: "NotFound",
    path: "*",
    filePath: "./views/NotFound/NotFound.tsx",
    component: lazy(() => import("@/views/NotFound/NotFound.tsx")),
  },
];

export const routeDictionary = _routeDictionary;
