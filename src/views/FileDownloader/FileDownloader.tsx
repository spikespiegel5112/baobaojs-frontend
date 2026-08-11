import React, { lazy, Suspense, useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router";
import "./index.scss";
import type { AxiosError } from "axios";
import type { FormProps, TableProps } from "antd";
import type { RootState } from "@/store";
import { FormOutlined, DeleteOutlined, FileAddOutlined, LeftOutlined } from "@ant-design/icons";
import {} from "@/api/fileDownloader";
import dayjs from "@/utils/dayjs";

import { useSelector } from "react-redux";

const ReactMarkdown = lazy(() => import("react-markdown"));

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
  const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const defaultPagination: PaginationType = {
    current: 1,
    pageSize: 20,
    total: undefined,
  };

  let _pagination = defaultPagination;

  const [editActive, setEditActive] = useState<boolean>(false);
  const [reviewActive, setReviewActive] = useState<boolean>(false);

  const [dialogActive, setDialogActive] = useState<boolean>(false);
  const [tableData, setTableData] = useState<RecordType[]>([]);
  const [pagination, setPagination] = useState<PaginationType>(defaultPagination);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [form] = Form.useForm();

  const [searchParams, setSearchParams] = useSearchParams();

  const userInfo = useSelector((state: RootState) => state.userInfo);

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
      title: "文件名左侧",
      dataIndex: "fileUrlLeftSide",
      key: "fileUrlLeftSide",
    },
    {
      title: "文件名右侧",
      dataIndex: "fileUrlRightSide",
      key: "fileUrlRightSide",
      width: "3.6rem",
    },
    {
      title: "序列号起始值",
      dataIndex: "seriesNumberStart",
      key: "seriesNumberStart",
      width: "3.6rem",
    },
    {
      title: "序列号结束值",
      dataIndex: "seriesNumberEnd",
      key: "seriesNumberEnd",
      width: "3.6rem",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: "3.6rem",
    },
    {
      title: "目标位置",
      dataIndex: "destPath",
      key: "destPath",
      width: "3.6rem",
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      width: "3rem",
      render: (_, record: RecordType) => (
        <Space size="middle">
          <Button type="text" disabled={!isLoggedIn} onClick={() => handleEdit(record)}>
            <FormOutlined />
          </Button>
          <Button type="text" disabled={!isLoggedIn} onClick={() => handleDelete(record)}>
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  const getDataPromise = () => {
    console.log("userInfo");
    console.log(userInfo);
    return new Promise<TableDataType>((resolve, reject) => {});
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleChangePagination = (current: number) => {
    _pagination = {
      ...pagination,
      current,
    };
    setPagination(_pagination);
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
        <Flex className="header" gap="middle" justify="end">
          <Button
            onClick={() => {
              setDialogActive(true);
              setEditActive(true);
            }}
          >
            <FileAddOutlined />
          </Button>
        </Flex>
        <Table
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
    </div>
  );
}
