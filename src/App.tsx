import Techradar, { TechradarData } from '../lib/main'
import { TechradarBlipState } from '../lib/types';

function App() {
  const exampleData: TechradarData = {
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
          assess: [{ name: "AirBNB Eslint Config" }],
        },
      },
      {
        name: "Project starter",
        blipsByRing: {
          adopt: [{ name: "CRA (Create React App)" }],
          assess: [{ name: "Next.js" }, { name: "React App Rewired" }],
        },
      },
      {
        name: "Project starter",
        blipsByRing: {
          adopt: [{ name: "CRA (Create React App)" }],
          assess: [{ name: "Next.js", state: TechradarBlipState.DOWN }, { name: "React App Rewired" }],
        },
      },
      {
        name: "Project starter",
        blipsByRing: {
          adopt: [{ name: "CRA (Create React App)" }],
          assess: [{ name: "Next.js" }, { name: "React App Rewired" }],
        },
      },
      {
        name: "Project starter",
        blipsByRing: {
          adopt: [{ name: "CRA (Create React App)" }],
          assess: [{ name: "Next.js" }, { name: "React App Rewired" }],
        },
      },
    ],
  };

  return (
    <>
      <div style={{width: "100%"}}>
      <Techradar data={exampleData} options={{radarSize: 600}}/>

      </div>
    </>
  )
}

export default App
