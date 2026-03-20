import { useLocation } from "react-router";

export default function Conversation(props) {
  console.dir(props);
  const location = useLocation();
  console.dir(location);

  return <div>Conversation123</div>;
}
