import React, { useState } from "react";
import { Input, Button, Alert } from "antd";
import styled from "styled-components";
import { base_url } from "./Config";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(base_url + "auth/login", {
        username,
        password,
      });
      if (response.status === 200) {
        const token = response.data.accessToken;
        localStorage.setItem("token", token);
        const userData = jwt_decode(token);
        console.log(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setTimeout(() => {
          setSuccess("Login success!");
          navigate("/company");
        }, 1000);
      }
    } catch (error) {
      console.log("error,", error);
      setError("Invalid username or password!");
    }
  };
  return (
    <>
      <Container>
        <h1>Login</h1>
        <Card>
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
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            style={{ margin: "20px 0px" }}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            size="large"
            style={{
              borderRadius: "20px",
              marginTop: "30px",
              width: "50%",
              alignSelf: "center",
            }}
            type="primary"
            onClick={handleLogin}
          >
            Login
          </Button>
        </Card>
      </Container>
    </>
  );
};

export default Login;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  flex-direction: column;
`;

const Card = styled.div`
  background-color: #fff7e6;
  display: flex;
  justify-content: center;
  align-items: cener;
  text-align: center;
  padding: 50px;
  flex-direction: column;
  width: 30%;
  border-radius: 10px;
`;
