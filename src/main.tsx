import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { App as AntdApp } from "antd";
import Root from "@/root";
import BaobaoLayout from "@/views/BaobaoLayout/BaobaoLayout";
import ErnieBot from "@/views/ErnieBot/ErnieBot";
import FileDownloader from "@/views/FileDownloader/FileDownloader";
import Homepage from "@/views/Homepage/Homepage";
import Houchejishi from "@/views/Houchejishi/Houchejishi";
import Interview from "@/views/Interview/Interview";
import Login from "@/views/Login/Login";
import NotFound from "@/views/NotFound/NotFound";

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
        </BrowserRouter>
      </Root>
    </AntdApp>
  </StrictMode>,
);
