import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Techradar from '../lib/main'

function App() {
  const exampleData = {
    rings: [
      { id: "adopt", name: "ADOPT" },
      { id: "trial", name: "TRIAL" },
      { id: "assess", name: "ASSESS" },
      { id: "hold", name: "HOLD" },
    ],
    slices: [
      {
        name: "Frameworks & Ecosystems",
        blipsByRing: {
          adopt: [{ name: "React" }],
          trial: [{ name: "Vue" }, { name: "Angular (2+)" }],
          hold: [{ name: "AngularJS (1)" }, { name: "jQuery" }],
        },
      },
      {
        name: "Linting & Formatting",
        blipsByRing: {
          adopt: [{ name: "ESLint" }, { name: "Prettier" }],
          trial: [{ name: "AirBNB Eslint Config" }],
        },
      },
      {
        name: "Project starter",
        blipsByRing: {
          adopt: [{ name: "CRA (Create React App)" }],
          trial: [{ name: "Next.js" }, { name: "React App Rewired" }],
          hold: [],
        },
      },
      {
        name: "Project starter",
        blipsByRing: {
          adopt: [{ name: "CRA (Create React App)" }],
          trial: [{ name: "Next.js" }, { name: "React App Rewired" }],
          hold: [],
        },
      },
      {
        name: "Project starter",
        blipsByRing: {
          adopt: [{ name: "CRA (Create React App)" }],
          trial: [{ name: "Next.js" }, { name: "React App Rewired" }],
          hold: [],
        },
      },
    ],
  };

  return (
    <>
      <Techradar data={exampleData}/>
    </>
  )
}

export default App
