import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import { UserContext } from "../../../App";
import User from "./user";
import Contacts from "../Public routes/Contacts/Contacts";
import ProtectedArea from "./ProtectedArea";

const ProtectedRoute = () => {
  const { isUserAuthenticated } = useContext(UserContext);
  
  return (
    isUserAuthenticated ? (
      <Route path="/user" element={<User />} />
    ) : (
      <Route path="/protectedArea" element={<ProtectedArea />}/>
    )
  );
};

export default ProtectedRoute;
