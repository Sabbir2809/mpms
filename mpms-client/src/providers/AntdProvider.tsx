"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { ThemeConfig } from "antd";
import { App, ConfigProvider } from "antd";

const theme: ThemeConfig = {
  token: {
    colorPrimary: "#6366f1",
    colorSuccess: "#22c55e",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    colorInfo: "#3b82f6",
    borderRadius: 8,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
    colorBgContainer: "#ffffff",
    colorBgLayout: "#f8fafc",
    colorBorder: "#e2e8f0",
    colorTextSecondary: "#64748b",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  },
  components: {
    Layout: {
      siderBg: "#0f172a",
      triggerBg: "#1e293b",
      headerBg: "#ffffff",
      headerHeight: 64,
    },
    Menu: {
      darkItemBg: "#0f172a",
      darkItemSelectedBg: "#6366f1",
      darkItemHoverBg: "#1e293b",
      darkItemColor: "#94a3b8",
      darkItemSelectedColor: "#ffffff",
      itemBorderRadius: 6,
    },
    Card: {
      borderRadiusLG: 12,
    },
    Button: {
      borderRadius: 8,
    },
    Table: {
      headerBg: "#f8fafc",
    },
  },
};

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider theme={theme}>
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
