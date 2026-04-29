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
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardActionArea onClick={() => onOpenDetails?.(book._id)}>
        <CardMedia
          component="img"
          sx={{ height: 220, objectFit: "contain" }}
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

        <Button variant="contained" size="small" onClick={handleAdd}>
          Add
        </Button>
      </Box>
    </Card>
  );
};

export default BookCard;
