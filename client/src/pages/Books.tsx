import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Book } from "../types/book";
import axios from "axios";
import {
  Alert,
  Box,
  Container,
  Grid,
  Skeleton,
  Snackbar,
  Typography,
  type SnackbarCloseReason,
} from "@mui/material";
import BookCard from "../components/books/BookCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext";

const Books = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  useEffect(() => {
    const getBooks = async () => {
      try {
        setLoading(true);

        const res = await api.get("/books");

        setBooks(res.data.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Something went wrong");
        } else {
          setError("Unexpected error");
        }
      } finally {
        setLoading(false);
      }
    };
    getBooks();
  }, []);
  const onAddToCart = async (bookId: string) => {
    if (!isAuthenticated) {
      return navigate("/login", { replace: true });
    }
    try {
      await api.post("/cart", {
        bookId,
      });
      setSnackbar({
        open: true,
        message: "Book added successfully",
        severity: "success",
      });
    } catch (error) {
      let errorMessage = "";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || "Something went wrong";
      } else {
        errorMessage = "Something went wrong";
      }
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
  };
  const onOpenDetails = (bookId: string) => {
    console.log(bookId);
  };
  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  if (loading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Grid key={`sk-${i}`} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Box sx={{ height: "100%" }}>
              <Skeleton variant="rectangular" height={220} />
              <Box sx={{ p: 2 }}>
                <Skeleton width="80%" />
                <Skeleton width="60%" />
                <Skeleton width="40%" />
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Skeleton width={60} />
                  <Skeleton width={80} />
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }
  if (error) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }
  if (books.length === 0) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h6">No books found</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4, marginTop: 8 }}>
      <Grid container spacing={2}>
        {books.map((book) => (
          <Grid key={book._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <BookCard
              book={book}
              onAddToCart={onAddToCart}
              onOpenDetails={onOpenDetails}
            />
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
export default Books;
