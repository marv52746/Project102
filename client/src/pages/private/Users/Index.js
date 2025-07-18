import React, { useEffect, useState } from "react";
import TableList from "../../../core/components/TableList";
import apiService from "../../../core/services/apiService";
import { useDispatch } from "react-redux";
import { userTableColumns } from "../../../core/constants/userTable";

function Users() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await apiService.get(dispatch, "users");
        setData(users);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4">
      <TableList title="Users" data={data} columns={userTableColumns} />
    </div>
  );
}

export default Users;
