import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillEdit } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { blogDelete, blogList } from "../redux/blogSlice";

export default function MiPerfil() {
  //Declaro la url de la Api en dependencia del entorno
  const URL =
    process.env.NODE_ENV === "production"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:8000";

  const { id } = useParams();

  const dispatch = useDispatch();

  const blog = useSelector((state) => state.blog);
  const { blogs, bloginfo, success } = blog;

  const user = useSelector((state) => state.user);

  const { userInfo } = user;

  useEffect(() => {
    dispatch(blogList({ token: userInfo[0].token }));
  }, [dispatch, success, userInfo]);

  const deleteHandler = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta publicación?")) {
      dispatch(blogDelete({ id, token: userInfo[0].token }));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <center>
            <img
              className="h-40 w-55 rounded-full"
              src={`${URL}${userInfo[0].image}`}
              alt=""
            />
            <br></br>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {userInfo[0].user_name} &nbsp;&nbsp;&nbsp;&nbsp;
              <a
                style={{ textDecoration: "none" }}
                href={"/editProfile"}
                className=" bg-indigo-600 py-1 px-5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Editar Perfil
              </a>
            </h3>
          </center>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Información de Usuario
          </p>
        </div>

        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Nombre de Usuario
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {userInfo[0].user_name}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Correo Electrónico
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {userInfo[0].email}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Rol de Usuario
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {userInfo[0].role}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Acerca de ti
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {userInfo[0].bio}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <h2 className="mt-6 mb-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        -- Publicaciones --
      </h2>

      {blogs.map((bloginfo) => (
        <>
          {userInfo.user_name === bloginfo.user && (
            <div className="py-20 bg-gray-200">
              <div className=" px-10">
                <div className="max-w-md mx-auto bg-white shadow-lg rounded-md overflow-hidden md:max-w-md">
                  <div className="md:flex">
                    <div className="w-full">
                      <div
                        key={bloginfo.id}
                        class="flex justify-between items-center m-8"
                      >
                        <div className="flex flex-row items-center">
                          <img
                            src={`${URL}${userInfo.image}`}
                            classname="rounded-full"
                            width="40"
                          />
                          <div className="flex flex-row items-center ml-2">
                            <span className="font-bold mr-1">
                              {bloginfo.user}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div></div>
                      <div className="p-4 flex justify-between items-center">
                        <p>{bloginfo.body}</p>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex flex-row items-center">
                          <a
                            href={`/editBlog/${bloginfo.id}`}
                            className="group mx-6 relative flex  justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            {" "}
                            <AiFillEdit size={30} />
                          </a>

                          <button
                            onClick={() => deleteHandler(bloginfo.id)}
                            className="group relative flex  justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            {" "}
                            <BsFillTrashFill size={30} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ))}
    </div>
  );
}
