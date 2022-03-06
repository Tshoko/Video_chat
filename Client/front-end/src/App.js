import { Link } from "react-router-dom";

import React, { useEffect, useState, useRef } from 'react';
import styled, { css } from "styled-components";
export const CardWrapper = styled.div`
  overflow: hidden;
  padding: 0 0 32px;
  margin: 48px auto 0;
  width: 300px;
  font-family: Quicksand, arial, sans-serif;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05), 0 0px 40px rgba(0, 0, 0, 0.08);
  border-radius: 5px;
`;
export const CardBody = styled.div`
  padding-right: 32px;
  padding-left: 32px;
`;
export default function App() {
  const [user, setUser] = useState("");
  return (
    <div className="Online_Users">
      yourID
      <p>{user}</p>
      
      <Link to={`/Vidoe/${user}`}>Expenses</Link>
    </div>
  );
}

