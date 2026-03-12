import { Link } from "react-router";

export default function Aside() {
  return (
    <div>
      <div>
        <Link to="/home">Home</Link>
      </div>
      <Link to="/store">Store</Link>
    </div>
  );
}
