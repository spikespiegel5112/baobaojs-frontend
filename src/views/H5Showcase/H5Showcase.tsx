import { useEffect, useState } from "react";
import { Segmented, Spin, type SegmentedProps } from "antd";
import { MobileOutlined } from "@ant-design/icons";

import "./H5Showcase.scss";

type DeviceType = "mobile" | "tablet" | "pc";

type H5ProjectOption = {
  label: string;
  value: string;
  path: string;
};

const h5ProjectList: H5ProjectOption[] = [
  {
    label: "文心一言",
    value: "chat",
    path: "chat",
  },
  {
    label: "春天再出发",
    value: "ppctzcf",
    path: "ppctzcf",
  },
  {
    label: "依视路",
    value: "yishilu",
    path: "yishilu",
  },
];

const deviceOptions: SegmentedProps<DeviceType>["options"] = [
  {
    label: "Mobile",
    value: "mobile",
    icon: <MobileOutlined />,
  },
];

const deviceWidth: Record<DeviceType, string> = {
  mobile: "512px",
  tablet: "1024px",
  pc: "100%",
};

export default function H5Showcase() {
  const url = "https://baobaojs.com";
  const [project, setProject] = useState<string>(h5ProjectList[0].value);
  const [device, setDevice] = useState<DeviceType>("mobile");
  const [iframeUrl, setIframeUrl] = useState<string>(url);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    reloadIframe(h5ProjectList[0].path);
  };

  const reloadIframe = (targetPath: string) => {
    setLoading(true);
    const timestamp = Date.now();
    setIframeUrl(`${url}/${targetPath}?timestamp=${timestamp}`);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const handleChangeProject = (value: string) => {
    setProject(value);
    const next = h5ProjectList.find((item) => item.value === value);

    if (next) {
      reloadIframe(next.path);
    }
  };

  const handleChangeDevice = (value: DeviceType) => {
    setDevice(value);
    const current = h5ProjectList.find((item) => item.value === project);
    reloadIframe(current ? current.path : project);
  };

  return (
    <div className="ifrome_container">
      <header className="preview_header">
        <Segmented
          value={project}
          options={h5ProjectList}
          onChange={(value) => handleChangeProject(value)}
          size="small"
        />

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
            title="H5"
            src={iframeUrl}
            style={{ width: deviceWidth[device] }}
          />
        </Spin>
      </div>
    </div>
  );
}
