import React from "react";
import Navbar from "../../components/shared/organisms/navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PoolsPage from "../pools-page";

export default () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<PoolsPage />} />
      </Routes>
    </BrowserRouter>
  );
};
