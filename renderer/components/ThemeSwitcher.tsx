import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
export default function ThemeSwitcher() {
  const [show, setShow] = useState(false);
  return (
    <>
      {show ? (
        <MoonIcon onClick={() => setShow(!show)} className="w-5 h-5" />
      ) : (
        <SunIcon onClick={() => setShow(!show)} className="w-5 h-5" />
      )}
    </>
  );
}
