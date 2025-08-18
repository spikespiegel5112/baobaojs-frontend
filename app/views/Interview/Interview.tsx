import { useEffect, useState } from "react";
import "./index.scss";
import type { AxiosError } from "axios";
import type { FormProps } from "antd";
import { getInterviewListRequest, createQAndARequest } from "@/api/inteerview";

interface RecordType {
  id: number;
  key?: number;
  content: string;
  title: string;
}
interface TableDataType {
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
  total: number | null;
}
export default function Interview() {
  const defaultPagination: PaginationType = {
    current: 1,
    pageSize: 20,
    total: null,
  };

  const [editActive, setEditActive] = useState<boolean>(false);
  const [tableData, setTableData] = useState<RecordType[]>([]);
  const [pagination, setPagination] =
    useState<PaginationType>(defaultPagination);
  const [loading, setLoading] = useState<boolean>(true);

  const [form] = Form.useForm();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!editActive) {
      form.resetFields();
    }
  }, [editActive]);

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
      width: "2rem",
      render: (_, record: RecordType) => (
        <Space size="middle">
          <Button type="text">编辑</Button>
          <Button type="text">删除</Button>
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
      ...pagination,
    })
      .then((response: TableDataType) => {
        setLoading(false);
        setPagination({
          ...pagination,
          total: response.total,
        });
        setTableData(
          response.data.map((item) => {
            return {
              ...item,
              key: item.id,
            };
          })
        );
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  const handleChangePagination = (current: number) => {
    setPagination({
      ...pagination,
      current,
    });
    getData();
  };

  const handleSubmitQA: FormProps<InterviewItem>["onFinish"] = (values) => {
    form
      .validateFields({ validateOnly: true })
      .then((formData) => {
        createQAndARequest(formData)
          .then((response: RecordType) => {
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

  return (
    <div className={`interview_container`}>
      <div className={`table ${!editActive ? "active" : ""}`}>
        <Flex className="header" gap="middle" justify="end">
          <Button onClick={() => setEditActive(true)}>新建</Button>
        </Flex>
        <Table
          dataSource={tableData}
          columns={columns}
          loading={loading}
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

      <div className={`edit_dialog ${editActive ? "active" : ""}`}>
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
                <Button onClick={() => setEditActive(false)}>返回</Button>
              </Row>
            </Col>
          </Row>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmitQA}
            autoComplete="off"
          >
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
                <Form.Item
                  label="内容"
                  name="content"
                  wrapperCol={{ span: 24 }}
                  rules={rulesMap.content}
                >
                  <Input.TextArea rows={25}></Input.TextArea>
                </Form.Item>
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
