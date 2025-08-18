import service from "@/utils/service.ts";

export const getInterviewListRequest = (params: any) =>
  service.get("/interview/getInterviewList", {
    params,
  });

export const createOrUpdateQAndARequest = (data: any) =>
  service.post("/interview/createOrUpdateQAndA", data);

export const deleteMultipleDataByIdRequest = (data: any) =>
  service.post("/interview/deleteMultipleDataById", data);
