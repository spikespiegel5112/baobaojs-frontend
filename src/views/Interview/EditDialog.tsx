import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import "./Interview.scss";
import type { AxiosError } from "axios";
import type { FormProps } from "antd";
import type { RootState } from "@/store";
import { FormOutlined, LeftOutlined } from "@ant-design/icons";
import { createOrUpdateQARequest } from "@/api/inteerview";

import { useSelector } from "react-redux";
import dayjs from "@/utils/dayjs";
import utils from "@/utils/utils";

const ReactMarkdown = lazy(() => import("react-markdown"));

export interface EditDialogRef {
  resetField: () => void;
}

interface RecordType {
  id: number;
  key?: number;
  content: string;
  title: string;
  createdAt: string;
}

interface InterviewItem {
  id?: number;
  key?: string;
  content: string;
  title: string;
}

interface Props {
  dialogActive: boolean;
  editActive?: boolean;
  addActive?: boolean;
  reviewActive?: boolean;
  record?: RecordType;
  onGoBack: () => void;
}

const EditDialog = forwardRef<EditDialogRef, Props>((props, ref) => {
  useImperativeHandle(ref, () => ({
    resetField,
  }));

  const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);

  const [record, setRecord] = useState<RecordType>();
  const [editActive, setEditActive] = useState<boolean>(false);
  const [reviewActive, setReviewActive] = useState<boolean>(true);

  const [form] = Form.useForm();

  useEffect(() => {}, []);

  useEffect(() => {
    if (props.editActive) {
      debugger;
      setEditActive(true);
      setReviewActive(false);
      setRecord(props.record);
    }
  }, [props.editActive]);

  useEffect(() => {
    if (props.addActive) {
      setEditActive(true);
      setReviewActive(false);
      form.resetFields();
    }
  }, [props.addActive]);

  useEffect(() => {
    if (props.reviewActive) {
      setReviewActive(true);
      setEditActive(false);
      setRecord(props.record);
    }
  }, [props.reviewActive]);

  useEffect(() => {
    setRecord(props.record);
    console.log(props.record);
  }, [props.record]);

  const rulesMap = {
    title: [{ required: true, message: "请输入邮箱" }],
    content: [{ required: true, message: "请输入密码" }],
  };

  const resetField = () => {
    const formData = form.getFieldsValue();
    console.log(formData);
    form.resetFields();
  };

  const handleSubmitQA: FormProps<InterviewItem>["onFinish"] = () => {
    form
      .validateFields({ validateOnly: true })
      .then((formData) => {
        createOrUpdateQARequest(formData)
          .then(() => {
            utils.$message.success("保存成功！");
            setEditActive(false);
            setReviewActive(true);
            // props.onGoBack();
          })
          .catch((error: AxiosError) => {
            console.log(error);
            error.message;
          });
      })
      .catch((error: Error) => {
        console.log(error);
      });
  };

  return (
    <div className={`edit_dialog ${props.dialogActive ? "active" : ""}`}>
      <Space
        direction="vertical"
        size="middle"
        style={{
          display: "flex",
        }}
      >
        <div className="navigator">
          <Button
            onClick={() => {
              props.onGoBack();
            }}
          >
            <LeftOutlined />
          </Button>
          {(() => {
            if (isLoggedIn) {
              if (reviewActive) {
                return (
                  <Button
                    onClick={() => {
                      setEditActive(true);
                      setReviewActive(false);
                      form.setFieldsValue(record);
                    }}
                  >
                    <FormOutlined />
                  </Button>
                );
              }
            }
          })()}
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitQA}
          autoComplete="off"
        >
          <Form.Item
            name="id"
            style={{ display: "none" }}
          >
            <Input type="hidden" />
          </Form.Item>
          <div className="content">
            {(() => {
              if (editActive) {
                return (
                  <div className="edit">
                    <Form.Item
                      label={editActive ? "标题" : undefined}
                      name="title"
                      wrapperCol={{ span: 24 }}
                      rules={rulesMap.title}
                    >
                      <Input></Input>
                    </Form.Item>
                    <Form.Item
                      label="内容"
                      name="content"
                      wrapperCol={{ span: 24 }}
                      rules={rulesMap.content}
                    >
                      <Input.TextArea
                        style={{
                          height: "calc(100vh - 4.5rem)",
                        }}
                      ></Input.TextArea>
                    </Form.Item>
                  </div>
                );
              } else {
                const createdAt = form.getFieldValue("createdAt");
                return (
                  <div className="review">
                    <div className="title">
                      <div className="main">{props.record?.title}</div>
                      <span>{dayjs(createdAt).format("YYYY-MM-DD hh:mm:ss")}</span>
                    </div>
                    <Divider
                      style={{
                        margin: 0,
                      }}
                    />
                    <div className="content">
                      <Suspense fallback={<div>Loading...</div>}>
                        <ReactMarkdown>{props.record?.content}</ReactMarkdown>
                      </Suspense>
                    </div>
                  </div>
                );
              }
            })()}
          </div>
          {editActive && (
            <Row justify="end">
              <Col span={3}>
                <Space
                  size="middle"
                  align="end"
                >
                  <Button
                    onClick={() => {
                      setEditActive(false);
                      setReviewActive(true);
                      props.onGoBack();
                    }}
                  >
                    取消
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                  >
                    提交
                  </Button>
                </Space>
              </Col>
            </Row>
          )}
        </Form>
      </Space>
    </div>
  );
});

export default EditDialog;
