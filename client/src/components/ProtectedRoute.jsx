import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../state/usersSlice";
import { HideLoading, ShowLoading } from "../state/alertSlice";
import DefaultLayout from "./DefaultLayout";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateToken = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        "/api/users/get-user-by-id",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        dispatch(HideLoading());
        dispatch(SetUser(response.data.data));
      } else {
        dispatch(HideLoading());
        localStorage.removeItem("token");
        navigate("/login");
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      localStorage.removeItem("token");
      navigate("/login");
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
    } else {
      navigate("/login");
    }
  }, []);

  return <div>{user && <DefaultLayout>{children}</DefaultLayout>}</div>;
};

export default ProtectedRoute;
