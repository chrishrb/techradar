import { TechradarData } from "../../lib/main";

const data: TechradarData = {
  id: "example1",
  rings: [
    { id: "adopt", name: "ADOPT" },
    { id: "trial", name: "TRIAL" },
    { id: "assess", name: "ASSESS" },
    { id: "hold", name: "HOLD", color: "#e09b96" },
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
      name: "Languages",
      blipsByRing: {
        adopt: [{ name: "CRA (Create React App)" }],
        assess: [{ name: "Next.js" }, { name: "React App Rewired" }],
      },
    },
    {
      name: "Infrastucture",
      blipsByRing: {
        adopt: [{ name: "AWS CodePipeline" }],
        trial: [{ name: "Jenkins" }],
        hold: [{ name: "Bamboo", state: 'down' }, { name: "TeamCity" }],
      },
    },
    {
      name: "Datastores",
      blipsByRing: {
        adopt: [{ name: "Postgres" }, { name: "Redis", state: 'up', url: "https://redis.io/" }],
        trial: [{ name: "MongoDB" }],
        assess: [{ name: "Cassandra" }],
        hold: [{ name: "MySQL" }, { name: "SQLite" }, { name: "CouchDB", state: 'up' }],
      },
    },
    {
      name: "Data Management",
      blipsByRing: {
        adopt: [{ name: "REST", url:"https://github.com/moj-analytical-services/techradar/discussions/2" }],
        trial: [{ name: "GraphQL" }, { name: "Apollo Client" }],
        assess: [{ name: "Falcor" }],
        hold: [{ name: "SOAP", state: 'down' }],
      },
    },
  ],
};

export default data;
