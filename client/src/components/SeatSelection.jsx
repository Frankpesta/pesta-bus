import { Col, Row } from "antd";
import React from "react";
import "../resources/bus.css";

const SeatSelection = ({ selectedSeats, setSelectedSeats, bus }) => {
  const selectOrUnselectSeats = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const capacity = bus.capacity;
  return (
    <div className="mx-5">
      <div className="bus-container">
        <Row gutter={[10, 10]}>
          {Array.from({ length: capacity }, (_, seat) => {
            let seatClass = "";
            if (selectedSeats?.includes(seat + 1)) {
              seatClass = "selected-seat";
            } else if (bus.seatsBooked.includes(seat + 1)){
              seatClass = "booked-seat"
            }
            return (
              <Col key={seat + 1} span={6}>
                <div
                  className={`seat ${seatClass}`}
                  onClick={() => selectOrUnselectSeats(seat + 1)}
                >
                  {seat + 1}
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default SeatSelection;
