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
import { createOrUpdateQARequest, getInterviewDetailRequest } from "@/api/inteerview";

import { useSelector } from "react-redux";
import dayjs from "@/utils/dayjs";
import utils from "@/utils/utils";

const ReactMarkdown = lazy(() => import("react-markdown"));

export interface EditDialogRef {
  resetField: () => void;
}

type RecordType = {
  id: number | null;
  key?: number;
  content: string;
  title: string;
};

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
  const [submitting, setSubmitting] = useState<boolean>(false);

  const currentIdRef = useRef<number | undefined>(null);

  const [form] = Form.useForm();

  useEffect(() => {}, []);

  useEffect(() => {
    if (props.editActive) {
      setEditActive(true);
      setReviewActive(false);
      form.setFieldsValue(props.record);
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
    }
  }, [props.reviewActive]);

  useEffect(() => {
    console.log("=====record=====");
    console.log(record);
    setRecord(props.record);
    // form.setFieldsValue(record);
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
        setSubmitting(true);
        createOrUpdateQARequest(formData)
          .then((response: RecordType) => {
            console.log(response);
            utils.$message.success("保存成功！");
            setEditActive(false);
            setReviewActive(true);
            currentIdRef.current = response.id;
            const currentUrl =
              location.href.split("?")[0] +
              utils.$objectToUrlString({
                id: response.id,
              });
            console.log(currentUrl);
            getDataById();
            setRecord({
              id: response.id,
              content: response.content,
              title: response.title,
            });
          })
          .catch((error: AxiosError) => {
            console.log(error);
          })
          .finally(() => {
            setSubmitting(false);
          });
      })
      .catch((error: Error) => {
        console.log(error);
      });
  };

  const getDataById = () => {
    getInterviewDetailRequest({
      id: currentIdRef.current,
    })
      .then((response) => {
        console.log(response);

        setRecord({
          id: response.data.id,
          content: response.data.content,
          title: response.data.title,
          createdAt: response.data.createdAt,
        });
      })
      .catch((error: AxiosError) => {
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
                      <div className="main">{record?.title}</div>
                      <span>{dayjs(createdAt).format("YYYY-MM-DD hh:mm:ss")}</span>
                    </div>
                    <Divider
                      style={{
                        margin: 0,
                      }}
                    />
                    <div className="content">
                      <Suspense fallback={<div>Loading...</div>}>
                        <ReactMarkdown>{record?.content}</ReactMarkdown>
                      </Suspense>
                    </div>
                  </div>
                );
              }
            })()}

            {editActive && (
              <Row justify="end">
                <Col span={24}>
                  <Flex
                    gap="middle"
                    justify="end"
                  >
                    <Button
                      disabled={submitting}
                      onClick={() => {
                        setEditActive(false);
                        setReviewActive(true);
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={submitting}
                    >
                      提交
                    </Button>
                  </Flex>
                </Col>
              </Row>
            )}
          </div>
        </Form>
      </Space>
    </div>
  );
});
EditDialog.displayName = "EditDialog";
export default EditDialog;
