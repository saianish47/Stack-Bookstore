import React from "react";
import { BookItem } from "../models/types";

interface BooksContextValue {
  books: BookItem[];
  updateBooks: (categoryName: string) => void;
}

const BooksContext = React.createContext<BooksContextValue>({
  books: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateBooks: () => {},
});

export { BooksContext };
