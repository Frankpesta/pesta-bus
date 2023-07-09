import React, { useEffect, useRef, useState } from "react";
import PageTitle from "../../components/PageTitle";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../state/alertSlice";
import { Modal, Table, message } from "antd";
import { axiosInstance } from "../../helpers/axiosInstance";
import {useReactToPrint} from 'react-to-print';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const dispatch = useDispatch();

  const getBookings = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        "/api/bookings/get-all-bookings"
      );
      dispatch(HideLoading());
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
          return {
            ...booking,
            ...booking.bus,
            key: booking._id,
          };
        });
        setBookings(mappedData);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Bus Name",
      dataIndex: "name",
      key: "bus",
    },
    {
      title: "Bus Number",
      dataIndex: "number",
      key: "bus",
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
      key: "bus",
    },
    {
      title: "Departure Time",
      dataIndex: "departure",
    },
    {
      title: "Seats",
      dataIndex: "seats",
      render: (seats) => {
        return seats.join(", ");
      }
    },
  ];

  useEffect(() => {
    getBookings();
  }, []);


  return (
    <div>
      <PageTitle title="Admin Bookings" />
      <div className="mt-2">
      <Table dataSource={bookings} columns={columns} />
      </div>
    </div>
  );
};

export default AdminBookings;
