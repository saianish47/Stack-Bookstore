import { useEffect, useState } from "react";
import { BooksContext } from "./BooksContext";
import axios from "axios";
import React from "react";

interface BookProviderProps {
  children: React.ReactNode;
  categoryName: string;
}

function BooksProvider({ children, categoryName = "" }: BookProviderProps) {
  const [books, setBooks] = useState([]);
  const updateBooks = async (categoryName: string) => {
    console.log(categoryName);
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
