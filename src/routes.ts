export interface RouteType {
  id: string;
  path: string;
  filePath: string;
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
        id: "FileDownloader",
        path: "FileDownloader",
        filePath: "./views/FileDownloader/FileDownloader.tsx",
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

export const routeDictionary = _routeDictionary;
