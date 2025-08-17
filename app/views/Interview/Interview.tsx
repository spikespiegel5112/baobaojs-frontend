import { useEffect, useState } from "react";
import "./index.scss";
export default function Interview() {
  const [tableData, setTableData] = useState([
    {
      key: "1",
      title: "标题",
    },
    {
      key: "2",
      title: "操作",
    },
  ]);
  useEffect(() => {}, []);

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
    },
  ];

  const getData = () => {};

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
