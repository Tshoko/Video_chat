import { Link,Outlet } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from 'react';
import { useTimer } from 'react-timer-hook';
export default function Online_Users() {
  const [users, setUsers] = useState([]);
  let params = useParams();
  const my_id=params.my_id
  const [update,setUpdate]=useState(true)
  
  useEffect(()=>{
    fetch(
      `http://0.0.0.0:8080/users/${my_id}`)
                  .then((res) => res.json())
                  .then((json)=>{
  
                    console.log(json.users)
                    setUsers(json.users)
                   
                  })
  },[] )
  
  
  
  return (
    <div className="Online_Users">
      {users.map(online => (
          <Link
            style={{ display: "block", margin: "1rem 0" }}
            to={`/video/${online}`}
            key={online}
            my_id={my_id}
          >
            {online}
          </Link>
        ))}
    
    </div>
  );
}

