import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Alert,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/verify-email/${token}`,
        );
        setStatus("success");
        setMsg(res.data.msg);
      } catch (err) {
        setStatus("error");
        setMsg(
          err.response?.data?.msg ||
            "Verification failed. Link may have expired.",
        );
      }
    };

    verify();
  }, [token]);

  return (
    <Paper
      elevation={8}
      sx={{
        width: 420,
        maxWidth: "90vw",
        p: 4,
        borderRadius: 3,
        mx: "auto",
        mt: 8,
        textAlign: "center",
      }}
    >
      {status === "loading" && (
        <>
          <CircularProgress sx={{ color: "#ea580c", mb: 2 }} />
          <Typography variant="h6">Verifying your email...</Typography>
        </>
      )}

      {status === "success" && (
        <>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Email Verified! ✅
          </Typography>
          <Alert severity="success" sx={{ mb: 3 }}>
            {msg}
          </Alert>
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
        </>
      )}

      {status === "error" && (
        <>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Verification Failed ❌
          </Typography>
          <Alert severity="error" sx={{ mb: 3 }}>
            {msg}
          </Alert>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate("/login")}
            sx={{
              py: 1.4,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              borderColor: "#ea580c",
              color: "#ea580c",
            }}
          >
            Back to Login
          </Button>
        </>
      )}
    </Paper>
  );
}
