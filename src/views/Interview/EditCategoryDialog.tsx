import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import "./Interview.scss";
import type { AxiosError } from "axios";
import type { FormProps } from "antd";

import {
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

import { createOrUpdateCategoryRequest, deleteCategoryRequest } from "@/api/inteerview";

import utils from "@/utils/utils";

export interface EditDialogRef {
  resetField: () => void;
}

export type CategoryItem = {
  id: number | string;
  category: string;
};

interface Props {
  dialogActive: boolean;
  loading: boolean;
  addActive?: boolean;
  reviewActive?: boolean;
  categoryList: CategoryItem[];
  onCancel: () => void;
  onUpdateCategoryList: (categoryList: CategoryItem[]) => void;
}

const EditCategoryDialog = forwardRef<EditDialogRef, Props>((props, ref) => {
  EditCategoryDialog.displayName = "EditCategoryDialog";

  useImperativeHandle(ref, () => ({
    resetField,
  }));

  const [addActive, setAddActive] = useState<boolean>(false);
  const [editActiveId, setEditActiveId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deleteingId, setDeleteingId] = useState<number | null>(null);

  const editActiveIdRef = useRef<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {}, []);

  useEffect(() => {}, [props.dialogActive]);

  // const rulesMap = {
  //   title: [{ required: true, message: "请输入标题" }],
  // };

  const resetField = () => {
    const formData = form.getFieldsValue();
    console.log(formData);
    form.resetFields();
  };

  const handleSubmitCategory: FormProps<CategoryItem>["onFinish"] = (item: CategoryItem) => {
    console.log(item);
    form
      .validateFields({ validateOnly: true })
      .then((formData) => {
        setSubmitting(true);
        createOrUpdateCategoryRequest({
          ...formData,
          id: editActiveIdRef.current,
        })
          .then((response: CategoryItem) => {
            console.log(response);
            utils.$message.success("保存成功！");
            let result: CategoryItem[] = JSON.parse(JSON.stringify(props.categoryList));
            const target = result.some((item) => item.id === editActiveIdRef.current);
            if (target) {
              const index = result.findIndex((item) => item.id === editActiveIdRef.current);
              result[index].category = formData.category;
            }

            if (!target) {
              result = [
                ...props.categoryList,
                {
                  id: response.id,
                  category: response.category,
                },
              ];
            }

            props.onUpdateCategoryList(result);
          })
          .catch((error: AxiosError) => {
            console.log(error);
          })
          .finally(() => {
            setSubmitting(false);
            setAddActive(false);
            setEditActiveId(null);
            editActiveIdRef.current = null;
            form.resetFields();
          });
      })
      .catch((error: Error) => {
        console.log(error);
      });
  };

  const handleEditCategory = (item: CategoryItem) => {
    setEditActiveId(item.id);
    setAddActive(false);
    editActiveIdRef.current = item.id;
    form.setFieldValue("category", item.category);
  };

  const handleDeleteCategory = (item: CategoryItem) => {
    setDeleteingId(item.id);
    deleteCategoryRequest({
      id: item.id,
    })
      .then(() => {
        utils.$message.success("删除成功");
        props.onUpdateCategoryList(props.categoryList.filter((item2) => item2.id !== item.id));
      })
      .catch((error: AxiosError) => {
        console.log(error);
      })
      .finally(() => {
        setDeleteingId(null);
      });
  };

  const handleAdd = () => {
    form.resetFields();
    setAddActive(true);
    setEditActiveId(null);
  };

  const addForm = (
    <Form
      form={form}
      labelAlign="left"
      initialValues={{}}
      onFinish={handleSubmitCategory}
    >
      <Row gutter={10}>
        <Col span={20}>
          <Form.Item
            name="category"
            noStyle
          >
            <Input></Input>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Button
            type="text"
            icon={<CheckOutlined />}
            htmlType="submit"
            loading={submitting}
          ></Button>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => {
              setAddActive(false);
              setEditActiveId(null);
              form.resetFields();
            }}
          ></Button>
        </Col>
      </Row>
    </Form>
  );

  const castegoryListComponent = (
    <Listy<CategoryItem>
      items={props.categoryList.map((item) => {
        return {
          ...item,
          content: item.category,
        };
      })}
      rowKey="id"
      height={400}
      itemRender={(item) => {
        if (editActiveId !== null && editActiveId === item.id) {
          return addForm;
        } else {
          return (
            <Flex
              justify="space-between"
              align="center"
            >
              <span>{item.category}</span>;
              <Flex
                justify="space-between"
                align="end"
              >
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  disabled={item.id === deleteingId}
                  onClick={() => handleEditCategory(item)}
                />
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  loading={item.id === deleteingId}
                  onClick={() => handleDeleteCategory(item)}
                />
              </Flex>
            </Flex>
          );
        }
      }}
    />
  );

  return (
    <Modal
      open={props.dialogActive}
      title="类型管理"
      onCancel={() => {
        props.onCancel();
      }}
      okButtonProps={{ style: { display: "none" } }}
    >
      <Space
        orientation="vertical"
        size="medium"
        style={{
          display: "flex",
          padding: "0.2rem 0 0 0",
          minHeight: "2rem",
        }}
      >
        <Button onClick={handleAdd}>
          <PlusOutlined />
        </Button>
        {(() => {
          let result = <></>;
          if (props.categoryList.length > 0) {
            result = <>{castegoryListComponent}</>;
            if (addActive) {
              result = (
                <>
                  {castegoryListComponent}
                  {addForm}
                </>
              );
            }
          } else if (props.loading) {
            result = (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "2rem",
                }}
              >
                <Spin />
              </div>
            );
          } else {
            result = <Empty />;
            if (addActive) {
              result = <>{addForm}</>;
            }
          }
          return result;
        })()}
      </Space>
    </Modal>
  );
});
export default EditCategoryDialog;
