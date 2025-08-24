import { useEffect } from "react";

/**
 * 自定义 Hook：设置页面标题
 * @param {string} title - 页面标题
 * @param {string} [prevTitle] - 可选，离开组件时恢复的标题（默认保留原标题）
 */
export function useTitle(title: string, prevTitle: string) {
  useEffect(() => {
    const oldTitle = document.title;

    // 设置新标题
    document.title = title;

    // 清理函数：组件卸载时恢复
    return () => {
      document.title = prevTitle || oldTitle;
    };
  }, [title, prevTitle]);
}
