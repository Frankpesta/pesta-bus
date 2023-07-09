import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Row, message } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";
import { ShowLoading, HideLoading } from "../state/alertSlice";
import { useNavigate, useParams } from "react-router-dom";
import SeatSelection from "../components/SeatSelection";
import StripeCheckout from "react-stripe-checkout";

const BookNow = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const [bus, setBus] = useState([]);
  const [selectedSeats, setselectedSeats] = useState([]);

  const getBus = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/buses/get-bus-by-id", {
        _id: params.id,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        setBus(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const bookNow = async (transactionId) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/bookings/book-seat", {
        bus: bus._id,
        seats: selectedSeats,
        transactionId
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate('/bookings');
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const onToken = async (token) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/bookings/make-payment", {
        token,
        amount: selectedSeats.length * bus.fare,
      });
      dispatch(HideLoading());

      if (response.data.success) {
        message.success(response.data.message);
        bookNow(response.data.data.transactionId)
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBus();
  }, []);

  return (
    <div>
      {bus && (
        <Row className="mt-3" gutter={20}>
          <Col lg={12} sm={24} xs={24}>
            <h1 className="text-lg text-primary">
              <b>{bus.name}</b>
            </h1>
            <h1 className="text-md">
              {bus.from} - {bus.to}
            </h1>
            <hr />

            <div className="d-flex flex-column gap-3">
              <h1 className="text-md">
                Journey Date: <b>{bus.journeyDate}</b>
              </h1>
              <h1 className="text-md">
                Departure Time: <b>{bus.departure}</b>
              </h1>
              <h1 className="text-md">
                Arrival Time: <b>{bus.arrival}</b>
              </h1>
              <h1 className="text-md">
                Capacity: <b>{bus.capacity}</b>
              </h1>
              <h1 className="text-md">
                Seats Left: <b>{bus.capacity - bus.seatsBooked?.length}</b>
              </h1>
              <h1 className="text-md">
                Fare: <b>₦{bus.fare}</b>
              </h1>
            </div>

            <hr />

            <div className="d-flex flex-column gap-3">
              <h1 className="text-lg">
                <b>Selected Seat Number(s)</b>: {selectedSeats.join(", ")}
              </h1>
              <h1 className="text-lg">
                Price: <b>₦{bus.fare * selectedSeats.length}</b>
              </h1>
              <hr />

              <StripeCheckout
                billingAddress
                token={onToken}
                amount={bus.fare * selectedSeats.length * 100}
                currency="NGN"
                stripeKey="pk_test_51LNv5PG0VAwtoqpKkAmQIvhYeSOtSwYyyM0A509kxMifRhgakQbo1hywkhGA9RYQtAHRObT6ihEXyhZ1lX2LFFyj00EVcbPzPz"
              >
                <button
                  disabled={selectedSeats.length === 0}
                  className={`secondary-btn ${
                    selectedSeats.length === 0 && "disabled-btn"
                  }`}
                >
                  Book Now
                </button>
              </StripeCheckout>
            </div>
          </Col>
          <Col lg={12} sm={24} xs={24}>
            <SeatSelection
              selectedSeats={selectedSeats}
              setSelectedSeats={setselectedSeats}
              bus={bus}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default BookNow;
