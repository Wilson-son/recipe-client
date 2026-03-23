import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Link,
} from "@mui/material";

export default function LoginForm() {
  const navigate = useNavigate();
  const [showResend, setShowResend] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    getValues,
  } = useForm();

  const onSubmit = async (data) => {
    setShowResend(false);
    setResendMsg("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        data,
      );
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.msg;

      if (status === 403) {
        //  Email not verified — show the real message + resend button
        setError("root", {
          type: "manual",
          message: msg || "Please verify your email before logging in.",
        });
        if (err.response?.data?.resendAvailable) {
          setShowResend(true);
          setResendEmail(data.email);
        }
      } else {
        setError("root", {
          type: "manual",
          message: msg || "Invalid email or password",
        });
      }
    }
  };

  const handleResend = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/resend-verification`,
        {
          email: resendEmail,
        },
      );
      setResendMsg("Verification email sent! Please check your inbox.");
      setShowResend(false);
    } catch (err) {
      setResendMsg("Failed to resend. Please try again.");
    }
  };

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
        Welcome Back
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        mt={1}
        mb={3}
      >
        Login to continue sharing recipes
      </Typography>

      {errors.root && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.root.message}
        </Alert>
      )}

      {/* Resend verification button — shown only on 403 */}
      {showResend && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={handleResend}>
              Resend
            </Button>
          }
        >
          Email not verified. Resend verification email?
        </Alert>
      )}

      {/* Success message after resend */}
      {resendMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {resendMsg}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          autoComplete="email"
          {...register("email", {
            required: "Email is required",
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          autoComplete="current-password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
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
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>

        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={() => navigate("/forgot-password")}
          sx={{
            display: "block",
            mt: 2,
            textDecoration: "none",
            color: "#ea580c",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Forgot Password?
        </Link>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mt={3}
        >
          Don't have an account?{" "}
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={() => navigate("/register")}
            sx={{
              fontWeight: 600,
              textDecoration: "none",
              color: "#ea580c",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Create one
          </Link>
        </Typography>
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        mt={2}
      >
        Test: <strong>demo@recipeapp.com</strong> / <strong>demo@123</strong>
      </Typography>
    </Paper>
  );
}
