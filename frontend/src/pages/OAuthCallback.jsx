import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";

/**
 * Trang xử lý callback của OAuth2 (Google Login).
 * Nhận authorization code từ URL, trao đổi lấy token và đăng nhập user.
 */
const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { handleCallback } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(true);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Ngăn chặn React Strict Mode chạy effect 2 lần
    if (hasProcessed.current) {
      return;
    }

    hasProcessed.current = true;

    const processCallback = async () => {
      // Lấy code và state từ URL
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const errorParam = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      // Kiểm tra lỗi từ authorization server trả về
      if (errorParam) {
        setError(errorDescription || errorParam);
        setProcessing(false);
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      // Kiểm tra xem có code không
      if (!code) {
        setError("Authorization code not found");
        setProcessing(false);
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      // Xử lý callback: đổi code lấy token
      try {
        const result = await handleCallback(code, state);

        if (!result.success) {
          setError(result.error);
          setTimeout(() => navigate("/login"), 3000);
        }
        // Thành công: handleCallback sẽ tự điều hướng (về dashboard hoặc trang trước đó)
      } catch (err) {
        setError(err.message);
        setTimeout(() => navigate("/login"), 3000);
      } finally {
        setProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, handleCallback, navigate]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        {processing ? (
          <>
            <CircularProgress size={60} />
            <Typography variant="h6">Đang xử lý đăng nhập...</Typography>
            <Typography variant="body2" color="text.secondary">
              Vui lòng đợi trong giây lát
            </Typography>
          </>
        ) : error ? (
          <>
            <Alert severity="error" sx={{ width: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Đăng nhập thất bại
              </Typography>
              <Typography variant="body2">{error}</Typography>
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Đang chuyển hướng về trang đăng nhập...
            </Typography>
          </>
        ) : (
          <Typography variant="h6" color="success.main">
            Đăng nhập thành công! Đang chuyển hướng...
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default OAuthCallback;
