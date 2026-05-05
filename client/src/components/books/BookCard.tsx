import type { Book } from "../../types/book";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

type BookCardProps = {
  book: Book;
  onAddToCart: (bookId: string) => void;
  onOpenDetails?: (bookId: string) => void;
};

const BookCard = ({ book, onAddToCart, onOpenDetails }: BookCardProps) => {
  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onAddToCart(book._id);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardActionArea onClick={() => onOpenDetails?.(book._id)}>
        {book.stock <= 0 ? (
          <Typography
            sx={{
              px: 1.5,
              py: 0.5,
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "#f5efef",
              textAlign: "center",
              position: "absolute",
              zIndex: 2,
              letterSpacing: 2,
              width: "fit-content",
              top: "8px",
              left: "8px",
              borderRadius: 3,
              fontSize: 12,
              boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
              backdropFilter: "blur(5px)",
            }}
          >
            OUT OF STOCK
          </Typography>
        ) : (
          " "
        )}
        <CardMedia
          component="img"
          sx={{
            height: 220,
            objectFit: "contain",
            opacity: book.stock <= 0 ? 0.8 : 1,
          }}
          image={book.coverImage}
          alt={book.title}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/fallback-book.jpg";
          }}
        />
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
            {book.title}
          </Typography>
          <Typography noWrap>
            {book.description.length > 80
              ? `${book.description.slice(0, 80)}...`
              : book.description}
          </Typography>

          <Typography variant="body2" color="text.secondary" noWrap>
            {book.author.firstName} {book.author.lastName}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box
        sx={{
          mt: "auto",
          p: 2,
          pt: 0,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          ${book.price.toFixed(2)}
        </Typography>

        <Box sx={{ flex: 1 }} />

        <Button
          variant="contained"
          size="small"
          onClick={handleAdd}
          disabled={book.stock <= 0}
        >
          Add to Cart
        </Button>
      </Box>
    </Card>
  );
};

export default BookCard;
