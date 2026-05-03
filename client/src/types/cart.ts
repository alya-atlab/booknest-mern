type CartItem = {
    _id: string;
  bookId: {
    _id: string;
    title: string;
    price: number;
    author: string;
    coverImage: string;
  };
  quantity: number;
};

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
}
