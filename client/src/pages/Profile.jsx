import React from 'react';
import { useSelector, useDispatch } from "react-redux";

const Profile = () => {
    const { user } = useSelector((state) => state.users);

  return (
    <div className='card p-4 mt-5'>
        <h1 className='text-lg'>Name: <br />
           <b>{user.name}</b> </h1>

        <hr />

        <h1 className="text-md">Email: <br /> <b>{user.email}</b></h1>
        <hr />

        <h1 className="text-md">Account Type: <br /> <b>{user.isAdmin === false && "User Account"}</b></h1>

        <hr />
        <h1 className="text-md">Account Created On: <br /> <b>{user.createdAt}</b></h1>
    </div>
  )
}

export default Profile