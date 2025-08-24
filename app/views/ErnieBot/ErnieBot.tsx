import React, { lazy, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import "./index.scss";
import type { FormProps, TableProps } from "antd";

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

export default function ErnieBot() {
  const defaultPagination: PaginationType = {
    current: 1,
    pageSize: 20,
    total: undefined,
  };

  let _pagination = defaultPagination;

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [form] = Form.useForm();

  const [searchParams, setSearchParams] = useSearchParams();

  const rowSelection: TableRowSelection<TableDataType> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {},
  };

  useEffect(() => {}, []);

  const rulesMap = {
    title: [{ required: true, message: "请输入邮箱" }],
    content: [{ required: true, message: "请输入密码" }],
  };

  return (
    <div className="erniebot_container">
      <iframe src="https://baobaojs.com/chat" frameborder="0"></iframe>
    </div>
  );
}
