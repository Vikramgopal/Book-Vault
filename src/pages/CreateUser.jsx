import { Outlet } from "react-router";
import Logo from "../components/Logo";

function CreateUser() {
  return (
    <main className="h-screen  ">
      <div className="absolute  top-5 left-5">
        <Logo />
      </div>

      <Outlet />
    </main>
  );
}

export default CreateUser;
