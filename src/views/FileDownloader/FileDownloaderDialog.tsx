import React, { useEffect, useState, useRef } from "react";
import "./FileDownloader.scss";
import { App, Select, Popover } from "antd";
import { getSingleFileRequest, createOrUpdateRequest } from "@/api/fileDownloader";

import type { FieldData } from "@/views/FileDownloader/FileDownloader";

interface Props {
  dialogVisible: boolean;
  formData: FieldData | null;
  onClose: () => void;
  onSave?: () => void;
}

export default function FileDownloaderDialog(props: Props) {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  useEffect(() => {
    if (props.dialogVisible) {
      form.setFieldsValue(props.formData);
      setType(form.getFieldValue("type"));
      handleChangeSeriesNumberEnd(form.getFieldValue("seriesNumberEnd"));
    }
  }, [props]);

  const [type, setType] = useState<string>("");

  const [gridDictionary, setGridDictionary] = useState<{ seriesNumber: number; status: string }[]>(
    [],
  );

  const gridDictionaryRef = useRef<{ seriesNumber: number; status: string }[]>([]);
  const downloadingFlagRef = useRef<boolean>(false);

  const [downloadingFlag, setDownloadingFlag] = useState<boolean>(false);
  const [savingFlag, setSavingFlag] = useState<boolean>(false);

  const handleSaveDownloadInfo = () => {
    setSavingFlag(true);
    form.validateFields().then(() => {
      const params = form.getFieldsValue();
      createOrUpdateRequest(params)
        .then(() => {
          message.success("提交成功");
        })
        .catch((error: Error) => {
          console.log(error);
        })
        .finally(() => {
          setSavingFlag(false);
        });
    });
  };

  const beginDownload = () => {
    form.validateFields().then(() => {
      setDownloadingFlag(true);
      downloadingFlagRef.current = true;
      gridDictionary.forEach((item) => {
        item.status = "";
      });
      makeProgressGrid();

      if (form.getFieldValue("type") === "multiple") {
        const seriesNumberStart = Number(form.getFieldValue("seriesNumberStart"));
        const times =
          Number(form.getFieldValue("seriesNumberEnd")) -
          Number(form.getFieldValue("seriesNumberStart")) +
          1;
        let count = 0;
        const prefixLength = (form.getFieldValue("seriesNumberEnd") + "")
          .split("")
          .map(() => "0")
          .join("");

        const loop = () => {
          if (count >= times) {
            setDownloadingFlag(false);
            downloadingFlagRef.current = false;
          }
          if (!downloadingFlagRef.current) {
            return;
          }

          let currentGridIndex = 0;
          gridDictionary.forEach((item, index) => {
            if (item.seriesNumber === count + seriesNumberStart) {
              currentGridIndex = index;
            }
          });
          if (count <= times) {
            gridDictionaryRef.current[currentGridIndex].status = "pending";

            const filledUpCount = (prefixLength + (count + seriesNumberStart)).slice(-3);
            const params = {
              type: form.getFieldValue("type"),
              fileUrl:
                form.getFieldValue("fileUrlLeftSide") +
                filledUpCount +
                form.getFieldValue("fileUrlRightSide"),
              destPath: form.getFieldValue("destPath"),
            };
            getSingleFileRequest(params)
              .then(() => {
                gridDictionaryRef.current[currentGridIndex].status = "success";
                setGridDictionary([...gridDictionaryRef.current]);
                console.log("=====gridDictionaryRef.current=====");
                console.log(gridDictionaryRef.current.map((item) => item.status));
                console.log(gridDictionary.map((item) => item.status));
                if (count < times) {
                  loop();
                } else {
                  setDownloadingFlag(false);
                  downloadingFlagRef.current = false;
                  message.success("下载流程结束");
                }
              })
              .catch((error) => {
                message.error("下载失败");
                if (downloadingFlagRef.current) {
                  gridDictionaryRef.current[currentGridIndex].status = "failed";
                  setGridDictionary(gridDictionaryRef.current);
                }

                if (count < times) {
                  loop();
                } else {
                  setDownloadingFlag(false);
                  downloadingFlagRef.current = false;
                  message.success("下载流程结束");
                }
                console.log(error);
              })
              .finally(() => {});
          }
          count++;
        };

        loop();
      } else if (form.getFieldValue("type") === "single") {
        const params = {
          type: form.getFieldValue("type"),
          fileUrl: form.getFieldValue("fileUrl"),
          destPath: form.getFieldValue("destPath"),
          fileSuffix: form.getFieldValue("fileSuffix"),
        };
        getSingleFileRequest(params)
          .then(async () => {
            message.success("下载成功");
          })
          .catch((error) => {
            console.log(error);
            message.error(`${error.message} ${error.error}`);
          })
          .finally(() => {
            setDownloadingFlag(false);
            downloadingFlagRef.current = false;
          });
      }
    });
  };

  const stopDownload = () => {
    setDownloadingFlag(false);
    gridDictionary.forEach((item) => {
      item.status = "";
    });
  };

  const makeProgressGrid = () => {
    const seriesNumberStart = Number(form.getFieldValue("seriesNumberStart"));
    const seriesNumberEnd = Number(form.getFieldValue("seriesNumberEnd"));
    const length = seriesNumberEnd - seriesNumberStart;
    setGridDictionary([]);
    gridDictionaryRef.current = [];
    for (let i = 0; i <= length; i++) {
      gridDictionaryRef.current.push({
        seriesNumber: seriesNumberStart + i,
        status: "", // success failed pending
      });
    }
    setGridDictionary(gridDictionaryRef.current);
  };

  const handleOk = () => {};

  const handleCancel = () => {
    form.resetFields();
    props.onClose();
  };

  const handleChangeSeriesNumberEnd = (value: string) => {
    form.setFieldValue("gridAmount", value);
    makeProgressGrid();
  };

  return (
    <Modal
      className="filedownloaderdialog_container"
      title="文件下载"
      closable={{ "aria-label": "Custom Close Button" }}
      open={props.dialogVisible}
      width={1000}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button
          key="save"
          onClick={handleSaveDownloadInfo}
          loading={savingFlag}
          disabled={savingFlag}
        >
          保存信息
        </Button>,
        <Button
          key="download"
          type="primary"
          disabled={downloadingFlag}
          loading={downloadingFlag}
          onClick={beginDownload}
        >
          开始下载
        </Button>,
        <Button
          key="stop"
          disabled={!downloadingFlag}
          onClick={stopDownload}
        >
          结束
        </Button>,
        <Button
          key="close"
          onClick={handleCancel}
        >
          关闭
        </Button>,
      ]}
    >
      <Form
        form={form}
        labelAlign="left"
        labelCol={{ flex: "100px" }}
        initialValues={{}}
      >
        <Row gutter={30}>
          <Col span="12">
            <Form.Item
              style={{
                display: "none",
              }}
              name="id"
            ></Form.Item>
            <Form.Item
              label="下载操作名称"
              name="name"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span="12">
            <Form.Item
              label="类型"
              name="type"
            >
              <Select
                value={type}
                onChange={(value) => {
                  setType(value);
                  form.setFieldValue("type", value);
                }}
                options={[
                  { value: "single", label: "单文件" },
                  { value: "multiple", label: "多文件" },
                ]}
              ></Select>
            </Form.Item>
          </Col>
        </Row>

        {type === "single" && (
          <Row gutter={30}>
            <Col span="12">
              <Form.Item
                label="文件路径"
                name="fileUrl"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item
                label="文件后缀"
                name="fileSuffix"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        )}

        {type === "multiple" && (
          <div>
            <Row gutter={30}>
              <Col span="24">
                <Form.Item
                  label="文件名左侧"
                  name="fileUrlLeftSide"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span="24">
                <Form.Item
                  label="文件名右侧"
                  name="fileUrlRightSide"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span="12">
                <Form.Item
                  label="序列号起始值"
                  name="seriesNumberStart"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span="12">
                <Form.Item
                  label="序列号结束值"
                  name="seriesNumberEnd"
                >
                  <Input
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const value = event.target.value;
                      handleChangeSeriesNumberEnd(value);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        )}

        <Row gutter={30}>
          <Col span="24">
            <Form.Item
              label="目标位置"
              name="destPath"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        {type === "multiple" && (
          <Row gutter={30}>
            <Col span="12">
              <Form.Item
                label="总格子数量"
                name="gridAmount"
              >
                {form.getFieldValue("seriesNumberEnd") - form.getFieldValue("seriesNumberStart")}
              </Form.Item>
            </Col>
          </Row>
        )}
        <div className="progressgrid">
          <ul>
            {gridDictionary.map((item, index) => (
              <li
                key={index}
                className={item.status}
              >
                {item.status === "failed" ? (
                  <Popover
                    placement="topLeft"
                    trigger="hover"
                  >
                    <div>{item.seriesNumber.toString()}</div>
                  </Popover>
                ) : (
                  <div></div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Form>
    </Modal>
  );
}
