import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Avatar,
  Button,
  Card,
  Empty,
  Form,
  Input,
  Listy,
  message,
  Pagination,
  Popconfirm,
  Select,
  Tag,
  Typography,
} from "antd";

import { DeleteOutlined, SendOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "./MessageBoard.scss";
import {
  getMessageListRequest,
  createMessageRequest,
  deleteMessageRequest,
} from "@/api/messageBoard";

import type { PaginationType } from "@/views/BaobaoLayout/BaobaoLayout";

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

interface Comment {
  id?: number | string;
  nickName: string;
  avatar: string;
  message: string;
}

const MessageBoard: React.FC = () => {
  const defaultPagination: PaginationType = {
    page: 1,
    pageSize: 20,
    total: undefined,
  };

  const [form] = Form.useForm();
  const [comments, setComments] = useState<Comment[]>([]);
  const [sortType, setSortType] = useState("newest");
  const [current, setCurrent] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const pageSize = 5;

  const paginationRef = useRef(defaultPagination);

  // 当前登录用户，实际项目从用户信息中获取
  const currentUser = "Alex";

  // 排序
  const sortedComments = useMemo(() => {
    return [...comments].sort((a, b) => {
      const diff = new Date(b.createTime).getTime() - new Date(a.createTime).getTime();

      return sortType === "newest" ? diff : -diff;
    });
  }, [comments, sortType]);

  useEffect(() => {
    getData();
  }, []);

  // 当前页数据
  const pageComments = sortedComments.slice((current - 1) * pageSize, current * pageSize);

  const getData = () => {
    getMessageListRequest(paginationRef.current).then((response) => {
      const listData = response?.data?.list || [];
      setComments(listData);
    });
  };

  // 发布留言
  const handleSubmit = (values: { message: string }) => {
    setSubmitting(true);
    const newComment: Comment = {
      nickName: currentUser,
      message: values.message.trim(),
    };

    createMessageRequest(newComment)
      .then(() => {
        getData();
        message.success("留言发布成功！");
      })
      .finally(() => {
        setSubmitting(false);
      });

    setCurrent(1);
    form.resetFields();
  };

  const handleChoosePage = (page: number) => {
    paginationRef.current = page;
    getData();
  };

  // 点赞
  // const handleLike = (id: number) => {
  //   setComments((prev) =>
  //     prev.map((item) =>
  //       item.id === id
  //         ? {
  //             ...item,
  //             liked: !item.liked,
  //             likes: item.likes + (item.liked ? -1 : 1),
  //           }
  //         : item,
  //     ),
  //   );
  // };

  // 删除留言
  const handleDelete = (item: Comment) => {
    deleteMessageRequest({
      id: item.id,
    }).then(() => {
      message.success("删除成功");
      setComments((prev) => prev.filter((item) => item.id !== item.id));
    });
  };

  return (
    <div className="message-board">
      <div className="message-header">
        <div>
          <Title level={3}>留言板</Title>
        </div>
        <Tag color="blue">Community</Tag>
      </div>

      <Card
        className="publish-card"
        style={{ margin: 0 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="message"
            rules={[
              { required: true, message: "请输入留言内容" },
              { max: 500, message: "留言不能超过500个字符" },
            ]}
          >
            <TextArea
              placeholder="有什么想说的？在这里留下你的留言吧..."
              autoSize={{ minRows: 4, maxRows: 8 }}
              maxLength={500}
              showCount
            />
          </Form.Item>

          <div className="publish-footer">
            <Text type="secondary">请文明发言，共同维护交流环境</Text>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              disabled={submitting}
              loading={submitting}
            >
              发布留言
            </Button>
          </div>
        </Form>
      </Card>

      {/* 留言列表 */}
      <div className="comment-section">
        <div className="comment-toolbar">
          <div>
            <Title level={4}>全部留言</Title>
            <Text type="secondary">共 {comments.length} 条留言</Text>
          </div>

          <Select
            value={sortType}
            onChange={setSortType}
            options={[
              { label: "最新发布", value: "newest" },
              { label: "最早发布", value: "oldest" },
            ]}
            style={{ width: 120 }}
          />
        </div>

        {pageComments.length > 0 ? (
          <Card
            className="comment-card"
            styles={{ body: { padding: 0 } }}
          >
            <Listy<Comment>
              items={pageComments.map((item) => {
                return {
                  ...item,
                  content: item.message,
                };
              })}
              rowKey="id"
              itemRender={(item) => {
                return (
                  <div className="comment-item">
                    <div className="comment-user">
                      <Avatar
                        size={42}
                        style={{
                          backgroundColor: "#e6f4ff",
                          color: "#1677ff",
                        }}
                      >
                        {item.avatar}
                      </Avatar>

                      <div className="user-info">
                        <Text strong>{item.nickName}</Text>
                        <Text
                          type="secondary"
                          className="comment-time"
                        >
                          {dayjs(item.createTime).fromNow?.() ||
                            dayjs(item.createTime).format("YYYY-MM-DD HH:mm")}
                        </Text>
                      </div>

                      {item.nickName === currentUser && <Tag color="blue">我</Tag>}
                    </div>

                    <Paragraph className="comment-content">{item.message}</Paragraph>

                    <div className="comment-actions">
                      {item.nickName === currentUser && (
                        <Popconfirm
                          title="确定删除这条留言吗？"
                          onConfirm={() => handleDelete(item)}
                        >
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                          >
                            删除
                          </Button>
                        </Popconfirm>
                      )}
                    </div>
                  </div>
                );
              }}
            />
          </Card>
        ) : (
          <Card>
            <Empty description="暂无留言，快来发表第一条留言吧" />
          </Card>
        )}

        {comments.length > pageSize && (
          <div className="pagination_wrapper">
            <Pagination
              current={current}
              pageSize={pageSize}
              total={comments.length}
              onChange={handleChoosePage}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBoard;
