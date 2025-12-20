import React from "react";
import { Button as MuiButton, CircularProgress } from "@mui/material";

/**
 * Component Button thống nhất cho toàn bộ ứng dụng.
 * Bao gồm trạng thái loading, disable, icon, v.v.
 */
const Button = ({
  children,
  loading = false,
  disabled = false,
  variant = "contained",
  color = "primary",
  size = "medium",
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  type = "button",
  sx = {},
  ...props
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={loading ? null : startIcon}
      endIcon={loading ? null : endIcon}
      onClick={onClick}
      type={type}
      sx={{
        position: "relative",
        ...sx,
      }}
      {...props}
    >
      {/* Hiển thị loading spinner nếu đang xử lý */}
      {loading && (
        <CircularProgress
          size={20}
          sx={{
            position: "absolute",
            left: "50%",
            marginLeft: "-10px",
            color: "inherit",
          }}
        />
      )}
      {/* Ẩn nội dung khi đang loading để giữ kích thước button */}
      <span style={{ visibility: loading ? "hidden" : "visible" }}>
        {children}
      </span>
    </MuiButton>
  );
};

export default Button;
