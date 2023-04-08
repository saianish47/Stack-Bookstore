import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { BookItem } from "../models/types";

interface BookProviderProps {
  children: React.ReactNode;
  categoryName: string;
}

interface BooksContextValue {
  books: BookItem[];
  updateBooks: (categoryName: string) => void;
}

export const BooksContext = React.createContext<BooksContextValue>({
  books: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateBooks: () => {},
});

function BooksProvider({ children, categoryName = "" }: BookProviderProps) {
  const [books, setBooks] = useState([]);
  const updateBooks = async (categoryName: string) => {
    try {
      const books = await axios
        .get(`/api/categories/name/${categoryName}/books`)
        .then((Response) => Response.data);
      setBooks(books);
    } catch (error) {
      console.error(`an error occured ${error}`);
    }
  };
  useEffect(() => {
    updateBooks(categoryName);
  }, [categoryName]);
  return (
    <BooksContext.Provider value={{ books, updateBooks }}>
      {children}
    </BooksContext.Provider>
  );
}

export default BooksProvider;
