import { useNavigate } from "react-router-dom";
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
  Link,
} from "@mui/material";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        { email: data.email },
      );
      setEmailSent(true);
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.msg;

      if (status === 404) {
        // Email not registered
        setError("email", {
          message:
            "No account found with this email. Please register or check your email address.",
        });
      } else {
        setError("root", {
          message: msg || "Failed to send reset email. Please try again.",
        });
      }
    }
  };

  if (emailSent) {
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
          Check Your Email 📧
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mt={2}
          mb={3}
        >
          We've sent a password reset link to your email address. Please check
          your inbox and follow the instructions.
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
              backgroundColor: "rgba(234, 88, 12, 0.04)",
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
        Forgot Password? 🔒
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        mt={1}
        mb={3}
      >
        Enter your email and we'll send you a reset link
      </Typography>

      {errors.root && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.root.message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          error={!!errors.email}
          helperText={
            errors.email?.message ||
            (errors.email?.type === "manual" ? (
              <span>
                {errors.email.message}{" "}
                <span
                  onClick={() => navigate("/register")}
                  style={{
                    color: "#ea580c",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Register here
                </span>
              </span>
            ) : null)
          }
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        {errors.email?.message?.includes("No account found") && (
          <Alert
            severity="warning"
            sx={{ mt: 1, borderRadius: 2 }}
            action={
              <Button
                size="small"
                onClick={() => navigate("/register")}
                sx={{
                  color: "#ea580c",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Register
              </Button>
            }
          >
            Account not found.{" "}
            <strong>Please register or use the correct email.</strong>
          </Alert>
        )}

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
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={() => navigate("/login")}
            sx={{
              textDecoration: "none",
              color: "#ea580c",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Back to Login
          </Link>
        </Box>
      </Box>
    </Paper>
  );
}
