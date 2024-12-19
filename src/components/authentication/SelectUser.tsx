import { useEffect, useState } from "react";
import { useOS } from "../../hooks/useOS";
import { User } from "../../interfaces/authentication/authentication.interface";
import { get_users, update_last_user } from "../../utils/invoke";
import { minimumTextSize } from "../../utils/utils";

export const SelectUser = () => {
  const [users, setUsers] = useState<User[]>();
  const [hidden, setHidden] = useState<boolean>(false);
  const [number, setNumber] = useState<number>(0);

  const { currentUser, setCurrentUser } = useOS();

  const filterUsers = () => {
    get_users()
      .then((res) => {
        let users = res.filter(
          (user) => user.username !== currentUser.username,
        );
        users.unshift(currentUser);
        setUsers(users);
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    filterUsers();
  }, [currentUser]);

  const handleOnClick = (user: User) => {
    setCurrentUser(user);
    update_last_user(user.id)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.error(e));
  };

  return (
    <>
      <button
        className={`absolute bottom-8 left-16 h-8 w-auto bg-red-600 px-4 ${
          hidden && "hidden"
        }`}
        onMouseEnter={() => setHidden(true)}
      >
        {minimumTextSize(currentUser.username)}
      </button>

      <div
        className={`absolute bottom-8 left-16 flex max-h-40 w-auto flex-col-reverse overflow-y-auto bg-red-600 ${
          !hidden && "hidden"
        }`}
        onMouseLeave={() => setHidden(false)}
      >
        {users &&
          users.map((user, index) => (
            <div
              key={index}
              className={`cursor-pointer px-4 py-1 ${
                index == number ? "bg-white text-black" : "bg-blue-400"
              }`}
              onMouseEnter={() => setNumber(index)}
              onClick={() => handleOnClick(user)}
            >
              {minimumTextSize(user.username)}
            </div>
          ))}
      </div>
    </>
  );
};
