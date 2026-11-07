import { useState } from "react";
import { Segmented } from "antd";
import { MobileOutlined, TabletOutlined, MonitorOutlined } from "@ant-design/icons";

import "./LeadersAndStructures.scss";

type DeviceType = "mobile" | "tablet" | "pc";

const deviceOptions = [
  {
    label: "Mobile",
    value: "mobile",
    icon: <MobileOutlined />,
  },
  {
    label: "Tablet",
    value: "tablet",
    icon: <TabletOutlined />,
  },
  {
    label: "PC",
    value: "pc",
    icon: <MonitorOutlined />,
  },
];

const deviceWidth: Record<DeviceType, string> = {
  mobile: "512px",
  tablet: "1024px",
  pc: "100%",
};

export default function LeadersAndStructures() {
  const [device, setDevice] = useState<DeviceType>("pc");

  return (
    <div className="ifrome_container">
      <header className="preview_header">
        <span className="header_title">设备预览</span>

        <Segmented
          value={device}
          options={deviceOptions}
          onChange={(value) => setDevice(value as DeviceType)}
          size="small"
        />
      </header>

      <div className="preview_content">
        <iframe
          title="LeadersAndStructures"
          src="https://leadersandstructures.com"
          style={{ width: deviceWidth[device] }}
        />
      </div>
    </div>
  );
}
