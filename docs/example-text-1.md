**Design Science Research (DSR)** is a fantastic paradigm to test this hierarchy on because it is fundamentally different from traditional scientific research.

While natural and behavioral sciences try to understand reality as it currently is (_"What is happening?"_), Design Science Research actively tries to change reality by creating new things (_"How can we build a solution to fix this problem?"_). It is deeply rooted in Information Systems and Engineering, focusing on building and evaluating **[artifacts](./artifact-in-design-science-research.md)** (like new software, algorithms, or processes).

Let’s run DSR through the 11-step epistemological cascade.

**The Scenario:** A hospital's emergency room is severely backlogged, causing dangerous wait times. You are conducting Design Science Research to build a new AI-driven digital triage kiosk that patients will use when they walk in the door.

Here is how the layers of your research align from the deepest philosophy to the physical tools:

### Layer 1: The Bedrock (Philosophical Assumptions)

- **1. Tradition (The Culture):** _Information Systems (IS)._ You are operating within a decades-old academic tradition that studies how humans, organizations, and technology interact to improve business and social outcomes.
- **2. Ontology (The Reality):** _Pragmatism / Socio-Technical Reality._ You believe that the reality of the "waiting room backlog" is not just a law of nature; it is a human-made problem that can be physically altered and improved by introducing a new technological artifact.
  ([→ Compatible ontologies for Design Science Research](./compatible-ontologies-for-dsr.md))
- **3. Epistemology (The Knowledge):** _Pragmatic Epistemology._ You believe that "truth" and "valid knowledge" are defined by practical utility. In this research, if the AI kiosk successfully reduces wait times without harming patients, the knowledge generated is considered valid. "True" means "it works."

### Layer 2: The Mantle (Translation & Strategy)

- **4. Paradigm (The Stance):** _Design Science._ Instead of just observing the unhappy patients (Behavioral Science), your stance is to actively design, build, and implement a solution.
- **5. Theory (The Explanation):** _Queueing Theory._ You draw upon this established mathematical theory, which explains how lines form and how bottlenecks occur in service industries, to inform how your kiosk should process people.
- **6. Methodology (The Strategy):** _The DSRM (Design Science Research Methodology)._ Your overarching strategy dictates a strict, iterative cycle: **Build** the artifact, **[Evaluate](./dsr-evaluation-methods-and-simulation.md)** it in context, learn from the failures, and **Re-build** it until it solves the problem.

### Layer 3: The Surface (Action & Logistics)

- **7. Framework (The Scaffolding):** _The DSR Evaluation Framework._ You build a framework that explicitly maps what success looks like for this specific project (e.g., "We will evaluate the artifact based on _efficiency_—time to triage—and _efficacy_—accuracy of the triage compared to a human nurse").
- **8. Model (The Simplification):** _A Decision-Tree Algorithm._ Before coding, you create a visual, logical model that maps out exactly how the AI will route a patient based on their symptoms (e.g., _If symptom = 'bleeding', then priority = 'High'_).
- **9. Method (The Procedure):** _Prototyping & Field Simulation._ \* _Build Method:_ Agile prototyping to code the software.
  - _Evaluate Method:_ Running a simulation where actors play patients to test the kiosk in a controlled environment before risking real lives.
- **10. Apparatus (The Equipment):** _Hardware and Code._ The physical iPad used for the kiosk, the Python programming language used to write the algorithm, and the hospital's localized server to process the data securely.
- **11. Heuristic (The Shortcut):** _The "Chest Pain" Rule._ While the AI is designed to calculate complex probabilities, you hardcode a pragmatic safety shortcut: "If the user types the words _chest pain_, bypass all AI logic and immediately sound an alarm for a human doctor."

### The Alignment Check

Because you mapped this out, your research layers are perfectly aligned. You didn't try to use an Interpretivist epistemology (which would ask patients to write poetry about how waiting makes them feel) while using an apparatus like Python to build an algorithm.

Your belief that _truth equals practical utility_ (Pragmatism) flows flawlessly into your strategy to _build a useful solution_ (DSR), which is physically executed by coding a prototype and testing its efficiency (Method). Everything from the bedrock to the surface is pushing in the exact same direction.
