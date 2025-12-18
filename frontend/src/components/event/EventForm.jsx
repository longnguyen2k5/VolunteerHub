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

const EventForm = ({
  initialData,
  onSubmit,
  submitLabel = "Lưu",
  loading = false,
}) => {
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
    description: yup.string().required("Mô tả không được để trống").trim(),
    location: yup.string().required("Địa điểm không được để trống").trim(),
    imageUrl: yup.string().url("Vui lòng nhập đúng định dạng URL"),
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
      .min(new Date(), "Thời gian bắt đầu phải là thời gian tương lai"),
    endTime: yup
      .date()
      .required("Thời gian kết thúc không được để trống")
      .typeError("Thời gian không hợp lệ")
      .min(
        yup.ref("startTime"),
        "Thời gian kết thúc phải sau thời gian bắt đầu"
      ),
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
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
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

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
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
          />

          <TextField
            label="Link Ảnh (URL)"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            error={!!errors.imageUrl}
            helperText={errors.imageUrl || "Copy link ảnh từ internet vào đây"}
            fullWidth
            disabled={loading}
          />

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
          />

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
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
