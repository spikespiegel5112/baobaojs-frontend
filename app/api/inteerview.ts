import service from "@/utils/service.ts";

export const getInterviewListRequest = (params: any) =>
  service.get("/interview/getInterviewList", {
    params,
  });
