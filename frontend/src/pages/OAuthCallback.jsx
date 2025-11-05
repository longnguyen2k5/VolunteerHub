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

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { handleCallback } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(true);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent React Strict Mode from running this twice
    if (hasProcessed.current) {
      return;
    }

    hasProcessed.current = true;

    const processCallback = async () => {
      // Get authorization code and state from URL
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const errorParam = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      // Check for errors from authorization server
      if (errorParam) {
        setError(errorDescription || errorParam);
        setProcessing(false);
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      // Check if code exists
      if (!code) {
        setError("Authorization code not found");
        setProcessing(false);
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      // Handle callback and exchange code for token
      try {
        const result = await handleCallback(code, state);

        if (!result.success) {
          setError(result.error);
          setTimeout(() => navigate("/login"), 3000);
        }
        // Success case handled in handleCallback (navigates to dashboard)
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
