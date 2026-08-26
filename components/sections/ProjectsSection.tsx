import Eyebrow from "@/components/ui/Eyebrow";

const projects = [
  ["VERTEX TOWER", "Mixed Use / Residential"],
  ["NEXUS CAMPUS", "Cultural / Commercial"],
  ["AURELIA HOUSE", "Mixed Use / Residential"],
  ["CIVIC FORUM", "Cultural / Commercial"],
];

export default function ProjectsSection() {
  return (
    <section className="projects" id="work">
      <div className="section-head">
        <div>
          <Eyebrow>04 — SELECTED WORK</Eyebrow>
          <h2>
            BUILDINGS
            <br />
            <em>WITH LOGIC.</em>
          </h2>
        </div>

        <p>
          Selected projects where architectural ambition and structural
          intelligence are developed together.
        </p>
      </div>

      <div className="project-grid">
        {projects.map(([name, category], index) => (
          <article className="project" key={name}>
            <div className={`project-visual v${index + 1}`}>
              <span>0{index + 1}</span>
              <div className="mini-building" />
            </div>

            <div className="project-info">
              <div>
                <h3>{name}</h3>
                <p>{category}</p>
              </div>
              <span>→</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
