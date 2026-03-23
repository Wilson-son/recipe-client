import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Link,
} from "@mui/material";

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...registrationData } = data;

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        registrationData,
      );

      
      setSuccessMsg(res.data.msg);
    } catch (err) {
      setError("root", {
        message:
          err.response?.data?.msg ||
          "Registration failed. Please try again.",
      });
    }
  };


  if (successMsg) {
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
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight={600} mb={2}>
          Check your email! 📧
        </Typography>
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
        <Typography variant="body2" color="text.secondary" mb={3}>
          We sent a verification link to your email address. Click the link to
          activate your account, then come back to login.
        </Typography>
        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate("/login")}
          sx={{
            py: 1.4,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: "none",
            backgroundColor: "#ea580c",
            "&:hover": { backgroundColor: "#c2410c" },
          }}
        >
          Go to Login
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
        Join Us!
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        mt={1}
        mb={3}
      >
        Create your account to start sharing recipes
      </Typography>

      {errors.root && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.root.message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
          {...register("username", {
            required: "Full name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
          error={!!errors.username}
          helperText={errors.username?.message}
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          autoComplete="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email address",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          autoComplete="new-password"
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

        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          autoComplete="new-password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        <Button
          type="submit"
          fullWidth
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
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mt={3}
        >
          Already have an account?{" "}
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={() => navigate("/login")}
            sx={{
              fontWeight: 600,
              textDecoration: "none",
              color: "#ea580c",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Go To Login
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
}
