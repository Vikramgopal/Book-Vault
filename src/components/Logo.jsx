import { useNavigate } from "react-router";

function Logo() {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    navigate("/app");
  };
  return (
    <div onClick={handleClick} className="cursor-pointer">
      LOGO
    </div>
  );
}

export default Logo;
