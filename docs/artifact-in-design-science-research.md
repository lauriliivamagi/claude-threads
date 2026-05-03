# Artifact in Design Science Research

In Design Science Research, "artifact" is a term of art — not a casual word for "thing we built." It carries a precise meaning inherited from Herbert Simon's _The Sciences of the Artificial_ (1969) and codified for IS research by March & Smith (1995) and Hevner et al. (2004).

### Definition

An **artifact** is a human-made object created with intent to address a recognized problem in a real context. It is _purposive_ (designed for a goal), _contingent_ (its form depends on context and constraints), and _evaluable_ (its worth is judged against utility, not against "what nature is").

This is what separates DSR from natural and behavioral science: those sciences study what exists; DSR brings into existence something that did not exist before, and then studies whether it works.

### The classical typology (March & Smith 1995)

Four kinds of artifact, in increasing order of concreteness:

1. **Constructs** — the vocabulary and symbols of a domain. The conceptual building blocks researchers and practitioners use to describe problems and solutions. _Example:_ the terms "triage level," "wait time," "acuity score" in the kiosk scenario.
2. **Models** — abstractions and representations that show how constructs relate. They simplify reality for reasoning and communication. _Example:_ the decision-tree algorithm in step 8 of the cascade.
3. **Methods** — procedures, algorithms, or guidelines for performing a task. They prescribe _how_ to do something. _Example:_ the agile prototyping process used to build the kiosk software.
4. **Instantiations** — the operational, working realization of constructs, models, and methods in a concrete system. The thing that actually runs. _Example:_ the deployed iPad kiosk itself, with its code executing in the hospital.

Hevner et al. (2004) later added a fifth, controversial category: **better theories** — design knowledge that emerges from the build–evaluate cycle and generalizes beyond the single instance.

### What counts as an artifact in the example text

The passage names "software, algorithms, or processes." Mapped to the typology:

- _Software_ → instantiation
- _Algorithms_ → method (when described abstractly) or instantiation (when running)
- _Processes_ → method

The triage kiosk scenario actually produces all four kinds simultaneously: the vocabulary of triage priorities (constructs), the decision tree (model), the prototyping and evaluation procedure (method), and the working kiosk (instantiation).

### Why the distinction matters

- **Evaluation criteria differ.** You evaluate a construct on clarity and completeness; a model on fidelity and simplicity; a method on efficiency and generality; an instantiation on effectiveness and efficiency in use. Conflating these leads to category errors in evaluation.
- **Knowledge contribution differs.** A novel construct reshapes how a field talks about a problem. A novel instantiation may just be one more app. Funders, reviewers, and journals weigh these differently.
- **Reusability differs.** Constructs and methods travel across contexts; instantiations are usually bound to their setting. A DSR project that produces only an instantiation has shallower scientific contribution than one that abstracts a reusable method from it.

### Common misuses

- Treating "artifact" as a synonym for "deliverable" or "prototype" — it is broader.
- Calling any software an artifact regardless of whether it was designed to address a stated problem — DSR artifacts are _purposive_; a side-project app is not automatically a DSR artifact.
- Forgetting that documentation, design principles, and conceptual frameworks are also artifacts — the term is not restricted to executable code.

### Adjacent vocabulary

- **Design principle** — a prescriptive statement abstracted from one or more artifacts ("a triage system should fail safe toward higher acuity"). Often the most reusable knowledge a DSR project produces.
- **Design theory** (Gregor & Jones 2007) — a structured account of an artifact's purpose, principles, and justificatory knowledge. The most ambitious knowledge contribution form in DSR.
- **Kernel theory** — an existing theory (here, queueing theory) that justifies why a designed artifact should work. The artifact instantiates and tests the kernel theory's implications.
