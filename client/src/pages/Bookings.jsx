import React, { useEffect, useRef, useState } from "react";
import PageTitle from "../components/PageTitle";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../state/alertSlice";
import { Modal, Table, message } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";
import {useReactToPrint} from 'react-to-print';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const dispatch = useDispatch();

  const getBookings = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        "/api/bookings/get-bookings-by-user-id"
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
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div>
          <button
            onClick={() => {
              setSelectedBooking(record);
              setShowPrintModal(true);
            }}
            className="outline-btn underline"
          >
            Print Ticket
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBookings();
  }, []);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })
  return (
    <div>
      <PageTitle title="Bookings" />
      <div className="mt-2">
      <Table dataSource={bookings} columns={columns} />
      </div>

      {showPrintModal && <Modal
        title="Print Ticket"
        footer={false}
        onCancel={() => {
          setShowPrintModal(!showPrintModal);
          setSelectedBooking(null);
        }}
        open={showPrintModal}
      >
        <div ref={componentRef} className="d-flex flex-column p-5">
          <h1 className="text-lg ">{selectedBooking?.name}</h1>
          <h1 className="text-md text-secondary">{selectedBooking?.from} - {selectedBooking?.to}</h1>
          <hr />
          <h1 className="text-md mb-2">Date: {selectedBooking?.journeyDate}</h1>
          <h1 className="text-md mb-2">Departure: {selectedBooking?.departure}</h1>
          <h1 className="text-md mb-2">Arrival: {selectedBooking?.arrival}</h1>
          <hr />
          <h1 className="text-md mb-2">Seats Booked </h1>
          <h1 className="text-md">{selectedBooking?.seats.join(", ")}</h1>
          <hr />
          <h1 className="text-md">Total Amount</h1>
          <h1 className="text-lg">₦{selectedBooking.fare * selectedBooking.seats.length}</h1>
        </div>
        <div className="d-flex justify-content-end">
            <button
            onClick={handlePrint} 
            className="primary-btn">Print</button>
            </div>
      </Modal>}
    </div>
  );
};

export default Bookings;
