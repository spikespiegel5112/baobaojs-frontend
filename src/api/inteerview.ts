import service from "@/utils/service.ts";

export const getInterviewListRequest = (params: any) =>
  service.get("/interview/getInterviewList", {
    params,
  });

export const getInterviewDetailRequest = (params: any) =>
  service.get("/interview/getInterviewDetail", {
    params,
  });

export const createOrUpdateQARequest = (data: any) =>
  service.post("/interview/createOrUpdateQA", data);

export const deleteMultipleDataByIdRequest = (data: any) =>
  service.post("/interview/deleteMultipleDataById", data);
