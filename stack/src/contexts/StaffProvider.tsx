import React, { useState, useEffect } from "react";
import axios from "axios";
import { staffItem } from "../models/types";

interface StaffContextProps {
  staffList: staffItem[];
}

interface StaffProviderProps {
  children: React.ReactNode;
}
const StaffContext = React.createContext<StaffContextProps>({
  staffList: [],
});

function StaffContextProvider({ children }: StaffProviderProps) {
  const [staffList, setStaffList] = useState([]);

  const fetchStaffList = async () => {
    console.log("Getting the Featured Books");
    try {
      const response = await axios.get("/api/books/featured/all");
      setStaffList(response.data);
    } catch (error) {
      console.error(`An error occured while fetching staff list: ${error}`);
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, []);

  return (
    <StaffContext.Provider value={{ staffList }}>
      {children}
    </StaffContext.Provider>
  );
}

export { StaffContext, StaffContextProvider };
