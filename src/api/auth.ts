import service from "@/utils/service.ts";

export const loginRequest = (params: Record<string, unknown>) =>
  service.get("/auth/login", {
    params,
  });

export const changePasswordRequest = (data: Record<string, unknown>) =>
  service.post("/auth/changePassword", {
    data,
  });
export const getUserInfoRequest = (params: Record<string, unknown>) =>
  service.get("/user/getUserInfo", {
    params,
  });
export const logoutRequest = (data: Record<string, unknown>) =>
  service.post("/auth/logout", {
    data,
  });
