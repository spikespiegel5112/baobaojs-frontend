import React, { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { setUserInfo, setIsLoggedIn } from "@/store/index";
import "./index.scss";
import type { FormProps, TableProps } from "antd";
import type { AxiosError } from "axios";
import { loginRequest, changePasswordRequest } from "@/api/auth";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import utils from "@/utils/utils.ts";

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

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const defaultPagination: PaginationType = {
    current: 1,
    pageSize: 20,
    total: undefined,
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [mode, setMode] = useState("login");

  const [form] = Form.useForm();

  useEffect(() => {}, []);

  const rulesMap = {
    title: [{ required: true, message: "请输入邮箱" }],
    content: [{ required: true, message: "请输入密码" }],
  };

  const handleSubmitLogin: FormProps<InterviewItem>["onFinish"] = () => {
    form
      .validateFields({ validateOnly: true })
      .then((formData) => {
        loginRequest(formData)
          .then(() => {
            $message.success("登录成功！");
            dispatch(setIsLoggedIn(true));
            navigate(utils.$findRoutePathById("ErnieBot"));
          })
          .catch((error: AxiosError) => {
            console.log(error);
            $message.error(error.message);
          });
      })
      .catch((error: Error) => {
        console.log(error);
      });
  };

  const handleSubmitChangePassword: FormProps<InterviewItem>["onFinish"] = () => {
    form
      .validateFields({ validateOnly: true })
      .then((formData) => {
        changePasswordRequest(formData)
          .then(() => {
            $message.success("密码修改成功！");
            navigate(utils.$findRoutePathById("ErnieBot"));
          })
          .catch((error: AxiosError) => {
            console.log(error);
            $message.error(error.message);
          });
      })
      .catch((error: Error) => {
        console.log(error);
      });
  };

  return (
    <div className="login_container">
      {mode === "login" && (
        <div className="main">
          <div className="title">Login</div>
          <Row justify="center">
            <Col span={20}>
              <Form form={form} layout="horizontal" onFinish={handleSubmitLogin} autoComplete="off">
                <Form.Item
                  name="userName"
                  rules={[{ required: true, message: "Please input your Username!" }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: "Please input your Password!" }]}
                >
                  <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                </Form.Item>

                <Form.Item>
                  <Button block type="primary" htmlType="submit">
                    Log in
                  </Button>
                  or{" "}
                  <a href="javascript:;" onClick={() => setMode("changePassword")}>
                    Change Password
                  </a>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      )}

      {mode === "changePassword" && (
        <div className="main">
          <div className="title">Change Password</div>
          <Row justify="center">
            <Col span={20}>
              <Form
                form={form}
                layout="horizontal"
                onFinish={handleSubmitChangePassword}
                autoComplete="off"
              >
                <Form.Item
                  name="userName"
                  rules={[{ required: true, message: "Please input your Username!" }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: "Please input your Password!" }]}
                >
                  <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                </Form.Item>

                <Form.Item>
                  <Button block type="primary" htmlType="submit">
                    Confirm
                  </Button>
                  or{" "}
                  <a href="javascript:;" onClick={() => setMode("login")}>
                    Login
                  </a>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
