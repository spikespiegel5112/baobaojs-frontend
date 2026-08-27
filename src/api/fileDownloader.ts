import service from "@/utils/service.ts";

export const getFileDownloaderList = (params: Record<string, unknown>) =>
  service.get("/fileDownloader/getFileDownloaderList", {
    params,
  });
