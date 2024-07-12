import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router";
import Messages from "./Messages.jsx";
import Loader from "./Loader.jsx";
import { userSolo, userUpdate } from "../redux/userSlice.js";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import PasswordChecklist from "react-password-checklist";

//Declaro la url de la Api
const URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:8000";

const api = axios.create({
  baseURL: `${URL}`,
});

export default function EditProfile() {
  const [user_name, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isValid, setIsValid] = useState(false); // Estado inicial: no válido
  const [openpassword, setOpenPassword] = useState(false);
  const [openconfirmpassword, setOpenConfirmPassword] = useState(false); //

  const navigate = useNavigate();
  const path = "/miPerfil";

  const handleshowpassword = () => {
    setOpenPassword(!openpassword);
  };
  const handleshowconfirmpassword = () => {
    setOpenConfirmPassword(!openconfirmpassword);
  };

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { error, loading, users, userInfo } = user;

  useEffect(() => {
    //Reviso si el id del usuario que esta logueado es el mismo que traje para editar.
    if (
      users !== undefined &&
      users.length !== 0 &&
      userInfo[0].id !== users[0].id
    ) {
      dispatch(userSolo({ id: userInfo[0].id, token: userInfo[0].token }));
    } else {
      setUserName(userInfo[0].user_name);
      setEmail(userInfo[0].email);
      setBio(userInfo[0].bio);
      setImage(userInfo[0].image);
    }
  }, [dispatch, users, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (isValid) {
      dispatch(
        userUpdate({
          user_name: user_name,
          email: email,
          bio: bio,
          image: image,
          password: password,
          role: userInfo[0].role,
          token: userInfo[0].token,
          id: userInfo[0].id,
        })
      );
      navigate(path);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append("image", file);
    formData.append("user_id", userInfo[0].id);

    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo[0].token}`,
        },
      };

      const { data } = await api.post("/users/image/", formData, config);

      setImage(data);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Messages>{error}</Messages>
      ) : (
        <div>
          {message && <Messages>{message}</Messages>}
          {error && <Messages>{error}</Messages>}

          <div className="md:grid md:grid-cols-4 md:gap-6">
            <div className="md:col-span-1"></div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form action="#" method="POST" onSubmit={submitHandler}>
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3 sm:col-span-2">
                        <div>
                          <label
                            htmlFor="user_name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Nombre de Usuario
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                              value={user_name}
                              onChange={(e) => setUserName(e.target.value)}
                              type="text"
                              id="user_name"
                              className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              placeholder="Nombre de Usuario"
                            />
                          </div>
                        </div>
                        <br></br>
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Correo Electrónico
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              type="email"
                              name="email"
                              id="email"
                              className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              placeholder="Correo Electrónico"
                            />
                          </div>
                        </div>

                        <br></br>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="about"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Acerca de ti
                      </label>
                      <div className="mt-1">
                        <textarea
                          type="text"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          id="bio"
                          name="bio"
                          rows={3}
                          className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          placeholder="Escribe acerca de ti"
                          defaultValue={""}
                        />
                      </div>
                    </div>
                    <br></br>
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Actualiza tu contraseña
                    </label>
                    <div className=" mx-auto relative  items-center">
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type={openpassword ? "text" : "password"}
                          id="password"
                          className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          placeholder="Contraseña"
                        />
                      </div>
                      <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-2xl">
                        {!openpassword ? (
                          <AiFillEye onClick={handleshowpassword} />
                        ) : (
                          <AiFillEyeInvisible onClick={handleshowpassword} />
                        )}
                      </div>
                    </div>

                    <div className="">
                      <div className=" mx-auto relative  items-center">
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type={openconfirmpassword ? "text" : "password"}
                            id="confirm Password"
                            className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Confirmar Contraseña"
                          />
                        </div>
                        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-2xl">
                          {!openconfirmpassword ? (
                            <AiFillEye onClick={handleshowconfirmpassword} />
                          ) : (
                            <AiFillEyeInvisible
                              onClick={handleshowconfirmpassword}
                            />
                          )}
                        </div>
                      </div>
                      <div className="my-8">
                        <PasswordChecklist
                          className=""
                          rules={[
                            "minLength",
                            "specialChar",
                            "number",
                            "capital",
                            "match",
                            "lowercase",
                            "notEmpty",
                          ]}
                          minLength={8}
                          value={password}
                          valueAgain={confirmPassword}
                          messages={{
                            minLength:
                              "La contraseña tiene más de 8 caracteres.",
                            specialChar:
                              "La contraseña tiene caracteres especiales.",
                            number: "La contraseña tiene un número.",
                            capital: "La contraseña tiene una letra mayúscula.",
                            match: "Las contraseñas coinciden.",
                            lowercase:
                              "La contraseña tiene una letra minúscula.",
                            notEmpty: "La contraseña no está en blanco.",
                          }}
                          onChange={(e) => setIsValid(e)}
                        />
                      </div>
                    </div>

                    <form>
                      <label
                        htmlFor="about"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Imagen
                      </label>

                      <input
                        type="text"
                        placeholder="Image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                      ></input>

                      <input
                        label="Choose file"
                        type="file"
                        onChange={uploadFileHandler}
                      ></input>
                    </form>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
