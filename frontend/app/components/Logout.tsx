import React, { useEffect } from "react";
import { useNavigate } from "react-router";


const Logout: React.FC = () => {
  const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("access_token")) {
            localStorage.removeItem("access_token")
            localStorage.removeItem("first_name")
            localStorage.removeItem("last_name")
        }

        navigate('/login')
    }, [])

  return (
    <></>
  );
};

export default Logout;