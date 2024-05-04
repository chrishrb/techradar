import React, { useState } from 'react';
import Techradar, { TechradarData } from '../lib/main';
import Summary from './Summary'; // Import the Summary component
import team1 from './teams/team1';
import team2 from './teams/team2';
import team3 from './teams/team3';

const App: React.FC = () => {
  const [teamData, setTeamData] = useState<TechradarData>(team1);
  const [showSummaryContent, setShowSummaryContent] = useState<boolean>(true);

  const showTeamData = (selectedTeamData: TechradarData) => {
    setTeamData(selectedTeamData);
    setShowSummaryContent(false);
  };

  const handleSummaryClick = () => {
    setShowSummaryContent(true);
  };

  return (
    <div style={{ paddingLeft: "20px" }}>
      <div style={{ paddingBottom: "10px" }}>
        <h2 style={{ fontFamily: "Arial, Helvetica", fontSize: "20px", fontWeight: "bold", marginBottom: "0px" }}>Technology Radar</h2>
        <button style={{ margin: "5px", marginLeft: "0px" }} onClick={handleSummaryClick}>Summary</button>
        <button style={{ margin: "5px" }} onClick={() => showTeamData(team1)}>Team 1</button>
        <button style={{ margin: "5px" }} onClick={() => showTeamData(team2)}>Team 2</button>
        <button style={{ margin: "5px" }} onClick={() => showTeamData(team3)}>Team 3</button>
      </div>

      {showSummaryContent ? (
        <Summary /> // Render the Summary component if showSummaryContent is true
      ) : (
        <div style={{ width: "100%", paddingBottom: "10px", paddingLeft: "20px" }}>
          <Techradar data={teamData} options={{ radarSize: 600, colorScheme: 'white' }} />
        </div>
      )}
    </div>
  );
};

export default App;
