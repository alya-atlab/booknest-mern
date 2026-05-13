import { render, screen } from "@testing-library/react";
import BookDetailsPage from "../pages/BookDetailsPage";
import api from "../api/axios.ts";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("../context/Cart/CartContext", () => ({
  useCart: () => ({
    addToCart: vi.fn(),
  }),
}));
vi.mock("../context/Auth/AuthContext", () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

describe("BookDetailsPage", () => {
  it("renders loading skeletons while fetching book", () => {
    vi.spyOn(api, "get").mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={["/books/1"]}>
        <Routes>
          <Route path="/books/:id" element={<BookDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("book-details-skeleton")).toBeInTheDocument();
  });
  it("renders error when fail request", async () => {
    vi.spyOn(api, "get").mockRejectedValue({
      isAxiosError: true,
      response: {
        data: {
          message: "Book not found",
        },
      },
    });

    render(
      <MemoryRouter initialEntries={["/books/1"]}>
        <Routes>
          <Route path="/books/:id" element={<BookDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Book not found")).toBeInTheDocument();
  });
  it("renders the book", async () => {
    vi.spyOn(api, "get").mockResolvedValue({
      data: {
        data: {
          _id: "1",
          title: "Atomic Habits",
          description: "A book about habits",
          price: 20,
          stock: 5,
          coverImage: "/test-image.jpg",
          author: {
            _id: "2",
            firstName: "James",
            lastName: "Clear",
          },
        },
      },
    });
    render(
      <MemoryRouter initialEntries={["/books/1"]}>
        <Routes>
          <Route path="/books/:id" element={<BookDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText("Atomic Habits")).toBeInTheDocument();
    expect(screen.getByText(/James Clear/i)).toBeInTheDocument();
    expect(screen.getByText("$20")).toBeInTheDocument();
  });
  it("should disable add to cart button when book is out of stock", async () => {
    vi.spyOn(api, "get").mockResolvedValue({
      data: {
        data: {
          _id: "1",
          title: "Atomic Habits",
          description: "A book about habits",
          price: 20,
          stock: 0,
          coverImage: "/test-image.jpg",
          author: {
            _id: "2",
            firstName: "James",
            lastName: "Clear",
          },
        },
      },
    });
    render(
      <MemoryRouter initialEntries={["/books/1"]}>
        <Routes>
          <Route path="/books/:id" element={<BookDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText(/out of stock/i)).toBeInTheDocument();
    expect(screen.getByText("Out of stock")).toBeInTheDocument();

    const button = screen.getByRole("button", {
      name: /add to cart/i,
    });
    expect(button).toBeDisabled();
  });
});
