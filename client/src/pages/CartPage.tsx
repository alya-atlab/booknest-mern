import { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  IconButton,
  Skeleton,
  Snackbar,
  Typography,
  type SnackbarCloseReason,
} from "@mui/material";
import { AddCircle, Delete, RemoveCircle } from "@mui/icons-material";
import { useCart } from "../context/Cart/CartContext";

const CartPage = () => {
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<
    "increment" | "decrement" | "remove" | null
  >(null);
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState(false);
  const {
    cart,
    isLoading,
    error,
    updateItemInCart,
    removeItemInCart,
    checkout,
  } = useCart();
  useEffect(() => {}, []);

  const handleChangeQuantity = async (
    bookId: string,
    newQuantity: number,
    action: "increment" | "decrement",
  ) => {
    if (newQuantity < 0) {
      return;
    }
    try {
      setLoadingItemId(bookId);
      setLoadingAction(action);
      await updateItemInCart(bookId, newQuantity);
    } catch (error) {
      handleApiError(error, "Failed to update quantity");
    } finally {
      setLoadingItemId(null);
      setLoadingAction(null);
    }
  };
  const handleRemove = async (bookId: string) => {
    try {
      setLoadingItemId(bookId);
      setLoadingAction("remove");
      await removeItemInCart(bookId);
    } catch (error) {
      handleApiError(error, "Failed to remove item");
    } finally {
      setLoadingItemId(null);
      setLoadingAction(null);
    }
  };

  const handleCheckout = async () => {
    setBackdropOpen(true);
    try {
      await checkout();

      setSuccessOrder(true);
    } catch (error) {
      handleApiError(error, "Checkout failed. Please try again.");
    } finally {
      setBackdropOpen(false);
    }
  };

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    setSuccessOrder(false);
  };
  const handleApiError = (
    error: unknown,
    fallbackMessage = "Something went wrong",
  ) => {
    let message = fallbackMessage;

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || fallbackMessage;
    } else {
      message = fallbackMessage;
    }

    setSnackbarMessage(message);
    setOpen(true);
  };

  if (isLoading && !cart) {
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
        <Snackbar
          open={successOrder}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Your order created successfully
          </Alert>
        </Snackbar>
      </Container>
    );
  }
  const totalAmount = cart.items.reduce((acc, curr) => {
    return acc + curr.bookId.price * curr.quantity;
  }, 0);
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
          p: 4,
          boxShadow: 3,
        }}
      >
        {cart.items.map((item) => (
          <Box
            key={item._id}
            sx={{
              width: "95%",
              mt: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 2,
              p: 1,
              boxShadow: 3,
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
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                  {item.bookId.title}
                </Typography>
                <Typography variant="subtitle2" color="#5b5a5a">
                  ${item.bookId.price.toFixed(2)}
                </Typography>
              </CardContent>
            </Box>
            <Box
              sx={{
                color: "#343232",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: 1,
                borderRadius: 2,
              }}
            >
              <Button
                onClick={() => {
                  handleChangeQuantity(
                    item.bookId._id,
                    item.quantity + 1,
                    "increment",
                  );
                }}
                disabled={loadingItemId === item.bookId._id}
              >
                {loadingItemId === item.bookId._id &&
                loadingAction === "increment" ? (
                  <CircularProgress
                    aria-label="Loading…"
                    size={16}
                    color="inherit"
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <AddCircle fontSize="small" sx={{ color: "#343232" }} />
                  </Box>
                )}
              </Button>
              <Typography sx={{ fontSize: 20 }}>{item.quantity}</Typography>
              <Button
                onClick={() => {
                  handleChangeQuantity(
                    item.bookId._id,
                    item.quantity - 1,
                    "decrement",
                  );
                }}
                disabled={loadingItemId === item.bookId._id}
              >
                {loadingItemId === item.bookId._id &&
                loadingAction === "decrement" ? (
                  <CircularProgress
                    aria-label="Loading…"
                    size={16}
                    color="inherit"
                  />
                ) : (
                  <RemoveCircle fontSize="small" sx={{ color: "#343232" }} />
                )}
              </Button>
            </Box>
            <Box
              sx={{
                color: "#343232",
                display: "flex",
                gap: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                ${(item.quantity * item.bookId.price).toFixed(2)}
              </Typography>
              {loadingItemId === item.bookId._id &&
              loadingAction === "remove" ? (
                <CircularProgress
                  aria-label="Loading…"
                  size={16}
                  color="inherit"
                />
              ) : (
                <IconButton
                  onClick={() => {
                    handleRemove(item.bookId._id);
                  }}
                  disabled={loadingItemId === item.bookId._id}
                >
                  <Delete color="inherit" />
                </IconButton>
              )}
            </Box>
          </Box>
        ))}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            m: 3,
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            Total Amount: ${totalAmount.toFixed(2)}
          </Typography>
          <Button
            size="large"
            variant="contained"
            sx={{ backgroundColor: "#333", opacity: backdropOpen ? 0.7 : 1 }}
            onClick={handleCheckout}
            disabled={backdropOpen}
          >
            Check Out
          </Button>
        </Box>
      </Card>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={snackbarMessage}
      />
      <Backdrop
        sx={(theme) => ({ color: "#0e0d0d", zIndex: theme.zIndex.drawer + 1 })}
        open={backdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default CartPage;
