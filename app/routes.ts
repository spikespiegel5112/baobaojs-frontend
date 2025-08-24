import { type RouteConfigEntry, route } from "@react-router/dev/routes";

export interface RouteType {
  id: string;
  path: string;
  filePath?: string;
  children?: RouteType[];
}

const _routeDictionary: RouteType[] = [
  {
    id: "BaobaoLayout",
    path: "/",
    filePath: "./views/BaobaoLayout/BaobaoLayout.tsx",
    children: [
      {
        id: "Homepage",
        path: "Homepage",
        filePath: "./views/Homepage/Homepage.tsx",
      },
      {
        id: "Interview",
        path: "Interview",
        filePath: "./views/Interview/Interview.tsx",
      },
      {
        id: "ErnieBot",
        path: "ErnieBot",
        filePath: "./views/ErnieBot/ErnieBot.tsx",
      },
      {
        id: "Houchejishi",
        path: "Houchejishi",
        filePath: "./views/Houchejishi/Houchejishi.tsx",
      },
      {
        id: "Login",
        path: "Login",
        filePath: "./views/Login/Login.tsx",
      },
    ],
  },
  {
    id: "NotFound",
    path: "*",
    filePath: "./views/NotFound/NotFound.tsx",
  },
];

const looper = (children: RouteType[]): RouteConfigEntry[] => {
  return children.map((item) => {
    if (item.children && item.children.length > 0) {
      return route(item.path, item.filePath, looper(item.children));
    } else {
      return route(item.path, item.filePath);
    }
  });
};

const result: RouteConfigEntry[] = looper(_routeDictionary);

export default result;

export const routeDictionary = _routeDictionary;
