import React from "react";
import { useNavigate } from "react-router-dom";

const Bus = ({ bus }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/book-now/${bus._id}`);
  };

  return (
    <div className="card p-3">
      <h1 className="text-lg text-primary">{bus.name}</h1>
      <hr />

      <div className="d-flex justify-content-between">
        <div>
          <p className="text-sm">From</p>
          <p className="text-sm">{bus.from}</p>
        </div>
        <div>
          <p className="text-sm">To</p>
          <p className="text-sm">{bus.to}</p>
        </div>
        <div>
          <p className="text-sm">Fare</p>
          <p className="text-sm">₦{bus.fare}</p>
        </div>
      </div>

      <div className="pt-4 d-flex justify-content-between align-items-end">
        <div>
          <p className="text-sm">Journey Date</p>
          <p className="text-sm">{bus.journeyDate}</p>
        </div>
        <button className="text-md underline outline-btn" onClick={handleBookNow}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default Bus;
