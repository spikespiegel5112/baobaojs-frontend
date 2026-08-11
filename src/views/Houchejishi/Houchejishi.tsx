import React, { lazy, Suspense, useEffect, useState } from "react";
import "./index.scss";

export default function Houchejishi() {
  useEffect(() => {}, []);

  const rulesMap = {
    title: [{ required: true, message: "请输入邮箱" }],
    content: [{ required: true, message: "请输入密码" }],
  };

  return (
    <div className="houchejishi_container">
      <iframe src="https://baobaojs.com/houchejishi" frameBorder="0"></iframe>
    </div>
  );
}
