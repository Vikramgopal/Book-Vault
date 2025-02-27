import { useNavigate } from "react-router";
function Logo() {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    navigate("/app");
  };
  return (
    <div onClick={handleClick} className="cursor-pointer w-28 max-sm:w-24 ">
      <img src="/Litloom-logo.png" alt="Logo"></img>
    </div>
  );
}

export default Logo;
