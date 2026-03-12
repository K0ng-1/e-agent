
export default function Aside() {
  const [count, setCount] = useState(0);
  const handleCount = () => {
    setCount((prevCount) => prevCount + 1);
  };
  return (
    <>
      <div onClick={handleCount}>{count}</div>
      <div>
        <Link to="/">Home</Link>
      </div>
      <Link to="/store">Store</Link>
    </>
  );
}
