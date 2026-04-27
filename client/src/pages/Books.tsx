import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Book } from "../types/book";
import axios from "axios";
import { Box, Container, Typography } from "@mui/material";

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  if (loading) {
    return <Container>loading...</Container>;
  }
  if (error) {
    return <Container>{error}</Container>;
  }
  if (books.length === 0) {
    return <Container>No books found</Container>;
  }

  return (
    <Container sx={{ textAlign: "center" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        Books
      </Typography>
      {books.map((book) => {
        return (
          <Box key={book._id} sx={{ mb: 2 }}>
            <Typography> {book.title}</Typography>
            <Typography> {book.price}</Typography>
          </Box>
        );
      })}
    </Container>
  );
};
export default Books;
