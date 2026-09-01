import service from "@/utils/service.ts";

export const getFileDownloaderListRequest = (params: Record<string, unknown>) =>
  service.get("/fileDownloader/getFileDownloaderList", {
    params,
  });

export const getSingleFileRequest = (params: Record<string, unknown>) =>
  service.get("/fileDownloader/getSingleFile", {
    params,
  });

export const createOrUpdateRequest = (params: Record<string, unknown>) =>
  service.post("/fileDownloader/createOrUpdate", params);

export const deleteFileDownloaderRequest = (params: Record<string, unknown>) =>
  service.delete("/fileDownloader/deleteFileDownloader", {
    data: params,
  });
