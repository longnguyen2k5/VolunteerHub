import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Paper,
  Typography,
} from "@mui/material";
import { format } from "date-fns";

const EventForm = ({
  initialData,
  onSubmit,
  submitLabel = "Lưu",
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // Convert backend LocalDateTime format to datetime-local format
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        location: initialData.location || "",
        startTime: initialData.startTime
          ? formatToDateTimeLocal(initialData.startTime)
          : "",
        endTime: initialData.endTime
          ? formatToDateTimeLocal(initialData.endTime)
          : "",
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
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên sự kiện không được để trống";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả không được để trống";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Địa điểm không được để trống";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Thời gian bắt đầu không được để trống";
    } else {
      const startDate = new Date(formData.startTime);
      const now = new Date();
      if (startDate < now) {
        newErrors.startTime = "Thời gian bắt đầu phải là thời gian tương lai";
      }
    }

    if (!formData.endTime) {
      newErrors.endTime = "Thời gian kết thúc không được để trống";
    } else if (formData.startTime) {
      const startDate = new Date(formData.startTime);
      const endDate = new Date(formData.endTime);
      if (endDate <= startDate) {
        newErrors.endTime = "Thời gian kết thúc phải sau thời gian bắt đầu";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Convert datetime-local format to ISO string for backend
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      };
      onSubmit(submitData);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
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
