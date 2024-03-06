import { useState } from 'react';
import Techradar, { TechradarData } from '../lib/main'
import example1 from './examples/example1';
import example2 from './examples/example2';
import example3 from './examples/example3';

function App() {
  const [example, setExample] = useState<TechradarData>(example1);

  return (
    <>
      <div style={{ paddingLeft: "20px" }}>
        <div style={{ paddingBottom: "10px" }}>
          <h2 style={{ fontFamily: "Arial, Helvetica", fontSize: "20px", fontWeight: "bold", marginBottom: "0px" }}>Choose an example:</h2>
          <button style={{ margin: "5px", marginLeft: "0px" }} onClick={() => setExample(example1)}>Example 1</button>
          <button style={{ margin: "5px" }} onClick={() => setExample(example2)}>Example 2</button>
          <button style={{ margin: "5px" }} onClick={() => setExample(example3)}>Example 3</button>
        </div>

        <h1 style={{ fontFamily: "Arial, Helvetica", fontSize: "30px", fontWeight: "bold", marginBottom: "0px" }}>Techradar Example</h1>
        {example.id &&
          <p style={{ fontFamily: "Arial, Helvetica", fontSize: "14px", color: "rgb(153, 153, 153)", marginTop: "0px", marginLeft: "5px" }}>{example.id}</p>
        }
      </div>
      <div style={{ width: "100%", paddingBottom: "10px", paddingLeft: "20px" }}>
        <Techradar data={example} options={{ radarSize: 600, colorScheme: 'white' }} />
      </div>
      <table>
        <tbody>
          <tr>
            <td>
              <h3>What is the techradar?</h3>
              <p>
                The techradar is a list of technologies, complemented by an assessment result, called <em>ring assignment</em>. In this example the following rings are used:
              </p>

              <ul>
                <li><strong>ADOPT</strong> &mdash; Technologies we have high confidence in to serve our purpose, also in large scale. Technologies with a usage culture in our production environment, low risk and recommended to be widely used.</li>
                <li><strong>TRIAL</strong> &mdash; Technologies that we have seen work with success in project work to solve a real problem; first serious usage experience that confirm benefits and can uncover limitations. TRIAL technologies are slightly more risky; some engineers in our organization walked this path and will share knowledge and experiences.</li>
                <li><strong>ASSESS</strong> &mdash; Technologies that are promising and have clear potential value-add for us; technologies worth to invest some research and prototyping efforts in to see if it has impact. ASSESS technologies have higher risks; they are often brand new and highly unproven in our organisation. You will find some engineers that have knowledge in the technology and promote it, you may even find teams that have started a prototyping effort.</li>
                <li><strong>HOLD</strong> &mdash; Technologies not recommended to be used for new projects. Technologies that we think are not (yet) worth to (further) invest in. HOLD technologies should not be used for new projects, but usually can be continued for existing projects.</li>
              </ul>

            </td><td>

              <h3>What is the purpose?</h3>

              <p>
                The techradar is a tool to inspire and support Engineering teams to pick the best technologies for new projects; it provides a platform to share knowledge and experience in technologies, to reflect on technology decisions and continuously evolve our technology landscape. Based on the <a href="https://opensource.zalando.com/tech-radar/#"> work of Zalando</a>, this techradar sets out the changes in technologies that are interesting in software development &mdash; changes that we think our engineering teams should pay attention to and use in their projects.
              </p>

              <h3>How do we maintain it?</h3>

              <p>
                The techradar is maintained by our <em>Principal Engineers</em> &mdash; who facilitate and drive the technology selection discussions across the Engineering Community. Assignment of technologies to rings is the outcome of ring change proposals, which are discussed and voted on. The techradar is open for contribution for all Engineering teams at Zalando and depends on their active participation to share lessons learned, pitfalls, and contribute to good practices on using the technologies.<br />
              </p>
            </td></tr>
        </tbody>
      </table>
    </>
  )
}

export default App
