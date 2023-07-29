import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Navbar from "./Navbar";
import axios from "axios";
import { base_url } from "./Config";

interface DataType {
  key: string;
  id: string;
  firstName: string;
  lastName: string;
  departments: string;
  address: string;
  email: string;
  phone: string;
  staffId: number;
}

const Employee: React.FC = () => {
  const token = localStorage.getItem("token");
  const [data, setData] = useState<DataType[]>();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [dept, setDept] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [staffId, setStaffId] = useState<number>(0);
  const [companyId, setCompanyId] = useState<number>(0);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [add, setAdd] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  const columns: ColumnsType<DataType> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Department",
      dataIndex: "departments",
      key: "departments",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Staff ID",
      dataIndex: "staffId",
      key: "staffId",
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
                  setFirstName(record.firstName);
                  setLastName(record.lastName);
                  setDept(record.departments);
                  setAddress(record.address);
                  setEmail(record.email);
                  setPhone(record.phone);
                  setStaffId(record.staffId);
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
    getEmployeeData();
  }, [add, update]);

  const getEmployeeData = async () => {
    try {
      const response = await axios.get(base_url + "employee", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async () => {
    try {
      const data = {
        firstName,
        lastName,
        departments: dept,
        email,
        address,
        phone,
        staffId,
        companyId,
      };
      const res = await axios.post(base_url + "employee", data);
      // console.log(res);
      if (res.status === 200) {
        setSuccess("successfully add employee");
        setTimeout(() => {
          setSuccess("");
          setShowAddModal(false);
          setAdd(!add);
          clearData();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      setError("something went wrong!");
    }
  };

  const handleEdit = async () => {
    const data = {
      firstName,
      lastName,
      departments: dept,
      email,
      address,
      phone,
      staffId,
      companyId,
    };
    const res = await axios.put(base_url + `employee/${id}`, data);
    // console.log(res);
    setUpdate(!update);
    setShowEditModal(false);
    clearData();
  };

  const handleDelete = async (id: number) => {
    const res = await axios.delete(base_url + `employee/${id}`);
    // console.log(res);
    setUpdate(!update);
  };

  const clearData = () => {
    setFirstName("");
    setLastName("");
    setAddress("");
    setDept("");
    setEmail("");
    setPhone("");
    setStaffId(0);
    setCompanyId(0);
  };

  let filtered = data;
  if (searchText) {
    filtered = data?.filter(
      (e) =>
        e.departments
          .toLocaleLowerCase()
          .startsWith(searchText.toLocaleLowerCase()) ||
        e.firstName
          .toLocaleLowerCase()
          .startsWith(searchText.toLocaleLowerCase()) ||
        e.staffId
          .toString()
          .toLocaleLowerCase()
          .startsWith(searchText.toLocaleLowerCase())
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
            <h2>Employee List</h2>
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
      {/* add modal */}
      <Modal
        title="Add New Employee"
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
          <Form.Item label="First Name">
            <Input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Last Name">
            <Input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Department">
            <Input
              placeholder="Department"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
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
          <Form.Item label="Phone">
            <Input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Staff Id">
            <Input
              placeholder="Staff Id"
              value={staffId}
              type="number"
              onChange={(e) => setStaffId(Number(e.target.value))}
            />
          </Form.Item>
          <Form.Item label="Company Id">
            <Input
              placeholder="Company Id"
              value={companyId}
              type="number"
              onChange={(e) => setCompanyId(Number(e.target.value))}
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
        title="Edit Employee"
        open={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          setError("");
          setSuccess("");
          clearData();
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
          <Form.Item label="First Name">
            <Input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Last Name">
            <Input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Department">
            <Input
              placeholder="Department"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
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
          <Form.Item label="Phone">
            <Input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Staff Id">
            <Input
              placeholder="Staff Id"
              value={staffId}
              type="number"
              onChange={(e) => setStaffId(Number(e.target.value))}
            />
          </Form.Item>
          <Form.Item label="Company Id">
            <Input
              placeholder="Company Id"
              value={companyId}
              type="number"
              onChange={(e) => setCompanyId(Number(e.target.value))}
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

export default Employee;
