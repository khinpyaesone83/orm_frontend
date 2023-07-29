import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <Container>
      <MenuContainer>
        <h2>Admin</h2>
        <MenuItem>
          <Menu>
            <NavLink
              to="/company"
              style={({ isActive }) => ({
                textDecoration: "none",
                fontWeight: "bold",
                color: isActive ? "#8fd071" : "#434343",
              })}
            >
              Company
            </NavLink>
          </Menu>
          <Menu>
            <NavLink
              to="/employee"
              style={({ isActive }) => ({
                textDecoration: "none",
                fontWeight: "bold",
                color: isActive ? "#8fd071" : "#434343",
              })}
            >
              Employee
            </NavLink>
          </Menu>
          <Menu>
            <NavLink
              to="/login"
              style={{
                textDecoration: "none",
                fontWeight: "bold",
                color: "#434343",
                border: "1px solid #c9c9c9",
                padding: "10px 30px",
                borderRadius: "20px",
              }}
              onClick={handleLogout}
            >
              Logout
            </NavLink>
          </Menu>
        </MenuItem>
      </MenuContainer>
    </Container>
  );
};

export default Navbar;

const Container = styled.section`
  height: 70px;
  background-color: dodgerblue;
`;

const MenuContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 30px;
`;

const MenuItem = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Menu = styled.li`
  padding: 0px 20px;
  font-size: 120%;
`;
