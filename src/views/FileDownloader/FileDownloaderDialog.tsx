import React, { useEffect, useState, useRef } from "react";
import "./FileDownloader.scss";
import { Select, Popover, InputNumber } from "antd";
import { getSingleFileRequest, createOrUpdateRequest } from "@/api/fileDownloader";

import type { FieldData } from "@/views/FileDownloader/FileDownloader";

interface Props {
  dialogVisible: boolean;
  formData: FieldData | null;
  onClose: () => void;
  onSave: () => void;
}

export default function FileDownloaderDialog(props: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(props.formData);
    setType(form.getFieldValue("type"));
  }, [props]);

  const [type, setType] = useState<string>("");

  const [gridDictionary, setGridDictionary] = useState<{ seriesNumber: number; status: string }[]>(
    [],
  );

  const gridDictionaryRef = useRef<{ seriesNumber: number; status: string }[]>([]);

  const [downloadingFlag, setDownloadingFlag] = useState<boolean>(false);
  const [savingFlag, setSavingFlag] = useState<boolean>(false);

  const handleSaveDownloadInfo = () => {
    setSavingFlag(true);
    form.validateFields().then(() => {
      const params = form.getFieldsValue();
      createOrUpdateRequest(params)
        .then(async (response) => {
          console.log(response);
          $message.success("提交成功");
          props.onSave();
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
          }
          if (!downloadingFlag) {
            return;
          }
          let currentGridIndex = 0;
          gridDictionary.forEach((item, index) => {
            if (item.seriesNumber === count + seriesNumberStart) {
              currentGridIndex = index;
            }
          });
          console.log("currentGridIndex+++", currentGridIndex);
          if (count <= times) {
            gridDictionary[currentGridIndex].status = "pending";

            const filledUpCount = (prefixLength + (count + seriesNumberStart)).slice(-3);

            getSingleFileRequest({
              type: form.getFieldValue("type"),
              fileUrl:
                form.getFieldValue("fileUrlLeftSide") +
                filledUpCount +
                form.getFieldValue("fileUrlRightSide"),
              destPath: form.getFieldValue("destPath"),
            })
              .then(async (response) => {
                console.log(response);
                gridDictionary[currentGridIndex].status = "success";

                if (count < times) {
                  loop();
                } else {
                  setDownloadingFlag(false);
                  $message.success("下载流程结束");
                }
              })
              .catch((error) => {
                $message.error("下载失败");
                if (downloadingFlag) {
                  gridDictionary[currentGridIndex].status = "failed";
                }

                if (count < times) {
                  loop();
                } else {
                  setDownloadingFlag(false);
                  $message.success("下载流程结束");
                }
                console.log(error);
              });
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
        console.log(params);
        getSingleFileRequest(params)
          .then(async (response) => {
            console.log(response);
            $message.success("下载成功");
          })
          .catch((error) => {
            console.log(error);
            $message.error(`${error.message} ${error.error}`);
          })
          .finally(() => {
            setDownloadingFlag(false);
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

    console.log(length);
    console.log(form.getFieldValue("seriesNumberStart"));
    console.log(form.getFieldValue("seriesNumberEnd"));
  };

  const handleOk = () => {};

  const handleCancel = () => {
    props.onClose();
  };

  const handleCloseRecordPeriod = () => {
    form.resetFields();
    form.setFieldsValue({
      expireDate: null,
      periodHistoryData: [],
      page: 1,
      dialogFormVisible2: false,
    });
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
          onClick={handleCloseRecordPeriod}
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
              <Input></Input>
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
                <Input></Input>
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item
                label="文件后缀"
                name="fileSuffix"
              >
                <Input></Input>
              </Form.Item>
            </Col>
          </Row>
        )}

        {type === "multiple" && (
          <div>
            <Row gutter={30}>
              <Col span="12">
                <Form.Item
                  label="序列号起始值"
                  name="fileUrlLeftSide"
                >
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col span="12">
                <Form.Item
                  label="序列号结束值"
                  name="fileUrlRightSide"
                >
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span="6">
                <Form.Item
                  label="起始数字"
                  name="seriesNumberStart"
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span="6">
                <Form.Item
                  label="结束数字"
                  name="seriesNumberEnd"
                >
                  <InputNumber />
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
              <Input></Input>
            </Form.Item>
          </Col>
        </Row>

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
