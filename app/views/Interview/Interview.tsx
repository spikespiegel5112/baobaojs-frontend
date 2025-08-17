import { useEffect, useState } from "react";
import "./index.scss";

import { getInterviewListRequest } from "@/api/inteerview";

interface RecordType {
  id: number;
  key: string;
  content: string;
  title: string;
}
export default function Interview() {
  const [tableData, setTableData] = useState([
    {
      key: "1",
      title: "标题",
      content: "",
    },
    {
      key: "2",
      title: "操作",
      content: "",
    },
  ]);

  useEffect(() => {
    getData();
  }, []);

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

  const getData = () => {
    getInterviewListRequest({
      // title: "",
    })
      .then((response) => {
        // debugger
      })
      .catch((error) => {
        // debugger;
      });
  };

  const handleChangePagination = (page: number) => {};

  return (
    <div className={"interview_container"}>
      <Table
        dataSource={tableData}
        columns={columns}
        pagination={{
          onChange: handleChangePagination,
          hideOnSinglePage: false, // 👈 关键点
        }}
      />
    </div>
  );
}
