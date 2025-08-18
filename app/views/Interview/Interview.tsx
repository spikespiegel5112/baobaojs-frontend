import { useEffect, useState } from "react";
import "./index.scss";
import type { AxiosError } from "axios";
import type { FormProps } from "antd";
import type { TableProps } from "antd";

type TableRowSelection<T extends object = object> = TableProps<T>["rowSelection"];
import {
  getInterviewListRequest,
  createOrUpdateQAndARequest,
  deleteMultipleDataByIdRequest,
} from "@/api/inteerview";
import ReactMarkdown from "react-markdown";
import parse from "html-react-parser";

interface RecordType {
  id: number;
  key?: number;
  content: string;
  title: string;
}
interface TableDataType {
  key: React.Key;
  total: number;
  data: RecordType[];
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

export default function Interview() {
  const defaultPagination: PaginationType = {
    current: 1,
    pageSize: 20,
    total: undefined,
  };

  let _pagination = defaultPagination;

  const [editActive, setEditActive] = useState<boolean>(false);
  const [reviewActive, setReviewActive] = useState<boolean>(false);
  const [tableData, setTableData] = useState<RecordType[]>([]);
  const [pagination, setPagination] = useState<PaginationType>(defaultPagination);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [form] = Form.useForm();

  const rowSelection: TableRowSelection<TableDataType> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      onSelectChange(newSelectedRowKeys);
    },
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!editActive) {
      form.resetFields();
    }
  }, [editActive]);

  useEffect(() => {
    if (!reviewActive) {
      form.resetFields();
    }
  }, [reviewActive]);

  const columns = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      width: "4rem",
      render: (_, record: RecordType) => (
        <Space size="middle">
          <Button type="text" onClick={() => handleReview(record)}>
            查看
          </Button>
          <Button type="text" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="text" onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const rulesMap = {
    title: [{ required: true, message: "请输入邮箱" }],
    content: [{ required: true, message: "请输入密码" }],
  };

  const getData = () => {
    getInterviewListRequest({
      ..._pagination,
    })
      .then((response: TableDataType) => {
        setLoading(false);
        _pagination = {
          ..._pagination,
          total: response.total,
        };
        setPagination(_pagination);
        setTableData(
          response.data.map((item) => {
            return {
              ...item,
              key: item.id,
            };
          }),
        );
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleChangePagination = (current: number) => {
    _pagination = {
      ..._pagination,
      current,
    };
    setPagination(_pagination);
    getData();
  };

  const handleSubmitQA: FormProps<InterviewItem>["onFinish"] = () => {
    form
      .validateFields({ validateOnly: true })
      .then((formData) => {
        createOrUpdateQAndARequest(formData)
          .then(() => {
            $message.success("保存成功！");
            setEditActive(false);
            getData();
          })
          .catch((error: AxiosError) => {
            console.log(error);
          });
      })
      .catch((error: Error) => {
        console.log(error);
      });
  };

  const handleEdit = (record: RecordType) => {
    setEditActive(true);
    form.setFieldsValue(record);
  };

  const handleReview = (record: RecordType) => {
    setReviewActive(true);
    form.setFieldsValue(record);
  };

  const handleDelete = (record: RecordType) => {
    Modal.confirm({
      title: "提示",
      content: "你确定要删除吗？",
      okText: "确认",
      cancelText: "取消",
      onOk() {
        $message.success("已删除");
        // confirmDeltePromise([record.id]);
      },
      onCancel() {
        console.log("取消操作");
      },
    });
  };

  const confirmDeltePromise = (idList: number[]) => {
    return new Promise((resolve, reject) => {
      deleteMultipleDataByIdRequest({
        ids: idList,
      })
        .then((response: RecordType) => {
          getData();
          resolve(response);
        })
        .catch((error: AxiosError) => {
          console.log(error);
          reject(error);
        });
    });
  };

  return (
    <div className={`interview_container`}>
      <div className={`table ${!editActive && !reviewActive ? "active" : ""}`}>
        <Flex className="header" gap="middle" justify="end">
          <Button onClick={() => setEditActive(true)}>新建</Button>
        </Flex>
        <Table
          rowSelection={{ rowSelection }}
          dataSource={tableData}
          columns={columns}
          loading={loading}
          scroll={{
            y: "calc(100vh - 3rem)",
          }}
          pagination={{
            defaultCurrent: 1,
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handleChangePagination,
            hideOnSinglePage: false, // 👈 关键点
          }}
        />
      </div>

      <div className={`edit_dialog ${editActive || reviewActive ? "active" : ""}`}>
        <Space
          direction="vertical"
          size="middle"
          style={{
            display: "flex",
          }}
        >
          <Row justify="start">
            <Col span={2}></Col>
            <Col span={4}>
              <Row justify="start">
                <Button
                  onClick={() => {
                    setEditActive(false);
                    setReviewActive(false);
                  }}
                >
                  返回
                </Button>
              </Row>
            </Col>
          </Row>
          <Form form={form} layout="vertical" onFinish={handleSubmitQA} autoComplete="off">
            <Form.Item name="id" style={{ display: "none" }}>
              <Input type="hidden" />
            </Form.Item>
            <Row justify="center">
              <Col span={20}>
                <Form.Item
                  label="标题"
                  name="title"
                  wrapperCol={{ span: 24 }}
                  rules={rulesMap.title}
                >
                  <Input></Input>
                </Form.Item>
                {(() => {
                  if (editActive) {
                    return (
                      <Form.Item
                        label="内容"
                        name="content"
                        wrapperCol={{ span: 24 }}
                        rules={rulesMap.content}
                      >
                        <Input.TextArea rows={25}></Input.TextArea>
                      </Form.Item>
                    );
                  } else if (reviewActive) {
                    console.log(form);
                    const content = form.getFieldValue("content");
                    return (
                      <div className="review">
                        <ReactMarkdown>{content}</ReactMarkdown>;
                      </div>
                    );
                  }
                })()}
              </Col>
            </Row>
            <Row justify="end">
              <Col span={4}>
                <Row justify="end">
                  <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                      提交
                    </Button>
                  </Form.Item>
                </Row>
              </Col>
              <Col span={2}></Col>
            </Row>
          </Form>
        </Space>
      </div>
    </div>
  );
}
