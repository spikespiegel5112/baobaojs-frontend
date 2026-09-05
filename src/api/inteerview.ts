import service from "@/utils/service.ts";

export const getInterviewListRequest = (params: Record<string, unknown>) =>
  service.get("/interview/getInterviewList", {
    params,
  });

export const getInterviewDetailRequest = (params: Record<string, unknown>) =>
  service.get("/interview/getInterviewDetail", {
    params,
  });

export const createOrUpdateQARequest = (params: Record<string, unknown>) =>
  service.post("/interview/createOrUpdateQA", params);

export const deleteMultipleDataByIdRequest = (params: Record<string, unknown>) =>
  service.post("/interview/deleteMultipleDataById", {
    params,
  });
