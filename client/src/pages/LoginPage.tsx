import { Box, Button, Container, Link, Typography } from "@mui/material";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ErrorOutlined } from "@mui/icons-material";

import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import type { LoginForm } from "../types/loginForm";

import api from "../api/axios";

import { useNavigate } from "react-router-dom";
import axios from "axios";

const inputStyles = {
  m: 1,
  width: "35ch",

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#999",
  },

  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#333",
  },

  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#000",
    borderWidth: 2,
  },

  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
  },
};

const LoginPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    general?: string;
  }>({});

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleChange =
    (key: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));

      setErrors((prev) => ({
        ...prev,
        general: undefined,
      }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.email.trim() === "" || form.password.trim() === "") {
      setErrors({
        general: "Please enter your email and password",
      });

      return;
    }
    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", res.data.data.token);

      navigate("/", { replace: true });
      setErrors({});

      setForm({
        email: "",
        password: "",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrors({ general: error.response?.data?.message });
      } else {
        setErrors({
          general: "Something went wrong",
        });
      }
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Sign In
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
          p: 3,
          boxShadow: 5,
        }}
      >
        <FormControl sx={inputStyles} variant="outlined">
          <InputLabel htmlFor="email-input">Email</InputLabel>

          <OutlinedInput
            id="email-input"
            type="email"
            label="Email"
            value={form.email}
            onChange={handleChange("email")}
          />
        </FormControl>

        <FormControl sx={inputStyles} variant="outlined">
          <InputLabel htmlFor="password-input">Password</InputLabel>

          <OutlinedInput
            id="password-input"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={form.password}
            onChange={handleChange("password")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  aria-label={showPassword ? "hide password" : "show password"}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <Button
          type="submit"
          variant="outlined"
          sx={{
            m: 1,
            width: "40ch",
            borderColor: "#999",
            color: "#345",
            borderRadius: 2,

            "&:hover": {
              borderColor: "#333",
              backgroundColor: "transparent",
            },

            "&.Mui-focusVisible": {
              borderColor: "#000",
              borderWidth: 2,
            },
          }}
        >
          Sign In
        </Button>

        {errors.general && (
          <Box
            sx={{
              color: "error.main",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ErrorOutlined fontSize="small" />

            <Typography variant="body2">{errors.general}</Typography>
          </Box>
        )}
      </Box>

      <Typography
        sx={{
          color: "#000000be",
          fontSize: 20,
          mt: 3,
        }}
      >
        Don't have an account?{" "}
        <Link
          component={RouterLink}
          to="/register"
          sx={{
            color: "#000000be",
            textDecoration: "none",
            fontWeight: 500,

            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Sign Up
        </Link>
      </Typography>
    </Container>
  );
};

export default LoginPage;
