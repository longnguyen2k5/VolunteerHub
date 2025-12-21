import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation Schema
const schema = yup.object().shape({
  fullName: yup
    .string()
    .required("Vui lòng nhập họ và tên")
    .min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: yup
    .string()
    .required("Vui lòng xác nhận mật khẩu")
    .oneOf([yup.ref("password"), null], "Mật khẩu xác nhận không khớp"),
  role: yup
    .string()
    .required("Vui lòng chọn vai trò")
});

/**
 * Trang đăng ký tài khoản mới.
 * Cho phép người dùng đăng ký dưới vai trò Volunteer hoặc Event Manager.
 */
const Register = () => {
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register: registerAuth, login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "VOLUNTEER"
    }
  });

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);

    try {
      // Loại bỏ confirmPassword khỏi payload gửi lên server
      const { confirmPassword, ...payload } = data;

      console.log(
        "Sending registration data:",
        JSON.stringify(payload, null, 2)
      );
      const result = await registerAuth(payload);
      console.log("Registration response:", JSON.stringify(result, null, 2));

      if (result.success) {
        navigate("/dashboard");
      } else {
        setServerError(result.error);
      }
    } catch (err) {
      console.error("Registration error details:", {
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        message: err.message,
      });
      setServerError(err.response?.data?.message || "Đã xảy ra lỗi khi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2074&auto=format&fit=crop)', // Volunteer/Hands background
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark overlay
          backdropFilter: 'blur(5px)',
        }
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Card
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            color: 'white',
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box
                component="img"
                src="/logo.png"
                alt="Logo"
                sx={{ width: 60, height: 60, objectFit: 'contain', borderRadius: '50%' }}
              />
            </Box>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Đăng ký
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{ mb: 4, color: 'rgba(255,255,255,0.7)' }}
            >
              Tham gia cộng đồng tình nguyện viên lớn nhất Việt Nam
            </Typography>

            {serverError && (
              <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(211, 47, 47, 0.1)', color: '#ffcdd2', border: '1px solid #e57373' }}>
                {serverError}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    {...register("fullName")}
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&:hover fieldset': { borderColor: 'white' },
                        '&.Mui-focused fieldset': { borderColor: '#FF8E53' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#FF8E53' },
                      '& .MuiFormHelperText-root': { color: '#ffcdd2' }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&:hover fieldset': { borderColor: 'white' },
                        '&.Mui-focused fieldset': { borderColor: '#FF8E53' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#FF8E53' },
                      '& .MuiFormHelperText-root': { color: '#ffcdd2' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mật khẩu"
                    type="password"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message || "Tối thiểu 6 ký tự"}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&:hover fieldset': { borderColor: 'white' },
                        '&.Mui-focused fieldset': { borderColor: '#FF8E53' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#FF8E53' },
                      '& .MuiFormHelperText-root': { color: errors.password ? '#ffcdd2' : 'rgba(255,255,255,0.5)' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mật khẩu xác nhận"
                    type="password"
                    {...register("confirmPassword")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&:hover fieldset': { borderColor: 'white' },
                        '&.Mui-focused fieldset': { borderColor: '#FF8E53' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#FF8E53' },
                      '& .MuiFormHelperText-root': { color: '#ffcdd2' }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.role}>
                    <InputLabel sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-focused': { color: '#FF8E53' } }}>Vai trò</InputLabel>
                    <Select
                      defaultValue="VOLUNTEER"
                      {...register("role")}
                      label="Vai trò"
                      sx={{
                        color: 'white',
                        '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF8E53' },
                        '.MuiSvgIcon-root': { color: 'white' },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: '#1e1e1e',
                            color: 'white',
                            '& .MuiMenuItem-root:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                            '& .MuiMenuItem-root.Mui-selected': { bgcolor: 'rgba(254, 107, 139, 0.2)' },
                          }
                        }
                      }}
                    >
                      <MenuItem value="VOLUNTEER">Tình nguyện viên</MenuItem>
                      <MenuItem value="EVENT_MANAGER">Nhà tổ chức sự kiện</MenuItem>
                    </Select>
                    {errors.role && (
                      <Typography variant="caption" color="#ffcdd2" sx={{ ml: 1.5, mt: 0.5 }}>
                        {errors.role.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 4,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: '50px',
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 15px 4px rgba(255, 105, 135, .4)',
                  },
                  '&:disabled': {
                    background: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.3)'
                  }
                }}
              >
                {loading ? "Đang xử lý..." : "Tạo tài khoản"}
              </Button>
            </form>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Đã có tài khoản?{" "}
                <Typography
                  component="span"
                  onClick={() => login && login()}
                  sx={{
                    cursor: 'pointer',
                    color: '#FF8E53',
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'underline', color: '#FE6B8B' }
                  }}
                >
                  Đăng nhập
                </Typography>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
