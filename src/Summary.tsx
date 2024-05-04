import React from 'react';

const Summary: React.FC = () => {
  return (
    <div style={{ paddingLeft: "20px", width: "100%" }}>
      <h3>Summary</h3>
      <p>
        The techradar is a list of technologies, complemented by an assessment result, called <em>ring assignment</em>. In this example the following rings are used:
        <ul>
          <li><strong>ADOPT</strong> &mdash; Technologies we have high confidence in to serve our purpose, also in large scale. Technologies with a usage culture in our production environment, low risk and recommended to be widely used.</li>
          <li><strong>TRIAL</strong> &mdash; Technologies that we have seen work with success in project work to solve a real problem; first serious usage experience that confirm benefits and can uncover limitations. TRIAL technologies are slightly more risky; some engineers in our organization walked this path and will share knowledge and experiences.</li>
          <li><strong>ASSESS</strong> &mdash; Technologies that are promising and have clear potential value-add for us; technologies worth to invest some research and prototyping efforts in to see if it has impact. ASSESS technologies have higher risks; they are often brand new and highly unproven in our organisation. You will find some engineers that have knowledge in the technology and promote it, you may even find teams that have started a prototyping effort.</li>
          <li><strong>HOLD</strong> &mdash; Technologies not recommended to be used for new projects. Technologies that we think are not (yet) worth to (further) invest in. HOLD technologies should not be used for new projects, but usually can be continued for existing projects.</li>
        </ul>
        The techradar is a tool to inspire and support Engineering teams to pick the best technologies for new projects; it provides a platform to share knowledge and experience in technologies, to reflect on technology decisions and continuously evolve our technology landscape. 
        This techradar sets out the changes in technologies that are interesting in software development &mdash; changes that we think our engineering teams should pay attention to and use in their projects.
        This techradar is split up by team to make it easier to customise and focus on the relevant technologies. 
      </p>
      <h3>Blips</h3>
      <p>
        Blips on the tech radar represent individual technologies or tools plotted within the rings based on their assessment and suitability for adoption. 
        Each blip indicates a technology's current position and potential movement across the rings as it evolves. 
        Blips provide a visual representation of technology trends and recommendations within the engineering community.
        Where available, blips are linked to GitHub discussions explaining the reasoning for their current and historic scores.
        Where possible, teams which reference the same blip use the same scores, unless there is a specific reason not to. 
      </p>
      <h3>Acknowledgements</h3>
      <p>
        <ul>
          <li>@chrishrb</li>
          <li>Zalando</li>
          <li>Thoughtworks</li>
        </ul>
      </p>


    </div>
  );
};

export default Summary;
