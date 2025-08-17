import {
  type RouteConfig,
  type RouteConfigEntry,
  index,
  route,
} from "@react-router/dev/routes";

interface Route {
  id: string;
  path: string;
  filePath: string;
  children?: Route[];
}

const _routeDictionary: Route[] = [
  {
    id: "Layout",
    path: "",
    filePath: "./views/Layout/Layout.tsx",
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
    ],
  },
];

const looper = (children: Route[]): RouteConfigEntry[] => {
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
