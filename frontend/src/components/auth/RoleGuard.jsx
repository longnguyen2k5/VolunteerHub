import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/**
 * RoleGuard - Bảo vệ các route dựa trên vai trò người dùng
 *
 * @param {string[]} allowedRoles - Danh sách vai trò được phép truy cập (vd: ['ADMIN', 'EVENT_MANAGER'])
 * @param {ReactNode} children - Component con sẽ được hiển thị nếu có quyền
 *
 * Sử dụng:
 * <RoleGuard allowedRoles={['ADMIN']}>
 *   <AdminDashboard />
 * </RoleGuard>
 */
const RoleGuard = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  // Chờ kiểm tra xác thực hoàn tất
  if (loading) {
    return null; // hoặc hiển thị loading spinner
  }

  // Chưa đăng nhập -> Chuyển hướng về trang đăng nhập
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Không có quyền truy cập -> Chuyển hướng về trang forbidden
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  // Có quyền -> Hiển thị nội dung
  return children;
};

export default RoleGuard;
