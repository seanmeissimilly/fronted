import { useEffect, useState } from "react";
import Suggestion from "./Suggestion.jsx";
import { useDispatch, useSelector } from "react-redux";
import { suggestionList, suggestionDelete } from "../redux/suggestionSlice.js";
import { userList } from "../redux/userSlice.js";
import Messages from "./Messages.jsx";
import Loader from "./Loader.jsx";
import { AiFillPlusSquare } from "react-icons/ai";
import { useSpring, animated } from "react-spring";
import moment from "moment/moment.js";
import Modal from "./Modal";

const Suggestions = () => {
  const URL = import.meta.env.VITE_BACKEND_URL;

  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  const { suggestions, suggestionInfo, error, loading } = useSelector(
    (state) => state.suggestion
  );

  const { users, userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo?.token) {
      dispatch(suggestionList({ token: userInfo.token }));

      dispatch(userList({ token: userInfo.token }));
    }
  }, [dispatch, userInfo, suggestionInfo, error]);

  //metodo de filtrado
  const results =
    search === ""
      ? [...suggestions]
      : [...suggestions].filter((suggestion) =>
          suggestion.title.toLowerCase().includes(search.toLocaleLowerCase())
        );

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = (id) => {
    setShowModal(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    dispatch(suggestionDelete({ id: deleteId, token: userInfo.token }));
    setShowModal(false);
  };

  const formatDate = (date) => moment(date).format("DD-MM-YYYY");

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
  });

  const scale = useSpring({
    from: { transform: "scale(0)" },
    to: { transform: "scale(1)" },
    delay: 500,
  });

  const renderSuggestions = () => {
    return results.map((suggestion) => {
      const user = users.find((user) => user.user_name === suggestion.user);

      return (
        <Suggestion
          key={suggestion.id}
          id={suggestion.id}
          title={suggestion.title}
          body={suggestion.body}
          user={suggestion.user}
          email={user ? user.email : ""}
          userInfo={userInfo}
          userImage={user ? `${URL}${user.image}` : ""}
          userRole={userInfo ? userInfo.role : "reader"}
          resolved={suggestion.resolved}
          date={formatDate(suggestion.date)}
          onDelete={() => handleDelete(suggestion.id)}
        />
      );
    });
  };

  return (
    <>
      {showModal && (
        <Modal onClose={() => setShowModal(false)} onConfirm={confirmDelete}>
          <p className="text-red-600">⚠️ Atención ⚠️</p>
          <p>¿Estás seguro de que deseas borrar esta queja y sugerencia?</p>
          <p>Esta acción no se puede deshacer.</p>
        </Modal>
      )}
      {loading ? (
        <Loader />
      ) : error ? (
        <Messages>{error}</Messages>
      ) : (
        <div>
          <div className="mb-3 mt-3 mr-3 flex justify-end">
            <animated.input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Buscar"
              className="block min-w-0 rounded border border-solid bg-transparent px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none focus:z-[3] focus:border-primary dark:border-neutral-600 dark:text-neutral-800 dark:focus:border-primary"
              id="search"
              style={{ ...fadeIn, ...scale }}
            />
          </div>
          <div className="container mx-auto p-4 mb-16">
            <div className="mb-8 flex justify-start">
              <a
                href="/suggestions/createSuggestion"
                className="text-base font-medium text-gray-500 hover:text-gray-900"
                title="Añadir Queja o Sugerencia"
              >
                <AiFillPlusSquare
                  className="text-green-900 hover:text-gray-900"
                  size={30}
                />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {renderSuggestions()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Suggestions;
