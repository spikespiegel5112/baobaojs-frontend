import service from "@/utils/service.ts";

export const getMessageListRequest = (params: Record<string, unknown>) =>
  service.get("/messageBoard/getMessageList", {
    params,
  });

export const createMessageRequest = (params: Record<string, unknown>) =>
  service.post("/messageBoard/createMessage", params);

export const deleteMessageRequest = (params: Record<string, unknown>) =>
  service.post("/messageBoard/deleteMessage", params);
