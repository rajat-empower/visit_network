"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardLayout>{children}</DashboardLayout>
      <Toaster />
    </>
  );
} 