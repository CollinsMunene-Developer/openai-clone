import React from "react";

import { getUser, getUserDetails } from "./utils/db/auth";
import { fullUser } from "./types/db";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/ui/breadcrumb";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/ui/app-sidebar";

const page = async () => {
  const user = await getUser();
  if (!user?.id) {
    return null;
  }
  const userDetails = await getUserDetails();
  if (!userDetails) {
    return null;
  }
  const formattedUser: fullUser = {
    id: userDetails.id,
    full_name: userDetails.full_name,
    email: userDetails.email,
    avatar_url: userDetails.avatar_url || undefined,
  };
  return (
    <div>
      <SidebarProvider>
        <AppSidebar user={formattedUser} />
      </SidebarProvider>
    </div>
  );
};

export default page;
