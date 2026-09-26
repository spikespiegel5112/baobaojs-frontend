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
import type { FormProps, GetProp, SwitchProps } from "antd";
import type { RootState } from "@/store";
import type { CategoryItem } from "@/views/Interview/EditCategoryDialog.tsx";

import { FormOutlined, LeftOutlined } from "@ant-design/icons";
import { createOrUpdateQARequest, getInterviewDetailRequest } from "@/api/inteerview";

import { useSelector } from "react-redux";
import dayjs from "@/utils/dayjs";
import utils from "@/utils/utils";

const MDEditor = lazy(() => import("@uiw/react-md-editor/nohighlight"));
const Markdown = lazy(() =>
  import("@uiw/react-md-editor/nohighlight").then((mod) => ({
    default: mod.default.Markdown,
  })),
);

export interface EditDialogRef {
  resetField: () => void;
}

type RecordType = {
  id: number | null;
  key?: number;
  content: string;
  title: string;
  category: number | null;
  isPublic: boolean | null;
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
  categoryList: CategoryItem[];
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
  Form.useWatch("content", form);

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
    setRecord(props.record);
    // console.log(props.record);

    // form.setFieldsValue(record);
  }, [props.record]);

  const rulesMap = {
    title: [{ required: true, message: "请输入标题" }],
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
        createOrUpdateQARequest({
          ...formData,
          category: !formData.category ? null : formData.category,
        })
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
              category: response.category,
              isPublic: response.isPublic,
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

  const handleChooseCategory = () => {};

  return (
    <div className={`edit_dialog ${props.dialogActive ? "active" : ""}`}>
      <Space
        orientation="vertical"
        size="middle"
        style={{ display: "flex" }}
      >
        <Flex
          gap="small"
          align="center"
          wrap
          className="navigator"
          style={{
            maxWidth: reviewActive ? "20rem" : "none",
            margin: "auto",
          }}
        >
          <Button
            onClick={() => {
              props.onGoBack();
            }}
          >
            <LeftOutlined />
          </Button>
          {(() => {
            const IsPublicTag = (
              <Tag
                key="isPublic"
                color={record?.isPublic ? "green" : "red"}
                variant="solid"
              >
                {record?.isPublic ? "公开" : "私有"}
              </Tag>
            );
            if (isLoggedIn) {
              if (reviewActive) {
                return (
                  <Space size="large">
                    <span>
                      {props.categoryList.find((item) => item.id === record?.category)?.category ||
                        ""}
                    </span>
                    {IsPublicTag}

                    <Tooltip
                      placement="bottom"
                      title="编辑"
                    >
                      <Button
                        onClick={() => {
                          setEditActive(true);
                          setReviewActive(false);
                          form.setFieldsValue(record);
                        }}
                      >
                        <FormOutlined />
                      </Button>
                    </Tooltip>
                  </Space>
                );
              }
            } else {
              return IsPublicTag;
            }
          })()}
        </Flex>

        {(() => {
          if (editActive) {
            return (
              <div className="content">
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
                  <div className="edit">
                    <Flex gap="middle">
                      <Flex flex={1}>
                        <Form.Item
                          style={{ width: "100%" }}
                          label={editActive ? "标题" : undefined}
                          name="title"
                          rules={rulesMap.title}
                        >
                          <Input></Input>
                        </Form.Item>
                      </Flex>
                      <Form.Item
                        label="类型"
                        name="category"
                      >
                        <Select
                          style={{ width: "3rem" }}
                          onChange={handleChooseCategory}
                          options={props.categoryList
                            .filter((item) => item.id !== "all")
                            .map((item) => {
                              return {
                                label: item.category,
                                value: item.id,
                              };
                            })}
                          allowClear
                        ></Select>
                      </Form.Item>
                      <Form.Item
                        label={editActive ? "是否公开" : undefined}
                        name="isPublic"
                      >
                        <Switch
                          checkedChildren="公开"
                          unCheckedChildren="私有"
                          styles={(info): GetProp<SwitchProps, "styles", "Return"> => {
                            const color = info.props.value ? "#52c41a" : "#f5222d";
                            return {
                              root: {
                                backgroundColor: color,
                              },
                            };
                          }}
                        />
                      </Form.Item>
                    </Flex>
                    <Row gutter={30}>
                      <Col span="24">
                        <Form.Item
                          label="内容"
                          name="content"
                        >
                          <Suspense fallback={<div>Loading...</div>}>
                            <MDEditor
                              data-color-mode="light"
                              height={"calc(100vh - 4.5rem)"}
                              value={form.getFieldValue("content")}
                              onChange={(value) => {
                                form.setFieldValue("content", value);
                              }}
                            />
                          </Suspense>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </Form>
                <Row justify="end">
                  <Col span="24">
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
              </div>
            );
          } else if (reviewActive) {
            const createdAt = form.getFieldValue("createdAt");
            return (
              <div className="review">
                <div className="title">
                  <div className="main">{record?.title}</div>
                  <span>{dayjs(createdAt).format("YYYY-MM-DD hh:mm:ss")}</span>
                </div>
                <div
                  style={{
                    padding: "0 0.4rem",
                  }}
                >
                  <Divider
                    style={{
                      margin: "0",
                    }}
                  />
                </div>

                <div className="content">
                  <Suspense fallback={<div>Loading...</div>}>
                    <Markdown
                      source={record?.content}
                      wrapperElement={{
                        "data-color-mode": "light",
                      }}
                    />
                  </Suspense>
                </div>
              </div>
            );
          }
        })()}
      </Space>
    </div>
  );
});
EditDialog.displayName = "EditDialog";
export default EditDialog;
