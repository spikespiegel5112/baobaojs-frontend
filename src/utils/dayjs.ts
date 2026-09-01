// utils/dayjs.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

// 扩展插件
dayjs.extend(utc);
dayjs.extend(relativeTime);

export default dayjs;
