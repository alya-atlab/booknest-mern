import { useEffect, useState } from "react";
import type { Book } from "../types/book";
import api from "../api/axios";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  Link,
  Skeleton,
  Typography,
} from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const BookDetailsPage = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { id } = useParams();
  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (!id) return;
        setLoading(true);

        const res = await api.get(`/books/${id}`);

        setBook(res.data.data);
        console.log(res.data.data);
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
    fetchBook();
  }, [id]);
  if (loading) {
    return (
      <Grid container spacing={2}>
        <Box
          sx={{
            height: "100%",
            m: 3,
            display: "flex",
            justifyContent: "flex-start",
            alignContent: "center",
            width: "100%",
          }}
        >
          <Skeleton variant="rectangular" height={320} sx={{ width: "30%" }} />
          <Box sx={{ p: 3, width: "40%" }}>
            <Skeleton width="80%" sx={{ p: 2 }} />
            <Skeleton width="60%" />
            <Skeleton width="50%" />
            <Skeleton width="45%" />
            <Skeleton width="40%" />
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
                width: "40%",
              }}
            >
              <Skeleton width={60} sx={{ p: 2 }} />
              <Skeleton width={80} />
            </Box>
          </Box>
        </Box>
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
  if (!book) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h6">Book not found</Typography>
      </Container>
    );
  }

  return (
    <Grid container spacing={2} sx={{ mt: 3, ml: 6, pl: 4 }}>
      <Box
        sx={{
          height: "100%",
          m: 3,
          display: "flex",
          justifyContent: "flex-start",
          alignContent: "center",
          width: "100%",
          gap: 3,
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: {
              xs: "100%",
              md: 240,
            },
            height: 360,
            objectFit: "cover",
            opacity: book.stock <= 0 ? 0.8 : 1,
            borderRadius: 2,
            mr: 4,
            boxShadow: `
          0 10px 20px rgba(0,0,0,0.25),
          0 6px 6px rgba(0,0,0,0.18),
          inset 0 1px 1px rgba(255,255,255,0.15)
        `,
           
          }}
          image={book.coverImage}
          alt={book.title}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/fallback-book.jpg";
          }}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 500 }}>
            {book.title}
          </Typography>
          <Typography sx={{ display: "flex", gap: 1, m: 1 }}>
            By
            <Link sx={{ color: "#BB6A2C" }} href="#" underline="none">
              {book.author.firstName} {book.author.lastName}
            </Link>
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 550, m: 1 }}>
            ${book.price}
          </Typography>
          <Box sx={{ fontWeight: 500, m: 1 }}>
            {book.stock <= 0 ? (
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: 1,
                  color: "#c62828",
                }}
              >
                <HighlightOffTwoToneIcon />
                Out of stock
              </Typography>
            ) : (
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Typography
                  component="span"
                  color="success"
                  sx={{ display: "flex", justifyContent: "flex-start", gap: 1 }}
                >
                  <TaskAltIcon /> In stock
                </Typography>
                <FiberManualRecordIcon sx={{ fontSize: 7 }} /> {book.stock}{" "}
                copies avaiable
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              mt: 3,
              mb: 3,
              display: "flex",
              justifyContent: "flex-start",
              gap: 1,
            }}
          >
            <Button
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                gap: 1,
                color: "#fff",
                backgroundColor: "#BB6A2C",
                pt: 1.5,
                pb: 1.5,
                pr: 4,
                pl: 4,
                fontSize: 13,
              }}
              disabled={book.stock <= 0}
            >
              <ShoppingCartIcon />
              Add to Cart
            </Button>
            <Button
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                gap: 1,
                color: "#000000",
                pt: 1.5,
                pb: 1.5,
                pr: 4,
                pl: 4,
                fontSize: 13,
                border: "1px #494848 solid",
              }}
            >
              <FavoriteBorderIcon />
              Add to Wishlist
            </Button>
          </Box>
          <Divider sx={{ borderColor: "#706c6c" }} />
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Description
            </Typography>
            <Typography>{book.description}</Typography>
          </Box>
        </CardContent>
      </Box>
    </Grid>
  );
};
export default BookDetailsPage;
