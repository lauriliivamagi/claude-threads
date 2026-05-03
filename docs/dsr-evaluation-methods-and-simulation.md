# DSR Evaluation Methods And Simulation

The most widely cited taxonomy in DSR is **Hevner, March, Park & Ram (2004)**, "Design Science in Information Systems Research" (*MIS Quarterly*), which groups evaluation methods into five families:

1. **Observational** — case study, field study (deploy the artifact in a real setting and observe).
2. **Analytical** — static analysis, architecture analysis, optimization, dynamic analysis (assess structural / formal properties).
3. **Experimental** — controlled experiment, **simulation** (exercise the artifact with synthetic or stand-in data in a contrived setting).
4. **Testing** — functional (black-box) and structural (white-box) testing.
5. **Descriptive** — informed argument, scenarios (rhetorical / illustrative demonstration of utility, used when stronger evidence is impractical).

A complementary, more recent framework is **FEDS** — Venable, Pries-Heje & Baskerville (2016), "FEDS: a Framework for Evaluation in Design Science Research" (*European Journal of Information Systems*). It classifies evaluations along two orthogonal axes:

- **When:** *ex ante* (before the artifact is fully built / deployed) vs *ex post* (after).
- **How:** *naturalistic* (real users, real problem, real system) vs *artificial* (synthetic users, contrived task, or surrogate environment).

It then recommends one of four strategies — Human Risk & Effectiveness, Quick & Simple, Technical Risk & Efficacy, or Purely Technical — depending on which risks dominate.

### Is simulation one of them?

Yes. Simulation is explicitly named under Hevner et al.'s **experimental** family, and it is the canonical example of an **artificial, ex-ante** evaluation in FEDS. It is "trusted" in the methodological sense: it is an accepted, citable method when used for the right purpose — typically reducing technical risk before the artifact meets live users.

### Mapping back to the kiosk example

The text describes "running a simulation where actors play patients to test the kiosk in a controlled environment before risking real lives." That is a textbook artificial / experimental evaluation:

- **Ex ante** — performed before deployment to actual patients.
- **Artificial** — actors stand in for real patients; the ER is a controlled stand-in for the real ER.
- **Purpose** — buy down technical and safety risk cheaply, before the cost of failure becomes catastrophic.

Its limitation is exactly its strength inverted: a simulation cannot confirm that the artifact works under the messiness of a live ER (panicked patients, edge symptoms, language barriers, hardware failures). So in a rigorous DSR study you would normally pair it with a **naturalistic, ex-post** evaluation — e.g., a field study in one hospital — to corroborate that the simulated efficacy generalizes. Hevner et al.'s "observational" family (case study, field study) is the usual home for that follow-up.

In short: simulation alone is a trusted *but partial* evaluation. The DSRM's iterative Build → Evaluate → Re-build cycle is what makes the partial evidence add up to a defensible claim — each iteration shifts the evaluation a little further along the artificial → naturalistic axis as the artifact matures.
