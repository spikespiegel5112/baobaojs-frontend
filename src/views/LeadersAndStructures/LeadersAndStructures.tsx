import { useState } from "react";
import { Segmented, Spin, type SegmentedProps } from "antd";
import { MobileOutlined, TabletOutlined, MonitorOutlined } from "@ant-design/icons";

import "./LeadersAndStructures.scss";

type DeviceType = "mobile" | "tablet" | "pc";

const deviceOptions: SegmentedProps<DeviceType>["options"] = [
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
  const url = "https://leadersandstructures.com";
  const [device, setDevice] = useState<DeviceType>("pc");
  const [iframeUrl, setIframeUrl] = useState<string>(url);
  const [loading, setLoading] = useState(false);

  const handleChangeDevice = (value: DeviceType) => {
    setLoading(true);
    setDevice(value);
    const timestamp = Date.now();
    setIframeUrl(`${url}?timestamp=${timestamp}`);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="ifrome_container">
      <header className="preview_header">
        <span className="header_title">Leaders & Structures</span>

        <Segmented
          value={device}
          options={deviceOptions}
          onChange={(value) => handleChangeDevice(value)}
          size="small"
        />
      </header>

      <div className="preview_content">
        <Spin
          spinning={loading}
          style={{ width: deviceWidth[device] }}
        >
          <iframe
            title="LeadersAndStructures"
            src={iframeUrl}
            style={{ width: deviceWidth[device] }}
          />
        </Spin>
      </div>
    </div>
  );
}
