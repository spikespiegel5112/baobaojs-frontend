import Draggable from "react-draggable";
import { Button } from "antd";
import { useRef } from "react";
import { MenuOutlined } from "@ant-design/icons";

type Props = {
  onClick?: () => void;
};

function DraggableMenuButton(props: Props) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);

  return (
    <Draggable
      nodeRef={nodeRef}
      onStart={() => {
        draggedRef.current = false;
      }}
      onDrag={() => {
        draggedRef.current = true;
      }}
    >
      <div
        className="menubutton"
        ref={nodeRef}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            props.onClick?.();
          }
        }}
        onClick={(event) => {
          if (draggedRef.current) {
            event.preventDefault();
            event.stopPropagation();
            draggedRef.current = false;
            return;
          }
          props.onClick?.();
        }}
        style={{
          position: "fixed",
          zIndex: 2,
          right: "0.5rem",
          bottom: "0.5rem",
        }}
      >
        <div className="menubutton">
          <Button
            style={{
              fontSize: "0.4rem",
            }}
            icon={<MenuOutlined />}
          ></Button>
        </div>
      </div>
    </Draggable>
  );
}

export default DraggableMenuButton;
