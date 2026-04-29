type Author = {
  _id: string;
  firstName: string;
  lastName: string;
};

export interface Book {
  _id: string;
  title: string;
  price: number;
  description: string;
  coverImage: string;
  stock: number;
  author: Author;
}
