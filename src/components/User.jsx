/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UseAuthentication";

function User({ membersList }) {
  const { user } = useAuth();

  const currentUser =
    membersList?.find((member) => member.id === user?.uid) || {};

  const navigate = useNavigate();
  function handleProfileOpen() {
    navigate("profile");
  }

  return (
    <div
      onClick={handleProfileOpen}
      className="rounded-full bg-[#c1bcdb] cursor-pointer shadow-md border-2 border-black h-10 w-10 "
    >
      {/* Profile picture container */}
      <img
        className={
          currentUser?.profileImage
            ? "h-full w-full rounded-full"
            : "p-1 bg-black h-full w-full rounded-full"
        }
        alt={user?.fullName || "User"}
        src={
          currentUser?.profileImage
            ? currentUser.profileImage
            : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' class='h-6 w-6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 14c4 0 6-3 6-6s-2-6-6-6-6 3-6 6 2 6 6 6zM12 14c-4 0-6 2-6 6v1h12v-1c0-4-2-6-6-6z'%3E%3C/path%3E%3C/svg%3E"
        }
      />
    </div>
  );
}

export default User;
