import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { setIsLoggedIn } from "@/store/index";
import "./Login.scss";
import type { FormProps } from "antd";
import type { AxiosError } from "axios";
import { loginRequest, changePasswordRequest } from "@/api/auth";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import utils from "@/utils/utils.ts";

interface InterviewItem {
  id?: number;
  key?: string;
  content: string;
  title: string;
}

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const handleSubmitLogin: FormProps<InterviewItem>["onFinish"] = () => {
    setLoading(true);
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
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((error: Error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleSubmitChangePassword: FormProps<InterviewItem>["onFinish"] = () => {
    form
      .validateFields({ validateOnly: true })
      .then((formData) => {
        changePasswordRequest(formData)
          .then(() => {
            $message.success("密码修改成功！");
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

  return (
    <div className="login_container">
      {mode === "login" && (
        <div className="main">
          <div className="title">Login</div>
          <Row justify="center">
            <Col span={20}>
              <Form
                form={form}
                layout="horizontal"
                onFinish={handleSubmitLogin}
                autoComplete="off"
              >
                <Form.Item
                  name="userName"
                  rules={[{ required: true, message: "Please input your Username!" }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Username"
                    disabled={loading}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: "Please input your Password!" }]}
                >
                  <Input
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Password"
                    disabled={loading}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    block
                    type="primary"
                    htmlType="submit"
                    disabled={loading}
                    loading={loading}
                  >
                    Log in
                  </Button>
                  or{" "}
                  <Button
                    type="link"
                    href="javascript:;"
                    onClick={() => setMode("changePassword")}
                  >
                    Change Password
                  </Button>
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
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Username"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: "Please input old Password!" }]}
                >
                  <Input
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Old password"
                  />
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  rules={[{ required: true, message: "Please input new Password!" }]}
                >
                  <Input
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="New password"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    block
                    type="primary"
                    htmlType="submit"
                  >
                    Confirm
                  </Button>
                  or{" "}
                  <Button
                    type="link"
                    onClick={() => setMode("login")}
                  >
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
