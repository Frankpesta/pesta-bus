import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import BusForm from "../../components/BusForm";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../state/alertSlice";
import { Table, message } from "antd";
import { axiosInstance } from "../../helpers/axiosInstance";

const AdminBuses = () => {
  const dispatch = useDispatch();
  const [showBusForm, setshowBusForm] = useState(false);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);

  const getBuses = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/buses/get-all-buses");
      dispatch(HideLoading());
      if (response.data.success) {
        setBuses(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const deleteBus = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/buses/delete-bus", {
        _id: id,
      });
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getBuses();
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
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Number",
      dataIndex: "number",
    },
    {
      title: "From",
      dataIndex: "from",
    },
    {
      title: "To",
      dataIndex: "to",
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "action",
      render: (action, record) => (
        <div className="d-flex gap-3">
          <i
            className="ri-edit-line"
            onClick={() => {
              setSelectedBus(record);
              setshowBusForm(true);
            }}
          />
          <i
            className="ri-delete-bin-line"
            onClick={() => {
              deleteBus(record._id);
            }}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBuses();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between my-2">
        <PageTitle title="Buses" />
        <button onClick={() => setshowBusForm(true)} className="secondary-btn">
          Add Bus
        </button>
      </div>

      <Table columns={columns} dataSource={buses} />

      {showBusForm && (
        <BusForm
          showBusForm={showBusForm}
          setShowBusForm={setshowBusForm}
          type={selectedBus ? "edit" : "add"}
          selectedBus={selectedBus}
          getData={getBuses}
          setSelectedBus={setSelectedBus}
        />
      )}
    </div>
  );
};

export default AdminBuses;
