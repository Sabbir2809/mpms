"use client";

import { registerAction } from "@/actions/auth.actions";
import type { RegisterInput } from "@/types";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Select,
  Space,
  Typography,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "One uppercase letter required")
    .regex(/[0-9]/, "One number required"),
  role: z.enum(["admin", "manager", "member"]).optional(),
  department: z.string().optional(),
});

export function RegisterForm() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "member",
      department: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    const res = await registerAction(data);
    if (res.success) {
      message.success("Account created! Welcome to MPMS.");
      router.push("/dashboard");
      router.refresh();
    } else {
      message.error(res.message || "Registration failed");
    }
  };

  return (
    <Card
      style={{
        width: "100%",
        maxWidth: 480,
        borderRadius: 16,
        boxShadow: "0 20px 60px rgba(0,0,0,.15)",
      }}
      bodyStyle={{ padding: 40 }}>
      <Space
        direction="vertical"
        size={4}
        style={{ width: "100%", marginBottom: 28, textAlign: "center" }}>
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
          Create your account
        </Typography.Title>
        <Typography.Text type="secondary">Join MPMS today</Typography.Text>
      </Space>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Full Name"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<UserOutlined />}
                placeholder="Jane Smith"
                size="large"
              />
            )}
          />
        </Form.Item>

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

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Form.Item label="Role">
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  size="large"
                  options={[
                    { value: "member", label: "Member" },
                    { value: "manager", label: "Manager" },
                    { value: "admin", label: "Admin" },
                  ]}
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Department">
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Engineering" size="large" />
              )}
            />
          </Form.Item>
        </div>

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
            Create Account
          </Button>
        </Form.Item>
      </Form>

      <Typography.Text
        type="secondary"
        style={{ display: "block", textAlign: "center" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "#6366f1" }}>
          Sign in
        </Link>
      </Typography.Text>
    </Card>
  );
}
