import React from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { userList } from "../redux/userSlice";
import Messages from "./Messages";
import Loader from "./Loader";

const About = ({ username, email }) => (
  <div className="bg-gray-100 p-4 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-2">Contacto del Administrador:</h2>
    <p>Nombre de usuario {username}</p>
    <a href={`mailto:${email}`} className="text-blue-500">
      <span className="text-black"> Correo: </span>
      {email}
    </a>
  </div>
);

About.propTypes = {
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

const AboutUs = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { error, loading, users, userInfo } = user;

  React.useEffect(() => {
    dispatch(userList({ token: userInfo.token }));
  }, [dispatch, userInfo]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Messages>{error}</Messages>
      ) : (
        <div className="container mx-auto p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {users
            ?.filter((user) => user.role === "admin")
            .map((user) => (
              <About
                key={user.id}
                username={user.user_name}
                email={user.email}
              />
            ))}
        </div>
      )}
    </>
  );
};

export default AboutUs;