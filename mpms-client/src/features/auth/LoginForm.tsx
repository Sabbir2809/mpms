"use client";

import { loginAction } from "@/actions/auth.actions";
import type { LoginInput } from "@/types";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Space,
  Typography,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export function LoginForm() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    const res = await loginAction(data);
    if (res.success) {
      message.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    } else {
      message.error(res.message || "Login failed");
    }
  };

  return (
    <Card
      style={{
        width: "100%",
        maxWidth: 440,
        borderRadius: 16,
        boxShadow: "0 20px 60px rgba(0,0,0,.15)",
      }}
      bodyStyle={{ padding: 40 }}>
      <Space
        direction="vertical"
        size={4}
        style={{ width: "100%", marginBottom: 32, textAlign: "center" }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
          }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 20 }}>
            M
          </span>
        </div>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Sign in to MPMS
        </Typography.Title>
        <Typography.Text type="secondary">
          Manage your projects and tasks
        </Typography.Text>
      </Space>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Email"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<MailOutlined />}
                placeholder="you@example.com"
                size="large"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.message}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined />}
                placeholder="••••••••"
                size="large"
              />
            )}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={isSubmitting}
            style={{
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              border: "none",
            }}>
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <Divider />
      <Typography.Text
        type="secondary"
        style={{ display: "block", textAlign: "center" }}>
        No account?{" "}
        <Link href="/register" style={{ color: "#6366f1" }}>
          Create one
        </Link>
      </Typography.Text>
    </Card>
  );
}
