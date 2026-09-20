// utils/dayjs.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";

// 扩展插件
dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(timezone);

export default (date?: string | Date) => {
  return dayjs.utc(date).tz("Asia/Shanghai");
};
