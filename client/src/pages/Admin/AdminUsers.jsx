import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import BusForm from "../../components/BusForm";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../state/alertSlice";
import { Table, message } from "antd";
import { axiosInstance } from "../../helpers/axiosInstance";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/users/get-all-users");
      dispatch(HideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const updateUserPermissions = async (user, action) => {
    try {
      let payload = null;
      if(action === 'make-admin') {
        payload = {
          ...user,
          isAdmin: true
        };
      } else if (action === 'remove-admin') {
        payload = {
          ...user,
          isAdmin: false  
        }
      } else if (action === 'block') {
        payload = {
          ...user,
          isBlocked: true  
        }
      } else if (action === 'unblock') {
        payload = {
          ...user,
          isBlocked: false  
        }
      }

      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        "/api/users/update-user-permissions",
        payload
      );
      dispatch(HideLoading());
      if (response.data.success) {
        getUsers();
        message.success(response.data.message)
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Status",
      dataIndex: "",
      render: (data) => {
        return data?.isBlocked ? "Blocked" : "Active"
      }
    },
    {
      title: "Role",
      dataIndex: "",
      render: (data) => {
        if (data?.isAdmin) {
          return "Admin";
        } else {
          return "User";
        }
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      render: (action, record) => (
        <div className="d-flex gap-3">
          {record?.isBlocked && (
            <button className="outline-btn underline"
            onClick={() => updateUserPermissions(record, 'unblock')}
            >Unblock</button>
          )}
          {!record?.isBlocked && (
            <button className="outline-btn underline"
            onClick={() => updateUserPermissions(record, 'block')}
            >Block</button>
          )}
          {record?.isAdmin && (
            <button className="outline-btn underline"
            onClick={() => updateUserPermissions(record, 'remove-admin')}
            >Remove Admin</button>
          )}
          {!record?.isAdmin && (
            <button className="outline-btn underline"
            onClick={() => updateUserPermissions(record, 'make-admin')}
            >Make Admin</button>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between my-2">
        <PageTitle title="Users" />
      </div>
      <Table columns={columns} dataSource={users} />
    </div>
  );
};

export default AdminUsers;
