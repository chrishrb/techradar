import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Techradar from '../lib/main'

function App() {
  const exampleData = {
    rings: [
      { id: "go", name: "Go for it" },
      { id: "check", name: "Check it out" },
      { id: "hold", name: "Hold your horses" },
    ],
    slices: [
      {
        name: "Frameworks & Ecosystems",
        blipsByRing: {
          go: [{ name: "React" }],
          check: [{ name: "Vue" }, { name: "Angular (2+)" }],
          hold: [{ name: "AngularJS (1)" }, { name: "jQuery" }],
        },
      },
      {
        name: "Linting & Formatting",
        blipsByRing: {
          go: [{ name: "ESLint" }, { name: "Prettier" }],
          check: [{ name: "AirBNB Eslint Config" }],
        },
      },
      {
        name: "Project starter",
        blipsByRing: {
          go: [{ name: "CRA (Create React App)" }],
          check: [{ name: "Next.js" }, { name: "React App Rewired" }],
          hold: [],
        },
      },
    ],
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <Techradar data={exampleData}/>
    </>
  )
}

export default App
