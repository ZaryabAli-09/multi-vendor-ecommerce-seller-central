import React from "react";
import { useSelector } from "react-redux";

const Overview = () => {
  const { user } = useSelector((state) => state.auth);
  return <div>Overview</div>;
};

export default Overview;
