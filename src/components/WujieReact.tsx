import { useEffect, useRef, useState } from "react";
import { startApp } from "wujie";

interface WujieReactProps {
  /** 子应用唯一名称 */
  name: string;

  /** 子应用入口地址 */
  url: string;

  /** 容器宽度 */
  width?: string;

  /** 容器高度 */
  height?: string;

  /** 传递给子应用的数据 */
  props?: Record<string, unknown>;

  /** 是否启用保活模式 */
  alive?: boolean;

  /** 加载完成回调 */
  onLoad?: () => void;

  /** 加载失败回调 */
  onError?: (error: unknown) => void;

  /** 自定义容器类名 */
  className?: string;

  /** 自定义容器样式 */
  style?: React.CSSProperties;
}

const WujieReact = ({
  name,
  url,
  width = "100%",
  height = "100%",
  props = {},
  alive = false,
  onLoad,
  onError,
  className,
  style,
}: WujieReactProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef(props);
  const callbacksRef = useRef({ onLoad, onError });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  propsRef.current = props;
  callbacksRef.current = { onLoad, onError };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    setLoading(true);
    setError(false);

    startApp({
      name,
      url,
      el: container,
      alive,
      sync: false,
      props: propsRef.current,

      fetch: (input, init) => {
        return window.fetch(input, {
          ...init,
          credentials: "include",
        });
      },

      afterMount() {
        if (disposed) return;
        setLoading(false);
        callbacksRef.current.onLoad?.();
      },

      loadError(error) {
        if (disposed) return;
        setLoading(false);
        setError(true);
        callbacksRef.current.onError?.(error);
      },
    })
      .then((destroy) => {
        if (disposed) {
          destroy();
        }
      })
      .catch((error) => {
        if (disposed) return;
        setLoading(false);
        setError(true);
        callbacksRef.current.onError?.(error);
      });

    return () => {
      disposed = true;
    };
  }, [name, url, alive]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        ...style,
      }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          正在加载...
        </div>
      )}

      {error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          子应用加载失败
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default WujieReact;
