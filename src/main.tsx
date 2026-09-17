import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { App as AntdApp } from "antd";

import Root from "@/root";
import NotFound from "@/views/NotFound/NotFound";

const BaobaoLayout = lazy(() => import("@/views/BaobaoLayout/BaobaoLayout"));
const Homepage = lazy(() => import("@/views/Homepage/Homepage"));
const Interview = lazy(() => import("@/views/Interview/Interview"));
const ErnieBot = lazy(() => import("@/views/ErnieBot/ErnieBot"));
const FileDownloader = lazy(() => import("@/views/FileDownloader/FileDownloader"));
const Houchejishi = lazy(() => import("@/views/Houchejishi/Houchejishi"));
const Login = lazy(() => import("@/views/Login/Login"));

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
              <Route
                path="/"
                element={<BaobaoLayout />}
              >
                <Route
                  path="Homepage"
                  element={<Homepage />}
                />
                <Route
                  path="Interview"
                  element={<Interview />}
                />
                <Route
                  path="ErnieBot"
                  element={<ErnieBot />}
                />
                <Route
                  path="FileDownloader"
                  element={<FileDownloader />}
                />
                <Route
                  path="Houchejishi"
                  element={<Houchejishi />}
                />
                <Route
                  path="Login"
                  element={<Login />}
                />
              </Route>

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
