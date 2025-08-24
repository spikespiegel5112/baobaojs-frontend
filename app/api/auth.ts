import service from "@/utils/service.ts";

export const loginRequest = (params: any) =>
  service.get("/auth/login", {
    params,
  });
