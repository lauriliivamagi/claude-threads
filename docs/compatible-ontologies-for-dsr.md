# Compatible Ontologies for Design Science Research

> Source inquiry: [INQUIRY.md](./INQUIRY.md)
> Source passage: [docs/example-text-1.md:14-15](../../docs/example-text-1.md#L14)

The source text pairs Design Science with **Pragmatism / Socio-Technical Reality** as its ontology. This note examines which ontologies are coherent with DSR, which are in tension with it, and why the text's pairing is the conventional default.

---

## Why ontology matters for DSR

DSR's defensibility hinges on a coherent answer to two questions: _what kind of thing is the artifact, and what kind of thing does it change?_ Different ontologies license different evaluation strategies. A misaligned ontology (e.g., strict subjective idealism combined with measurable thresholds) produces internal contradictions that surface as hand-waving during Peffers Phase 5 (Evaluation) and Phase 6 (Communication).

The ontology must support three DSR commitments:

1. **Artifacts are real enough to change something** — rules out pure idealism and pure subjectivism.
2. **Utility is observable and inter-subjectively measurable** — rules out radical relativism.
3. **The world is malleable, not fixed** — rules out strict positivist naturalism that treats reality as the unchanging object of description.

Anything that satisfies these three is a candidate.

---

## Compatible positions

### 1. Pragmatism (the text's choice; Vaishnavi & Kuechler 2015)

"Reality is what works." Pragmatism (Peirce, James, Dewey) sidesteps the realism/idealism debate by making _practical consequences_ the test of ontological commitment.

- **Why it fits cleanly:** the entire Peffers cycle is consequence-driven — an artifact "exists" meaningfully if it produces measurable utility. Phase 2 (Objectives) and Phase 5 (Evaluation) only need inter-subjectively stable thresholds, not metaphysical grounding.
- **Anchor:** Vaishnavi & Kuechler explicitly position pragmatism as the default DSR ontology in _Design Science Research Methods and Patterns_.

### 2. Socio-Technical Realism (the text's pairing; Mumford, Trist, Tavistock)

Reality is co-constituted by social systems (humans, organizations, norms) and technical systems (artifacts, infrastructures); neither layer is reducible to the other.

- **Why it fits:** DSR artifacts almost always intervene in this hybrid layer. The ER triage kiosk in the source example _is_ a socio-technical reconfiguration (workflow + device + nurse practice), not a pure technical object. Hevner's Relevance Cycle implicitly assumes this layered ontology.
- **Pairing logic:** pragmatism supplies the _success criterion_; socio-technical realism supplies the _kind of thing_ the artifact is.

### 3. Critical Realism (Bhaskar; defended for DSR by Carlsson, Mingers, Wynn & Williams)

A stratified real world exists (mechanisms → events → experiences) independently of observation, but our access to it is theory-mediated.

- **Why it fits:** licenses _generative_ explanations — _why_ the artifact works (mechanism), not merely _that_ it works. Yields a stronger knowledge contribution in Phase 6, because the design-knowledge claim can name causal mechanisms rather than report bare correlations.
- **When to prefer it over pragmatism:** when the artifact's _mechanism_ is itself the contribution (e.g., a novel algorithm whose insight is _why_ it outperforms baselines on a class of inputs).

### 4. Constructivism / Interpretivism (partial compatibility; Iivari, Niehaves)

Reality is socially constructed; meanings vary across stakeholders.

- **Where it fits:** excellent for Phase 1 (problem framing across stakeholder perspectives) and for evaluating _acceptance_ and _meaning-in-use_.
- **Where it strains:** pure constructivism makes universal evaluation thresholds awkward — if every stakeholder constructs the artifact differently, what does it mean for it to "work"? Usually appears as a _secondary_ lens layered over a pragmatist or critical-realist base, not as a standalone DSR ontology.

---

## Positions in tension with DSR

| Ontology                                         | Tension                                                                                                                              |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Strict positivism / naive realism**            | Treats the world as a fixed object of description. DSR's whole point is _changing_ reality, not cataloguing the unchanging.          |
| **Subjective idealism**                          | If reality is purely mental, the artifact's measurable physical effects become incoherent — Phase 4 demonstration loses its meaning. |
| **Radical relativism / postmodern anti-realism** | Makes Phase 5 evaluation impossible: no shared standard for "it works"; baseline comparison becomes incoherent.                      |

These can still inform aspects of a DSR project (e.g., critical theory can shape Phase 1 problem framing around power and equity), but they cannot serve as the _load-bearing_ ontology because they undercut DSR's evaluation backbone.

---

## Why the text picks Pragmatism + Socio-Technical Reality

This pairing is the _minimum-friction_ ontological commitment for DSR:

- **Pragmatism** licenses the success criterion ("truth = utility") that Phase 5 needs.
- **Socio-technical realism** licenses the _kind_ of intervention (kiosk + workflow + nurses + patients) that Phase 4 demonstrates.

It is the position that lets you do DSR without first having to defend a contested metaphysics. That is exactly why it dominates introductory and applied DSR literature: it gets out of the way.

---

## Trade-offs across the compatible set

| Ontology                    | Strength                                                               | Cost                                                          |
| --------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| Pragmatism                  | Lowest philosophical overhead; success criterion built in              | Weak on _why_ artifacts work; limits theoretical contribution |
| Socio-technical realism     | Honest about the artifact's true scope (people + tech)                 | Doesn't, by itself, define what "truth" or "validity" mean    |
| Critical realism            | Strongest mechanism-level explanations; deepest knowledge contribution | Higher philosophical overhead; demands explicit theorizing    |
| Constructivism (as overlay) | Captures meaning-in-use, stakeholder plurality                         | Cannot ground universal evaluation thresholds alone           |

---

## Recommendation

- **Default for most DSR projects:** Pragmatism + Socio-Technical Realism. Well-trodden, defensible without extra philosophical work, aligned with both Hevner and Peffers traditions.
- **Upgrade to Critical Realism** when the _mechanism_ (not just the working artifact) is the contribution you want to publish.
- **Layer in Constructivism** as a secondary lens during Phase 1 (problem framing) and Phase 5 (acceptance evaluation) when stakeholder plurality is decisive.
- **Avoid as load-bearing ontology:** strict positivism, subjective idealism, radical relativism — each breaks at least one DSR phase.

The text's choice is conservative and correct for an introductory walkthrough; the ontology disappears into the background and lets the methodology do the work. A research project with higher epistemic ambitions would deliberately pay the extra cost of critical realism to cash out a deeper knowledge contribution in Phase 6.
