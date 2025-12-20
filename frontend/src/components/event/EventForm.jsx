import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Paper,
  Typography,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { format } from "date-fns";
import * as yup from "yup";
import { useThemeContext } from "../../context/ThemeContext";
import { CloudUpload } from "@mui/icons-material";
import { uploadApi } from "../../api/uploadApi";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

const EventForm = ({
  initialData,
  onSubmit,
  submitLabel = "Lưu",
  loading = false,
}) => {
  const { glassSx } = useThemeContext();
  const CATEGORIES = {
    EDUCATION: "Giáo dục",
    ENVIRONMENT: "Môi trường",
    HEALTH: "Y tế",
    COMMUNITY: "Cộng đồng",
    EMERGENCY_RELIEF: "Cứu trợ khẩn cấp",
    OTHER: "Khác",
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    imageUrl: "",
    startTime: "",
    endTime: "",
    maxParticipants: "",
    category: "",
  });

  const [errors, setErrors] = useState({});

  // Define Yup Schema
  const validationSchema = yup.object().shape({
    name: yup.string().required("Tên sự kiện không được để trống").trim(),
    category: yup.string().required("Vui lòng chọn danh mục"),
    description: yup.string().required("Mô tả không được để trống").trim().max(5000, "Mô tả không quá 5000 ký tự"),
    location: yup.string().required("Địa điểm không được để trống").trim(),
    imageUrl: yup.string().max(500, "Link ảnh quá dài"),
    maxParticipants: yup
      .number()
      .typeError("Vui lòng nhập số hợp lệ")
      .required("Vui lòng nhập số lượng người tham gia tối đa")
      .min(1, "Số lượng người tham gia tối đa phải ít nhất là 1")
      .integer("Số lượng phải là số nguyên"),
    startTime: yup
      .date()
      .required("Thời gian bắt đầu không được để trống")
      .typeError("Thời gian không hợp lệ")
      .min(new Date(), "Thời gian bắt đầu phải là thời gian tương lai")
      .max(new Date("2100-01-01"), "Thời gian không hợp lệ (Năm quá xa)"),
    endTime: yup
      .date()
      .required("Thời gian kết thúc không được để trống")
      .typeError("Thời gian không hợp lệ")
      .min(
        yup.ref("startTime"),
        "Thời gian kết thúc phải sau thời gian bắt đầu"
      )
      .max(new Date("2100-01-01"), "Thời gian không hợp lệ (Năm quá xa)"),
  });

  useEffect(() => {
    if (initialData) {
      // Convert backend LocalDateTime format to datetime-local format
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        location: initialData.location || "",
        imageUrl: initialData.imageUrl || "",
        startTime: initialData.startTime
          ? formatToDateTimeLocal(initialData.startTime)
          : "",
        endTime: initialData.endTime
          ? formatToDateTimeLocal(initialData.endTime)
          : "",
        maxParticipants: initialData.maxParticipants || "",
        category: initialData.category || "",
      });
    }
  }, [initialData]);

  const formatToDateTimeLocal = (dateTime) => {
    // Backend sends: "2024-12-25T10:00:00"
    // datetime-local needs: "2024-12-25T10:00"
    if (!dateTime) return "";
    const date = new Date(dateTime);
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types (optional, or rely on submit)
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };



  const [uploadLoading, setUploadLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadLoading(true);
      const response = await uploadApi.uploadImage(file);
      // Assuming backend returns { fileName: "...", fileUrl: "http://..." }
      const newImageUrl = response.data.fileUrl;

      setFormData(prev => ({
        ...prev,
        imageUrl: newImageUrl
      }));
      toast.success("Tải ảnh thành công!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Tải ảnh thất bại!");
    } finally {
      setUploadLoading(false);
      // Reset input so same file can be selected again if needed
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate with Yup
      await validationSchema.validate(formData, { abortEarly: false });

      // If valid, clear errors and submit
      setErrors({});

      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        imageUrl: formData.imageUrl ? formData.imageUrl.trim() : "",
        startTime: formData.startTime, // Send local string "YYYY-MM-DDTHH:mm"
        endTime: formData.endTime,
        maxParticipants: parseInt(formData.maxParticipants),
        category: formData.category,
      };

      onSubmit(submitData);

    } catch (err) {
      if (err instanceof yup.ValidationError) {
        // Transform Yup errors to object
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else {
        console.error("Validation error:", err);
      }
    }
  };

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      color: 'text.primary',
      bgcolor: 'action.hover',
      borderRadius: '12px',
      '& fieldset': { borderColor: 'divider' },
      '&:hover fieldset': { borderColor: 'text.secondary' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
    },
    '& .MuiInputLabel-root': { color: 'text.secondary' },
    '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
    '& .MuiFormHelperText-root': { color: 'text.secondary' },
    '& .MuiSvgIcon-root': { color: 'text.secondary' },
    '& input[type="datetime-local"]::-webkit-calendar-picker-indicator': {
      filter: 'invert(0.5)', // Adjust for light/dark
      cursor: 'pointer'
    }
  };

  return (
    <Paper
      sx={{
        p: 4,
        ...glassSx,
        borderRadius: '24px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={4}>
          <TextField
            label="Tên sự kiện"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
            disabled={loading}
            sx={textFieldStyle}
          />

          <TextField
            select
            label="Danh mục"
            name="category"
            value={formData.category}
            onChange={handleChange}
            error={!!errors.category}
            helperText={errors.category}
            fullWidth
            required
            disabled={loading}
            sx={textFieldStyle}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    '& .MuiMenuItem-root:hover': { bgcolor: 'action.hover' },
                    '& .MuiMenuItem-root.Mui-selected': { bgcolor: 'action.selected' },
                  }
                }
              }
            }}
          >
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Mô tả"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            required
            multiline
            rows={4}
            disabled={loading}
            sx={textFieldStyle}
          />

          <TextField
            label="Địa điểm"
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={!!errors.location}
            helperText={errors.location}
            fullWidth
            required
            disabled={loading}
            sx={textFieldStyle}
          />

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <TextField
              label="Link Ảnh (URL)"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              error={!!errors.imageUrl}
              helperText={errors.imageUrl || "Nhập URL hoặc tải ảnh lên từ máy"}
              fullWidth
              disabled={loading || uploadLoading}
              sx={{ ...textFieldStyle, flexGrow: 1 }}
            />
            <Button
              variant="outlined"
              component="label"
              disabled={loading || uploadLoading}
              sx={{
                height: 56,
                whiteSpace: 'nowrap',
                borderRadius: '12px',
                borderColor: 'divider',
                minWidth: '120px'
              }}
            >
              {uploadLoading ? <CircularProgress size={24} /> : (
                <>
                  <CloudUpload sx={{ mr: 1 }} />
                  Tải ảnh
                </>
              )}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileUpload}
              />
            </Button>
          </Box>

          <TextField
            label="Số lượng người tham gia tối đa"
            name="maxParticipants"
            type="number"
            value={formData.maxParticipants}
            onChange={handleChange}
            error={!!errors.maxParticipants}
            helperText={errors.maxParticipants}
            fullWidth
            required
            disabled={loading}
            inputProps={{ min: 1 }}
            sx={textFieldStyle}
          />

          <TextField
            label="Thời gian bắt đầu"
            name="startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={handleChange}
            error={!!errors.startTime}
            helperText={errors.startTime}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            disabled={loading}
            sx={textFieldStyle}
          />

          <TextField
            label="Thời gian kết thúc"
            name="endTime"
            type="datetime-local"
            value={formData.endTime}
            onChange={handleChange}
            error={!!errors.endTime}
            helperText={errors.endTime}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            disabled={loading}
            sx={textFieldStyle}
          />

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: '30px',
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                fontSize: '1.1rem',
                fontWeight: 600,
                px: 5,
                py: 1,
                '&:hover': {
                  boxShadow: '0 6px 15px 4px rgba(255, 105, 135, .4)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {loading ? "Đang xử lý..." : submitLabel}
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};

export default EventForm;
