import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
} from "@mui/material";

export default function ResetPassword() {
  const { token } = useParams(); // get token from URL
  const navigate = useNavigate();

  const [resetSuccess, setResetSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`,
        {
          password: data.password,
        },
      );
      setResetSuccess(true);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.msg || "Failed to reset password. Try again.",
      );
    }
  };

  if (resetSuccess) {
    return (
      <Paper
        elevation={8}
        sx={{
          width: 420,
          maxWidth: "90vw",
          p: 4,
          borderRadius: 3,
          mx: "auto",
          mt: 4,
        }}
      >
        <Typography variant="h5" fontWeight={600} textAlign="center">
          Password Reset Successful ✅
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mt={2}
          mb={3}
        >
          You can now login with your new password.
        </Typography>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          onClick={() => navigate("/login")}
          sx={{
            py: 1.4,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: "none",
            borderColor: "#ea580c",
            color: "#ea580c",
            "&:hover": {
              borderColor: "#c2410c",
              backgroundColor: "rgba(234,88,12,0.04)",
            },
          }}
        >
          Back to Login
        </Button>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={8}
      sx={{
        width: 420,
        maxWidth: "90vw",
        p: 4,
        borderRadius: 3,
        mx: "auto",
        mt: 4,
      }}
    >
      <Typography variant="h5" fontWeight={600} textAlign="center">
        Reset Password 🔒
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        mt={1}
        mb={3}
      >
        Enter your new password below
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="New Password"
          type="password"
          margin="normal"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters" },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{
            mt: 3,
            py: 1.4,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: "none",
            backgroundColor: "#ea580c",
            "&:hover": { backgroundColor: "#c2410c" },
          }}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </Box>
    </Paper>
  );
}
