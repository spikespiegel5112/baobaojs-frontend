import service from "@/utils/service.ts";

export const loginRequest = (params: any) =>
  service.get("/auth/login", {
    params,
  });

export const changePasswordRequest = (data: any) => service.post("/auth/changePassword", data);
export const getUserInfoRequest = (params: any) =>
  service.get("/user/getUserInfo", {
    params,
  });
export const logoutRequest = (data: any) => service.post("/auth/logout", data);
