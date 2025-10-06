import React, { lazy, Suspense, useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router";
import "./index.scss";
import type { AxiosError } from "axios";
import type { FormProps, TableProps } from "antd";
import type { RootState } from "@/store";
import { FormOutlined, DeleteOutlined, FileAddOutlined, LeftOutlined } from "@ant-design/icons";
import {
  getInterviewListRequest,
  createOrUpdateQARequest,
  deleteMultipleDataByIdRequest,
} from "@/api/inteerview";

import { useSelector } from "react-redux";
import dayjs from "@/utils/dayjs";

const ReactMarkdown = lazy(() => import("react-markdown"));

type TableRowSelection<T extends object = object> = TableProps<T>["rowSelection"];

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

interface PaginationType {
  current: number;
  pageSize: number;
  total: number | undefined;
}

interface Props {
  dialogActive: boolean;
  editActive?: boolean;
  reviewActive?: boolean;
  record?: any;
  onGoBack: () => void;
}

export default function EditDialog(props: Props) {
  const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);

  const defaultPagination: PaginationType = {
    current: 1,
    pageSize: 20,
    total: undefined,
  };

  let _pagination = defaultPagination;

  const [tableData, setTableData] = useState<RecordType[]>([]);
  const [record, setRecord] = useState<RecordType[]>([]);
  const [editActive, setEditActive] = useState<boolean>(false);
  const [reviewActive, setReviewActive] = useState<boolean>(true);

  const [pagination, setPagination] = useState<PaginationType>(defaultPagination);
  const [loading, setLoading] = useState<boolean>(true);

  const [form] = Form.useForm();

  const [searchParams, setSearchParams] = useSearchParams();

  const userInfo = useSelector((state: RootState) => state.userInfo);

  useEffect(() => {}, []);

  useEffect(() => {
    if (!props.editActive) {
      form.resetFields();
    } else {
      setEditActive(true);
      setReviewActive(false);
      form.setFieldsValue(props.record);
      setRecord(props.record);
    }
  }, [props.editActive]);

  useEffect(() => {
    if (!props.reviewActive) {
      form.resetFields();
    }
  }, [props.reviewActive]);

  useEffect(() => {
    console.log(props.record);
    setRecord(props.record);
  }, [props.record]);

  const rulesMap = {
    title: [{ required: true, message: "请输入邮箱" }],
    content: [{ required: true, message: "请输入密码" }],
  };

  const handleSubmitQA: FormProps<InterviewItem>["onFinish"] = () => {
    form
      .validateFields({ validateOnly: true })
      .then((formData) => {
        createOrUpdateQARequest(formData)
          .then(() => {
            $message.success("保存成功！");
            setEditActive(false);
            setReviewActive(true);
            setSearchParams({});
            props.onGoBack();
          })
          .catch((error: AxiosError) => {
            console.log(error);
            $message.error(error.message);
          });
      })
      .catch((error: Error) => {
        console.log(error);
      });
  };

  const handleEdit = (record: RecordType) => {
    form.setFieldsValue(record);
  };

  const handleReview = (record: RecordType) => {
    form.setFieldsValue(record);
    setSearchParams({
      id: String(record.id),
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
              setSearchParams({});
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
        <Form form={form} layout="vertical" onFinish={handleSubmitQA} autoComplete="off">
          <Form.Item name="id" style={{ display: "none" }}>
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
                const title = form.getFieldValue("title");
                const createdAt = form.getFieldValue("createdAt");
                const content = form.getFieldValue("content");
                return (
                  <div className="review">
                    <div className="title">
                      <div className="main">{props.record.title}</div>
                      <span>{dayjs(createdAt).format("YYYY-MM-DD hh:mm:ss")}</span>
                    </div>
                    <Divider
                      style={{
                        margin: 0,
                      }}
                    />
                    <div className="content">
                      <Suspense fallback={<div>Loading...</div>}>
                        <ReactMarkdown>{props.record.content}</ReactMarkdown>
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
                <Space size="middle" align="end">
                  <Button
                    onClick={() => {
                      setEditActive(false);
                      setReviewActive(true);
                      setSearchParams({});
                      props.onGoBack();
                    }}
                  >
                    取消
                  </Button>
                  <Button type="primary" htmlType="submit">
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
}
