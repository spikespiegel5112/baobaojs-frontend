import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useLocation } from "react-router";
import "./Interview.scss";
import EditDialog from "./EditDialog";
import type { AxiosError } from "axios";
import type { TableProps } from "antd";
import type { RootState } from "@/store";
import { FormOutlined, DeleteOutlined, FileAddOutlined } from "@ant-design/icons";
import { getInterviewListRequest, deleteMultipleDataByIdRequest } from "@/api/inteerview";
import dayjs from "@/utils/dayjs";
import utils from "@/utils/utils.ts";

import { useSelector } from "react-redux";

import type { PaginationType } from "@/views/BaobaoLayout/BaobaoLayout.tsx";

type TableRowSelection<T extends object = object> = TableProps<T>["rowSelection"];

interface RecordType {
  id: number;
  key?: number;
  content: string;
  title: string;
  createdAt: string;
}
interface TableDataType {
  key: React.Key;
  total: number;
  data: RecordType[];
}

export default function Interview() {
  const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const defaultPagination: PaginationType = {
    page: 1,
    pageSize: 20,
    total: undefined,
  };

  const paginationRef = useRef(defaultPagination);
  const searchKeyword = useRef<string>("");

  const [editActive, setEditActive] = useState<boolean>(false);
  const [reviewActive, setReviewActive] = useState<boolean>(false);

  const [dialogActive, setDialogActive] = useState<boolean>(false);
  const [tableData, setTableData] = useState<RecordType[]>([]);
  const [pagination, setPagination] = useState<PaginationType>(defaultPagination);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [form] = Form.useForm();

  const [searchParams, setSearchParams] = useSearchParams();

  const rowSelection: TableRowSelection<TableDataType> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      onSelectChange(newSelectedRowKeys);
    },
  };

  useEffect(() => {
    getDataPromise()
      .then((response: TableDataType) => {
        const id = query.get("id");
        if (id) {
          const foundItem = response.data.find((item) => item.id === Number(id));
          if (foundItem) {
            handleReview(foundItem);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
      render: (_, record: RecordType) => (
        <Button
          className="title"
          type="link"
          size="large"
          onClick={() => handleReview(record)}
        >
          {record.title}
        </Button>
      ),
    },
    {
      title: "创建日期",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "3.6rem",
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      width: "3rem",
      render: (_, record: RecordType) => (
        <Space size="middle">
          <Button
            type="text"
            disabled={!isLoggedIn}
            onClick={() => handleEdit(record)}
          >
            <FormOutlined />
          </Button>
          <Button
            type="text"
            disabled={!isLoggedIn}
            onClick={() => handleDelete(record)}
          >
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  const handleSearchArticle: (
    value: string,
    event: React.ChangeEvent<HTMLButtonElement>,
  ) => void = (values, event) => {
    console.log(event);
    setLoading(true);
    searchKeyword.current = values;
    getDataPromise();
  };

  const getDataPromise = () => {
    return new Promise<TableDataType>((resolve, reject) => {
      getInterviewListRequest({
        title: searchKeyword.current,
        ...paginationRef.current,
      })
        .then((response: TableDataType) => {
          setLoading(false);
          paginationRef.current = {
            ...paginationRef.current,
            total: response.total,
          };
          setPagination(paginationRef.current);
          setTableData(
            response.data.map((item) => {
              return {
                ...item,
                key: item.id,
                createdAt: dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
              };
            }),
          );
          resolve(response);
        })
        .catch((error: AxiosError) => {
          console.log(error);
          reject(error);
        });
    });
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleChangePagination = (current: number) => {
    paginationRef.current = {
      ...paginationRef.current,
      current,
    };
    setPagination(paginationRef.current);
    getDataPromise();
  };

  const handleEdit = (record: RecordType) => {
    setEditActive(true);
    setDialogActive(true);
    form.setFieldsValue(record);
  };

  const handleReview = (record: RecordType) => {
    setReviewActive(true);
    setDialogActive(true);
    form.setFieldsValue(record);
    setSearchParams({
      id: String(record.id),
    });
  };

  const handleDelete = (record: RecordType) => {
    Modal.confirm({
      title: "提示",
      content: "你确定要删除吗？",
      okText: "确认",
      cancelText: "取消",
      onOk() {
        $message.success("已删除");
        confirmDeletePromise([record.id]);
      },
      onCancel() {
        console.log("取消操作");
      },
    });
  };

  const confirmDeletePromise = (idList: number[]) => {
    return new Promise((resolve, reject) => {
      deleteMultipleDataByIdRequest({
        ids: idList,
      })
        .then((response: RecordType) => {
          getDataPromise();
          resolve(response);
        })
        .catch((error: AxiosError) => {
          console.log(error);
          reject(error);
        });
    });
  };

  return (
    <div className="interview_container">
      <div className={`table ${!dialogActive ? "active" : ""}`}>
        <Form
          form={form}
          component={false}
          autoComplete="off"
        >
          <Row
            className="header"
            justify="end"
          >
            <Col span={8}>
              <Flex
                gap="middle"
                justify="end"
              >
                <Form.Item id="search">
                  <Input.Search
                    placeholder="input search text"
                    allowClear
                    disabled={loading}
                    onSearch={(value: string, event: React.ChangeEvent<HTMLButtonElement>) =>
                      handleSearchArticle(value, event)
                    }
                  />
                </Form.Item>
                <Button disabled={!isLoggedIn}>
                  <FileAddOutlined />
                </Button>
              </Flex>
            </Col>
          </Row>
        </Form>
        <Table
          className={utils.$checkIsMobile() ? "mobile" : ""}
          rowSelection={{ ...rowSelection }}
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
      <EditDialog
        dialogActive={dialogActive}
        editActive={editActive}
        reviewActive={reviewActive}
        record={form.getFieldValue()}
        onGoBack={() => {
          const params = new URLSearchParams(searchParams);
          params.delete("id");
          setSearchParams(params);
          getDataPromise();
          setDialogActive(false);
          setTimeout(() => {
            setEditActive(false);
            setReviewActive(false);
          }, 500);
        }}
      />
    </div>
  );
}
