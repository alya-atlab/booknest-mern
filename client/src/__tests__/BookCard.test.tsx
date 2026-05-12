import { render, screen } from "@testing-library/react";
import BookCard from "../components/books/BookCard";
import type { Book } from "../types/book";
import userEvent from "@testing-library/user-event";
const createMockBook = (stock = 5) => {
  const mockBook: Book = {
    _id: "1",
    title: "Atomic Habits",
    description: "A book about habits",
    price: 20,
    stock,
    coverImage: "/test-image.jpg",
    author: {
      _id: "2",
      firstName: "James",
      lastName: "Clear",
    },
  };
  return mockBook;
};

describe("BookCard", () => {
  it("renders the book title", () => {
    const mockBook = createMockBook();

    render(<BookCard book={mockBook} onAddToCart={vi.fn()} />);

    expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
  });
  it("should disable add to cart button when book is out of stock", () => {
    const mockBook = createMockBook(0);
    render(<BookCard book={mockBook} onAddToCart={vi.fn()} />);

    expect(screen.getByText("OUT OF STOCK")).toBeInTheDocument();

    const button = screen.getByRole("button", {
      name: /add to cart/i,
    });
    expect(button).toBeDisabled();
  });
  it("should call onAddToCart with book id when add to cart button is clicked", async () => {
    const mockBook = createMockBook();
    const user = userEvent.setup();
    const onAddToCart = vi.fn();
    render(<BookCard book={mockBook} onAddToCart={onAddToCart} />);

    const button = screen.getByRole("button", {
      name: /add to cart/i,
    });
    await user.click(button);

    expect(onAddToCart).toHaveBeenCalledWith("1");
  });
  it("should call onOpenDetails with book id when CartActionArea clicked", async () => {
    const mockBook = createMockBook();
    const user = userEvent.setup();
    const onOpenDetails = vi.fn();
    render(
      <BookCard
        book={mockBook}
        onAddToCart={vi.fn()}
        onOpenDetails={onOpenDetails}
      />,
    );

    const card = screen.getByRole("button", {
      name: /Atomic Habits/i,
    });
    await user.click(card);

    expect(onOpenDetails).toHaveBeenCalledWith("1");
  });
  it("should not call onOpenDetails when add to cart button is clicked", async () => {
    const mockBook = createMockBook();
    const user = userEvent.setup();
    const onOpenDetails = vi.fn();
    render(
      <BookCard
        book={mockBook}
        onAddToCart={vi.fn()}
        onOpenDetails={onOpenDetails}
      />,
    );

    const button = screen.getByRole("button", {
      name: /add to cart/i,
    });
    await user.click(button);

    expect(onOpenDetails).not.toHaveBeenCalled();
  });
});
