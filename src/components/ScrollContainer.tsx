import React from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import type { OverlayScrollbarsComponentProps } from "overlayscrollbars-react";

import "overlayscrollbars/overlayscrollbars.css";

interface ScrollContainerProps extends Omit<OverlayScrollbarsComponentProps, "children"> {
  children: React.ReactNode;
  className?: string;
}

const ScrollContainer: React.FC<ScrollContainerProps> = ({
  children,
  className,
  options,
  ...props
}) => {
  return (
    <OverlayScrollbarsComponent
      className={className}
      options={{
        overflow: {
          x: "hidden",
          y: "scroll",
        },
        scrollbars: {
          autoHide: "leave",
          autoHideDelay: 500,
          theme: "os-theme-dark",
        },
        ...options,
      }}
      defer
      {...props}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
};

export default ScrollContainer;
