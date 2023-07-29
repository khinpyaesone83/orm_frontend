import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Form, Input, Modal, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import Navbar from "./Navbar";
import axios from "axios";
import { base_url } from "./Config";

interface DataType {
  id: string;
  name: string;
  email: number;
  address: string;
}
const Company: React.FC = () => {
  const [data, setData] = useState<DataType[]>();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [id, setId] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");

  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `${token}`;

  const columns: ColumnsType<DataType> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Action",
      key: "action",
      render: (record: any) => (
        <>
          {user.role === "admin" ? (
            <div style={{ display: "flex" }}>
              <p
                style={{
                  color: "blue",
                  cursor: "pointer",
                  marginRight: "15px",
                }}
                onClick={() => {
                  setShowEditModal(true);
                  setId(record.id);
                  setName(record.name);
                  setEmail(record.email);
                  setAddress(record.address);
                }}
              >
                Edit
              </p>
              <p
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => handleDelete(record.id)}
              >
                Delete
              </p>
            </div>
          ) : (
            <p>-</p>
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    getCompanyData();
  }, [add, update]);

  const getCompanyData = async () => {
    try {
      const response = await axios.get(base_url + "company", {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });
      // console.log(response);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAdd = async () => {
    const data = {
      name,
      email,
      address,
    };
    try {
      const response = await axios.post(base_url + "company", data);
      // console.log(response);
      if (response.status === 200) {
        setSuccess("successfully add company");
        setAdd(!add);
      }
      clearInputValue();
    } catch (error) {
      console.log(error);
      setError("something wrong!");
    }
  };

  const handleEdit = async () => {
    const data = {
      name,
      email,
      address,
    };
    const res = await axios.put(base_url + `company/${id}`, data);
    // console.log(res);
    setUpdate(!update);
    setShowEditModal(false);
    clearInputValue();
  };

  const handleDelete = async (id: number) => {
    const res = await axios.delete(base_url + `company/${id}`);
    // console.log(res);
    setUpdate(!update);
  };

  const clearInputValue = () => {
    setName("");
    setAddress("");
    setEmail("");
    setError("");
    setSuccess("");
    setShowAddModal(false);
  };

  let filtered = data;
  if (searchText) {
    filtered = data?.filter((c) =>
      c.name.toLocaleLowerCase().startsWith(searchText.toLocaleLowerCase())
    );
  }
  return (
    <div>
      <Navbar />
      <div style={{ margin: "30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h2>Company List</h2>
            <div style={{ marginLeft: "10px" }}>
              <Input
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
          {user.role === "admin" && (
            <Button
              size="large"
              type="primary"
              onClick={() => setShowAddModal(true)}
            >
              Add
            </Button>
          )}
        </div>
        <Card>
          <Table
            rowKey={"id"}
            columns={columns}
            dataSource={filtered}
            scroll={{ x: 100 }}
          />
        </Card>
      </div>
      {/* add company */}
      <Modal
        title="Add New Company"
        open={showAddModal}
        onCancel={() => {
          setShowAddModal(false);
          setError("");
          setSuccess("");
        }}
        footer={null}
      >
        {success && (
          <Alert
            message={success}
            type="success"
            style={{ marginBottom: "20px" }}
          />
        )}
        {error && (
          <Alert
            message={error}
            type="error"
            style={{ marginBottom: "20px" }}
          />
        )}
        <Form
          size="large"
          labelCol={{ span: 6 }}
          layout="horizontal"
          style={{ margin: "20px" }}
        >
          <Form.Item label="Name">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Email">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Address">
            <Input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 18 }}>
            <Button type="primary" onClick={handleAdd}>
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Company"
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          setError("");
          setSuccess("");
          clearInputValue();
        }}
        footer={null}
      >
        {success && (
          <Alert
            message={success}
            type="success"
            style={{ marginBottom: "20px" }}
          />
        )}
        {error && (
          <Alert
            message={error}
            type="error"
            style={{ marginBottom: "20px" }}
          />
        )}
        <Form
          size="large"
          labelCol={{ span: 6 }}
          layout="horizontal"
          style={{ margin: "20px" }}
        >
          <Form.Item label="Name">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Email">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Address">
            <Input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 18 }}>
            <Button type="primary" onClick={handleEdit}>
              Edit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Company;
