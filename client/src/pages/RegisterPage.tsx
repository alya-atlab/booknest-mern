import {
  Box,
  Button,
  Container,
  FormHelperText,
  Typography,
  Link,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React, { useState } from "react";
import type { RegisterForm } from "../types/registerForm";
import { ErrorOutlined } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
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

const RegisterPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);

  const [form, setForm] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{
    confirmPassword?: string;
    email?: string;
    password?: string;
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

  const validatePassword = (password: string): string | undefined => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must include an uppercase letter";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must include a lowercase letter";
    }

    if (!/[0-9]/.test(password)) {
      return "Password must include a number";
    }

    if (!/[!@#$%^&*]/.test(password)) {
      return "Password must include a special character";
    }

    return undefined;
  };

  const handleChange =
    (key: keyof RegisterForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));

      setErrors((prev) => ({
        ...prev,
        [key]: undefined,
        general: undefined,
      }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      form.firstName === "" ||
      form.lastName === "" ||
      form.email === "" ||
      form.password === "" ||
      form.confirmPassword === ""
    ) {
      setErrors({
        general: "Please enter all required fields",
      });

      return;
    }

    const passwordError = validatePassword(form.password);

    if (passwordError) {
      setErrors({
        password: passwordError,
      });

      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrors({
        confirmPassword: "Passwords do not match",
      });

      return;
    }

    setErrors({});
    try {
      const res = await api.post("/auth/register", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", res.data.data.token);
      navigate("/", { replace: true });
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
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
        Sign Up
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
          <InputLabel htmlFor="first-name-input">First Name</InputLabel>

          <OutlinedInput
            id="first-name-input"
            type="text"
            label="First Name"
            value={form.firstName}
            onChange={handleChange("firstName")}
          />
        </FormControl>

        <FormControl sx={inputStyles} variant="outlined">
          <InputLabel htmlFor="last-name-input">Last Name</InputLabel>

          <OutlinedInput
            id="last-name-input"
            type="text"
            label="Last Name"
            value={form.lastName}
            onChange={handleChange("lastName")}
          />
        </FormControl>

        <FormControl
          error={Boolean(errors.email)}
          sx={inputStyles}
          variant="outlined"
        >
          <InputLabel htmlFor="email-input">Email</InputLabel>

          <OutlinedInput
            id="email-input"
            type="email"
            label="Email"
            value={form.email}
            onChange={handleChange("email")}
          />

          <FormHelperText>{errors.email}</FormHelperText>
        </FormControl>

        <FormControl
          error={Boolean(errors.password)}
          sx={inputStyles}
          variant="outlined"
        >
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

          <FormHelperText>{errors.password}</FormHelperText>
        </FormControl>

        <FormControl
          error={Boolean(errors.confirmPassword)}
          sx={inputStyles}
          variant="outlined"
        >
          <InputLabel htmlFor="confirm-password-input">
            Confirm Password
          </InputLabel>

          <OutlinedInput
            id="confirm-password-input"
            type={showPassword ? "text" : "password"}
            label="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
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

          <FormHelperText>{errors.confirmPassword}</FormHelperText>
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
          Sign Up
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
        Already have an account?{" "}
        <Link
          component={RouterLink}
          to="/login"
          sx={{
            color: "#000000be",
            textDecoration: "none",
            fontWeight: 500,

            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Login
        </Link>
      </Typography>
    </Container>
  );
};

export default RegisterPage;
