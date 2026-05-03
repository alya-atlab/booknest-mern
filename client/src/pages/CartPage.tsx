import { useEffect, useState } from "react";
import type { Cart } from "../types/cart";
import api from "../api/axios";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Skeleton,
  Typography,
} from "@mui/material";

const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getCart = async () => {
      try {
        setLoading(true);

        const res = await api.get("/cart");
        console.log(res.data.data);
        setCart(res.data.data);
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
    getCart();
  }, []);
  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Skeleton width="60%" height={100} />
        <Skeleton width="60%" height={100} />
        <Skeleton width="60%" height={100} />
        <Skeleton width="60%" height={100} />
      </Container>
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
  if (!cart) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Cannot find cart
        </Typography>
      </Container>
    );
  }
  if (cart.items.length === 0) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Typography
          sx={{
            fontSize: 50,
          }}
        >
          Cart is empty!
        </Typography>
      </Container>
    );
  }
  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        My Cart
      </Typography>
      <Card
        sx={{
          width: "80%",
          mt: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
          p: 6,
          boxShadow: 5,
        }}
      >
        {cart.items.map((item) => (
          <Box
            key={item._id}
            sx={{
              width: "90%",
              mt: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 2,
              p: 3,
              boxShadow: 5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                maxWidth: 200,
              }}
            >
              <CardMedia
                component="img"
                image={item.bookId.coverImage}
                alt={item.bookId.title}
                loading="lazy"
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: "contain",
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/fallback-book.jpg";
                }}
              />
              <CardContent>
                <Typography variant="subtitle1" noWrap>
                  {item.bookId.title}
                </Typography>
                <Typography variant="subtitle1" color="#5b5a5a">
                  ${item.bookId.price.toFixed(2)}
                </Typography>
              </CardContent>
            </Box>
          </Box>
        ))}
      </Card>
    </Container>
  );
};

export default CartPage;
