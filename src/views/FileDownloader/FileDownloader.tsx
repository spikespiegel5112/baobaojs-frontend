import React, { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router";
import "./FileDownloader.scss";
import type { AxiosError } from "axios";
import type { TableProps } from "antd";
import type { RootState } from "@/store";
import { FormOutlined, DeleteOutlined } from "@ant-design/icons";
import { getFileDownloaderListRequest } from "@/api/fileDownloader";
import FileDownloaderDialog from "@/views/FileDownloader/FileDownloaderDialog";

import { useSelector } from "react-redux";

type TableRowSelection<T extends object = object> = TableProps<T>["rowSelection"];

interface TableDataType {
  data: FieldData[];
  total: number;
}

interface PaginationType {
  page: number;
  pageSize: number;
  total: number | undefined;
}

export interface FieldData {
  id: number;
  name: string;
  type: string;
  fileUrl: string;
  fileSuffix: string;
  destPath: string;
  fileUrlLeftSide: string;
  fileUrlRightSide: string;
  seriesNumberStart: number | null;
  seriesNumberEnd: number | null;
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

  let _pagination = defaultPagination;

  const [editActive, setEditActive] = useState<boolean>(false);
  const [reviewActive, setReviewActive] = useState<boolean>(false);

  const [dialogActive, setDialogActive] = useState<boolean>(false);
  const [formData, setFormData] = useState<FieldData | null>(null);
  const [tableData, setTableData] = useState<FieldData[]>([]);
  const [pagination, setPagination] = useState<PaginationType>(defaultPagination);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [form] = Form.useForm();

  const [searchParams, setSearchParams] = useSearchParams();

  const userInfo = useSelector((state: RootState) => state.userInfo);

  const rowSelection: TableRowSelection<TableDataType> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      handleSelectChange(newSelectedRowKeys);
    },
  };

  const columns = [
    {
      title: "下载操作名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "文件名左侧",
      dataIndex: "fileUrlLeftSide",
      key: "fileUrlLeftSide",
    },
    {
      title: "文件名右侧",
      dataIndex: "fileUrlRightSide",
      key: "fileUrlRightSide",
    },
    {
      title: "序列号起始值",
      dataIndex: "seriesNumberStart",
      key: "seriesNumberStart",
    },
    {
      title: "序列号结束值",
      dataIndex: "seriesNumberEnd",
      key: "seriesNumberEnd",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      render: (_, record: FieldData) => {
        <Space size="middle">
          <Button
            type="text"
            disabled={!isLoggedIn}
            onClick={() => handleEdit(record)}
          >
            <FormOutlined />
          </Button>
        </Space>;
      },
    },
    {
      title: "目标位置",
      dataIndex: "destPath",
      key: "destPath",
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      width: "3rem",
      render: (_, record: FieldData) => (
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

  const getDataPromise = () => {
    console.log("userInfo");
    console.log(userInfo);
    console.log(searchParams);
    setLoading(true);
    return new Promise<TableDataType>((resolve, reject) => {
      getFileDownloaderListRequest({
        page: pagination.page,
        pageSize: pagination.pageSize,
      })
        .then((response) => {
          const tableData: TableDataType = response.data;
          setTableData(tableData);
          setPagination({
            ...pagination,
            total: tableData.total,
          });
          setLoading(false);
          resolve(tableData);
        })
        .catch((error: AxiosError) => {
          console.log(error);
          reject(error);
        });
    });
  };

  const handleSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleChangePagination = (page: number) => {
    _pagination = {
      ...pagination,
      page,
    };
    setPagination(_pagination);
    getDataPromise();
  };

  const handleEdit = (record: FieldData) => {
    setEditActive(true);
    setDialogActive(true);
    setFormData(record);
  };

  const handleReview = (record: FieldData) => {
    setReviewActive(true);
    setDialogActive(true);
    form.setFieldsValue(record);
    setSearchParams({
      id: String(record.id),
    });
  };

  const handleDelete = (record: FieldData) => {
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
        .then((response: FieldData) => {
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
    <div className="filedownloader_container">
      <div className="table active">
        <Flex
          className="header"
          gap="middle"
          justify="end"
        >
          <Button
            type="primary"
            onClick={() => {
              setDialogActive(true);
            }}
          >
            文件下载
          </Button>
          <Button
            onClick={() => {
              setDialogActive(true);
              setEditActive(true);
            }}
          >
            批量删除
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
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handleChangePagination,
            hideOnSinglePage: false, // 👈 关键点
          }}
        />
        <FileDownloaderDialog
          dialogVisible={dialogActive}
          formData={formData}
          onClose={() => setDialogActive(false)}
          onSave={() => getDataPromise()}
        />
      </div>
    </div>
  );
}
