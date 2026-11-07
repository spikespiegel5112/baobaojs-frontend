import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { App as AntdApp } from "antd";
import { routeDictionary } from "@/routes.ts";

import Root from "@/root";
import NotFound from "@/views/NotFound/NotFound";

interface RouteItem {
  path: string;
  component: React.ComponentType;
  children?: RouteItem[];
}

const renderRoutes = (routes: RouteItem[]) => {
  return routes.map(({ path, component: Component, children }) => (
    <Route
      key={path}
      path={path}
      element={Component ? <Component /> : undefined}
    >
      {children && renderRoutes(children)}
    </Route>
  ));
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AntdApp
      message={{
        top: 100,
        duration: 2,
        maxCount: 3,
      }}
    >
      <Root>
        <BrowserRouter>
          <Suspense fallback={null}>
            <Routes>
              {renderRoutes(routeDictionary)}
              <Route
                path="*"
                element={<NotFound />}
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </Root>
    </AntdApp>
  </StrictMode>,
);
