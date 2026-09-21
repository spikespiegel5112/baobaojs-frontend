import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useLocation } from "react-router";
import { App } from "antd";
import "./Interview.scss";
import EditDialog from "./EditDialog";
import EditCategoryDialog from "./EditCategoryDialog";
import type { EditDialogRef } from "./EditDialog";
import type { TableProps } from "antd";
import type { RootState } from "@/store";
import type { AxiosError, AxiosResponse } from "axios";

import { FormOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getInterviewListRequest,
  deleteMultipleDataByIdRequest,
  getCategoryListRequest,
} from "@/api/inteerview";
import dayjs from "@/utils/dayjs";
import utils from "@/utils/utils";

import { useSelector } from "react-redux";

import type { PaginationType } from "@/views/BaobaoLayout/BaobaoLayout.tsx";
import type { CategoryItem } from "@/views/Interview/EditCategoryDialog.tsx";

type TableRowSelection<T extends object = object> = TableProps<T>["rowSelection"];

interface RecordType {
  id: number;
  key?: number;
  content: string | null;
  category: string;
  title: string;
  createdAt: string;
  isPublic?: boolean | null;
}
interface TableDataType {
  key?: React.Key;
  total: number;
  data: RecordType[];
}

export default function Interview() {
  const { modal } = App.useApp();
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
  const editDialogRef = useRef<EditDialogRef>(null);
  const isPublicRef = useRef<boolean>(null);
  const categoryRef = useRef<string>("");

  const [editActive, setEditActive] = useState<boolean>(false);
  const [addActive, setAddActive] = useState<boolean>(false);
  const [reviewActive, setReviewActive] = useState<boolean>(false);

  const [dialogActive, setDialogActive] = useState<boolean>(false);
  const [tableData, setTableData] = useState<RecordType[]>([]);

  const [record, setRecord] = useState<RecordType>();
  const [pagination, setPagination] = useState<PaginationType>(defaultPagination);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [editCategoryDialogVisible, setEditCategoryDialogVisible] = useState<boolean>(false);

  const [categoryList, setCategoryList] = useState<CategoryItem[]>([]);
  const [categoryListLoading, setCategoryListLoading] = useState<boolean>(true);

  const [form] = Form.useForm();

  const [searchParams, setSearchParams] = useSearchParams();

  const rowSelection: TableRowSelection<RecordType> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      handleSelectChange(newSelectedRowKeys);
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
    getCategoryList();
  }, []);

  useEffect(() => {
    if (!editActive) {
      form.resetFields();
    }
  }, [editActive]);

  useEffect(() => {
    if (addActive) {
      form.resetFields();
    }
  }, [addActive]);

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
      render: (_: unknown, record: RecordType) => (
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
      title: "类别",
      dataIndex: "category",
      key: "category",
      width: "2rem",
      treeFilter: "menu",
      align: "center",
      render: (_: unknown, record: RecordType) => (
        <div
          style={{
            width: "100%",
            textAlign: "center",
          }}
        >
          {categoryList.find((item) => item.id === record?.category)?.category || "-"}
        </div>
      ),
    },
    {
      title: "公开状态",
      dataIndex: "isPublic",
      key: "isPublic",
      width: "2rem",
      treeFilter: "menu",
      align: "center",
      render: (_: unknown, record: RecordType) => (
        <Tag
          key="isPublic"
          color={record?.isPublic ? "green" : "red"}
          variant="solid"
        >
          {record?.isPublic ? "公开" : "私有"}
        </Tag>
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
      render: (_: unknown, record: RecordType) => (
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
    event: React.ChangeEvent<HTMLInputElement, Element>,
  ) => void = (values, event) => {
    console.log(event);
    setLoading(true);
    searchKeyword.current = values;
    getDataPromise();
  };

  const handleChooseIsPublic = (value) => {
    if (value === "isPublic") {
      isPublicRef.current = true;
    } else if (value === "isPrivate") {
      isPublicRef.current = false;
    } else {
      isPublicRef.current = null;
    }

    getDataPromise();
  };

  const handleChooseCategory = (value: string) => {
    categoryRef.current = value;
    getDataPromise();
  };

  const getDataPromise = () => {
    return new Promise<TableDataType>((resolve, reject) => {
      setLoading(true);
      console.log(form.getFieldValue("category"));
      getInterviewListRequest({
        title: searchKeyword.current,
        isPublic: isPublicRef.current,
        category: form.getFieldValue("category"),
        ...paginationRef.current,
      })
        .then((response: TableDataType) => {
          const tableData = response;
          paginationRef.current = {
            ...paginationRef.current,
            total: tableData.total,
          };
          setPagination(paginationRef.current);
          setTableData(
            tableData.data.map((item) => {
              return {
                ...item,
                key: item.id,
                createdAt: dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
              };
            }),
          );
          resolve(tableData);
        })
        .catch((error: AxiosError) => {
          console.log(error);
          reject(error);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const handleSelectChange = (newSelectedRowKeys: number[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleChangePagination = (page: number) => {
    paginationRef.current = {
      ...paginationRef.current,
      page,
    };
    setPagination(paginationRef.current);
    getDataPromise();
  };

  const handleAdd = () => {
    setAddActive(true);
    setDialogActive(true);
    editDialogRef.current?.resetField();
  };

  const handleEdit = (record: RecordType) => {
    setEditActive(true);
    setDialogActive(true);
    setRecord(record);
  };

  const handleReview = (record: RecordType) => {
    setReviewActive(true);
    setDialogActive(true);
    setRecord(record);
    console.log(form.getFieldsValue());

    setSearchParams({
      id: String(record.id),
    });
  };

  const handleMultipleDelete = () => {
    const idList: number[] = selectedRowKeys;
    modal.confirm({
      title: "提示",
      content: "你确定要删除吗？",
      okText: "确认",
      cancelText: "取消",
      onOk() {
        utils.$message.success("已删除");
        confirmDeletePromise(idList);
      },
      onCancel() {
        console.log("取消操作");
      },
    });
  };

  const handleDelete = (record: RecordType) => {
    modal.confirm({
      title: "提示",
      content: "你确定要删除吗？",
      okText: "确认",
      cancelText: "取消",
      onOk() {
        utils.$message.success("已删除");
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
        .then((response: AxiosResponse<TableDataType>) => {
          paginationRef.current.page = 1;
          setPagination(paginationRef.current);
          getDataPromise();
          resolve(response);
        })
        .catch((error: AxiosError) => {
          console.log(error);
          reject(error);
        });
    });
  };

  const getCategoryList = () => {
    setCategoryListLoading(true);
    getCategoryListRequest()
      .then((response) => {
        console.log(response);
        handleUpdateCategoryList(
          response.data.map((item: CategoryItem) => {
            return {
              id: item.id,
              category: item.category,
            };
          }),
        );
        setCategoryListLoading(false);
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  const handleUpdateCategoryList = (categoryList: Array<CategoryItem>) => {
    setCategoryList(categoryList);
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
            justify="start"
          >
            <Col span={22}>
              <Flex
                gap="middle"
                justify="start"
              >
                <Button
                  disabled={!isLoggedIn}
                  onClick={handleAdd}
                >
                  <PlusOutlined />
                </Button>
                <Form.Item id="search">
                  <Input.Search
                    placeholder="input search text"
                    allowClear
                    disabled={loading}
                    onSearch={(
                      value: string,
                      event: React.ChangeEvent<HTMLInputElement, Element>,
                    ) => handleSearchArticle(value, event)}
                  />
                </Form.Item>
                {isLoggedIn && (
                  <>
                    <Form.Item
                      label="公开"
                      name="isPublic"
                    >
                      <Select
                        style={{ width: 200 }}
                        defaultValue="all"
                        onChange={handleChooseIsPublic}
                        options={[
                          { value: "all", label: "全部" },
                          { value: "isPublic", label: "公开" },
                          { value: "isPrivate", label: "私有" },
                        ]}
                      ></Select>
                    </Form.Item>
                    <Form.Item
                      label="类型"
                      name="category"
                    >
                      <Select
                        style={{ width: 200 }}
                        onChange={handleChooseCategory}
                        options={categoryList.map((item) => {
                          return {
                            label: item.category,
                            value: item.id,
                          };
                        })}
                        allowClear
                      ></Select>
                    </Form.Item>
                    <Button
                      disabled={!isLoggedIn}
                      onClick={() => setEditCategoryDialogVisible(true)}
                    >
                      类型管理
                    </Button>
                  </>
                )}
              </Flex>
            </Col>
            <Col span={2}>
              <Flex
                gap="middle"
                justify="end"
              >
                <Button
                  disabled={!isLoggedIn || selectedRowKeys.length === 0}
                  onClick={() => handleMultipleDelete()}
                >
                  <DeleteOutlined />
                </Button>
              </Flex>
            </Col>
          </Row>
        </Form>
        <Table
          className={utils.$checkIsMobile() ? "mobile" : ""}
          rowSelection={rowSelection}
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
      </div>
      <EditDialog
        ref={editDialogRef}
        dialogActive={dialogActive}
        editActive={editActive}
        addActive={addActive}
        reviewActive={reviewActive}
        record={record}
        categoryList={categoryList}
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
      <EditCategoryDialog
        dialogActive={editCategoryDialogVisible}
        categoryList={categoryList}
        loading={categoryListLoading}
        onCancel={() => setEditCategoryDialogVisible(false)}
        onUpdateCategoryList={handleUpdateCategoryList}
      ></EditCategoryDialog>
    </div>
  );
}
