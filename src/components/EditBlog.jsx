import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { blogUpdate, blogDetails } from "../redux/blogSlice";
import { useParams } from "react-router-dom";
import Messages from "./Messages.jsx";
import Loader from "./Loader.jsx";

export default function EditBlog() {
  const URL_API = import.meta.env.VITE_BACKEND_URL;

  const { id } = useParams();

  const navigate = useNavigate();
  const path = "/forum";

  const dispatch = useDispatch();

  const blog = useSelector((state) => state.blog);
  const { error, loading, blogInfo, success } = blog;

  const user = useSelector((state) => state.user);

  const { userInfo } = user;

  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (blogInfo.id !== Number(id)) {
      dispatch(blogDetails({ id, token: userInfo.token }));
    } else {
      if (!image) {
        setBody(blogInfo.body);
        setTitle(blogInfo.title);
        setImage(blogInfo.image);
        setImageUrl(`${URL_API}${blogInfo.image}`);
      }
    }
  }, [dispatch, blogInfo, id, success, userInfo, URL_API, image]);

  const submitHandler = (e) => {
    e.preventDefault();

    const payload = { id: id, title: title, body: body, token: userInfo.token };
    if (image && image instanceof File) {
      Object.assign(payload, { image });
    }
    dispatch(blogUpdate(payload));
    navigate(path);
  };

  return (
    <>
      {loading && <Loader />}
      {error && <Messages>{error}</Messages>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Messages>{error}</Messages>
      ) : (
        <div className="md:grid md:grid-cols-4 md:gap-6">
          <div className="md:col-span-1"></div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
              Actualizar Publicación
            </h2>

            <form onSubmit={submitHandler}>
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Título
                    </label>
                    <div className="mt-1">
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        name="title"
                        required
                        type="text"
                        id="title"
                        className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="Título de la publicación"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="body"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Temática
                    </label>
                    <div className="mt-1">
                      <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        id="body"
                        rows={3}
                        className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        placeholder="Escribe aquí la publicación"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Imagen
                    </label>
                    <div className="mt-1">
                      <input
                        onChange={handleImageChange}
                        name="image"
                        type="file"
                        id="image"
                        accept="image/*"
                        className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    {imageUrl && (
                      <div className="mt-4">
                        <img
                          src={imageUrl}
                          alt="Selected"
                          className="h-48 w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
