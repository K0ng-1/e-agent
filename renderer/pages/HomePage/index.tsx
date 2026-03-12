import { BeakerIcon } from '@heroicons/react/24/solid'

function MyComponent() {
  return (
    <div>
      <BeakerIcon className="size-6 text-blue-500" />
      <p>...</p>
    </div>
  )
}
export default function HomePage() {
  return (<>
    <div className="container">Home</div>;
    <MyComponent />
  </>)
}
