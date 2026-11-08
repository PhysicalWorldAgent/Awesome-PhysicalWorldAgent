// Survey content shown in the README, taken from the manuscript with the authors' approval.
// Keep wording in step with the manuscript; tools/render-readme.mjs lays it out.

export const SITE_URL = "https://PhysicalWorldAgent.github.io/";
export const REPO_URL = "https://github.com/PhysicalWorldAgent/Awesome-PhysicalWorldAgent";
export const WEBSITE_REPO_URL = "https://github.com/PhysicalWorldAgent/PhysicalWorldAgent.github.io";

export const SURVEY = {
  title: "When the World Is the Test Suite",
  subtitle: "Agentic Intelligence for the Physical World",
  year: 2026,
  // [name, affiliation numbers, marks] — "†" corresponding author
  authors: [
    ["Kaixin Li", [1]],
    ["Meng Luo", [1]],
    ["Yanlin Li", [1]],
    ["Yuchen Tian", [2]],
    ["Xiang Liu", [1]],
    ["Xiangru Jian", [3]],
    ["Yan Yang", [4]],
    ["Zhiheng Xi", [5]],
    ["Yang Zhang", [1]],
    ["Ziyang Luo", [2]],
    ["Mingfei Cheng", [6]],
    ["Hongzhan Lin", [1], "†"],
  ],
  affiliations: ["NUS", "HKBU", "UWaterloo", "ANU", "Fudan", "SMU"],
  bibtexKey: "li2026world",
};

export const ABOUT = [
  "Coding agents built to repair software now write, test, and repair programs for robots. Unlike in software, the test suite does not " +
    "come with the code: whether a robot program works must be established by running it on a robot, in a physics simulator, or through " +
    "the policies it helps to train. This survey examines this emerging area, *agentic intelligence for the physical world*, by treating " +
    "the world as the program's test suite.",
  "We locate each program along two axes: where it sits relative to the actuator, from programs that act or orchestrate learned policies " +
    "to programs that write rewards and build training worlds, and what judges it, from simulator predicates and learned judges to humans " +
    "and physical outcomes. Drawing on software engineering, we identify which of its practices transfer to physical agents and which break, " +
    "and argue that progress will depend less on writing better programs than on building a physical counterpart of *continuous integration*.",
];

export const FINDINGS = [
  ["Programs are cheap; evidence is not.", "Along both axes, the same bottleneck appears: producing a program is becoming cheap, while obtaining trustworthy evidence about what it does remains costly and error-prone."],
  ["Programs win where policies are known to be weak.", "Comparisons that favor programs over end-to-end policies cover mainly changes in task structure; demonstration-trained policies keep their in-distribution advantage in most reported comparisons."],
  ["Every judge errs, and search amplifies it.", "Each kind of judge in current use has documented failure modes, and optimizing against a learned judge can amplify its errors."],
  ["Libraries can improve on average while tasks regress.", "A skill library keeps whatever its acceptance test lets through, and current reports rarely state the cost, variance, judge visibility, judge error, or sim-to-real link needed to tell gains from regressions."],
];

export const FIGURES = {
  1: ["Same program, different test suite.", "In software, the test suite usually ships with the code and returns a cheap, repeatable result. Once the program acts in the physical world, someone must build the judge, a simulator can stand in for the robot, and every physical test has to be paid for in execution."],
  2: ["When the world is the test suite.", "The kitchen robot of this article writes a program to put a moka pot on the stove (1), runs it (2), has the outcome judged (3), and repairs the program or keeps what passes (4). The two tags mark the program role and the evaluation source."],
  3: ["Organization of the article and representative work.", "Each panel is one part of the article and lists representative work discussed there."],
  4: ["Four phases of agentic intelligence for the physical world.", "Two lines of work meet here. Language models for robots moved from choosing skills to writing programs whose effects are judged through physical execution, and general-purpose coding agents from software engineering joined this line in 2026. Dashed outlines mark benchmarks."],
  5: ["Where software assumptions need support in the physical world.", "A physical task needs an explicit success criterion (1), an account of how outcomes vary between trials (2), a reset procedure (3), a budget for costly tests (4), limits on unsafe commands at the action interface (5), and a statement of what the agent can observe (6)."],
  6: ["Programs as robot policies: four questions.", "What a program can call (1), when it is revised during an episode or developed offline (2), how it coordinates learned skills (3), and when it outperforms an end-to-end policy (4)."],
  7: ["What the code-versus-VLA comparisons on LIBERO-PRO cover.", "Results on the Goal suite. Gray bars show OpenVLA, π₀, and π₀.₅ under LIBERO-PRO's five perturbations. Under its released evaluation code, a VLA receives the original instruction in the paraphrase and task conditions. Colored bars show program-based methods, which report results only under the position and task perturbations (shaded): CaP-Agent0 from CaP-X, RATs, RHO, and ASPIRE with Opus 4.6."],
  8: ["Programs for policy learning.", "A reward program shapes what a policy learns (1), and programs that build environments, demonstrations, bodies, and assets shape the conditions in which it learns (2–4)."],
  9: ["How an agent learns that a program is wrong.", "A trace locates the failing call (1), a judge decides whether the outcome counts as success (2), and simulation tests the program in place of the robot (3). Formal specifications check a program before it runs (4), other checks decide its release when physical trials are restricted (5), and a successful run can still be unsafe (6)."],
  10: ["Evaluation paths for different kinds of programs.", "Evaluation ranges from checking code to training and testing the behavior it induces. Examples from the reviewed work report budgets per execution, per candidate, or per complete search."],
  11: ["What happens to a program that passes its checks.", "It is stored in a library (1), often after a further acceptance test (2). The library then has to be maintained (3), and its skills may carry over to new robots, models, or tasks (4). Verified executions can also train a model's weights (5)."],
  12: ["What a growing skill library buys, and where it hurts.", "Zero-shot success of ASPIRE with Opus 4.6 on LIBERO-PRO Long with skill libraries seeded from increasing numbers of LIBERO-90 source tasks. The dotted line is π₀.₅ on the same benchmark. Average success rises with the library, while the task of turning on the stove and placing the moka pot, under task perturbation, falls from 0.68 to 0.26 between 50 and 90 source tasks."],
  13: ["Four challenges and future directions.", "How to divide a task between programs and learned policies (1), how verification can become reliable at a known cost (2), how skill libraries stay useful as the world changes (3), and how evaluation can be reproduced and checked against real robots (4)."],
};
// file of each figure under assets/figures, cropped from the compiled manuscript
export const FIGURE_FILE = (number) => `assets/figures/figure-${number}.webp`;

export const QUESTIONS = [
  ["RQ1", "What do programs buy an agent that acts in the physical world, and what do they cost?", "Where in the stack should the program sit, when does it outperform an end-to-end policy, and how should the two be combined?"],
  ["RQ2", "When the world is the test suite, how do agents learn that a program is wrong, and how far can that signal be trusted?", "What do traces, judges, simulators, and formal checks contribute, and what replaces physical trial when trial is not allowed?"],
  ["RQ3", "How does validated experience accumulate, and what shows that progress is real?", "When do skill libraries help or hurt, how far does their content transfer, and what must be reported for a result to be interpretable?"],
];

export const CONTRIBUTIONS = [
  ["Two coordinates for every program:", "where it sits relative to the actuator and what judges it, used to compare representative systems from action code to generated training worlds."],
  ["A comparison of programs with end-to-end policies", "across the reported studies, with what traces, judges, simulators, and formal checks can each establish about a program, and the documented failure modes of every kind of judge."],
  ["An account of how accepted programs become retained experience,", "in skill libraries and in model weights, and five quantities needed to tell progress from regression that current reports rarely state."],
  ["A transfer analysis from software testing", "of which practices carry over to physical tests and which break, with open problems each paired with a first experiment."],
];

export const OUTLINE = [
  ["1", "Introduction", "A coding agent and a moka pot · Related reviews · Contributions"],
  ["2", "The Physical World as a Test Suite", "Scope and definitions · From language models to coding agents · Program roles and evaluation sources · From software tests to physical tests"],
  ["3", "Writing Programs for the Physical World", "Programs as robot policies: primitive interfaces, online revision and offline development, orchestration of learned skills, comparison with end-to-end policies · Programs for policy learning: reward functions, training environments, demonstrations, and assets"],
  ["4", "Testing Programs Against the Physical World", "Cost of evaluation · Traces and judges · Checks in place of physical trials · Safety beyond task success"],
  ["5", "Learning from the Physical World", "Skill acquisition and validation · Skill maintenance and transfer · Experience distillation into model weights"],
  ["6", "Benchmarks and Evaluation Practice", "Benchmarks and protocols · Benchmarks for robot code repair · Limitations of current evaluation"],
  ["7", "Challenges and Future Directions", "Program representation and policy integration · Verification reliability and efficiency · Continual learning and skill maintenance · Evaluation reproducibility and real-world validity"],
  ["8", "Conclusion", ""],
  ["A", "Representative Systems by Program Role and Evaluation Source", ""],
];

// The manuscript's table of software-engineering practices that transfer: [in software, physical counterpart, examples]
export const TRANSFER = [
  ["Agent harness", "Harness that sets the robot interface, the feedback, and access to privileged state", "ASPIRE, RHO, OpenRUA"],
  ["Stack trace and logs", "Per-primitive traces with keyframes and overlays", "ASPIRE"],
  ["Repository and refactoring", "Multi-file policy repositories and rebinding skills to a new body", "RHO, RECENT"],
  ["Executable behavioral tests", "Symbolic trace properties and controller test suites in simulation", "RoboEval, test-driven framework"],
  ["Regression gate", "Practice suites and paired comparisons before accepting a skill or harness edit", "RPG, Skill2Real, HexaAnything"],
  ["Contracts", "Skill schemas, allowed operators, and encoded safety constraints", "Contract-grounded BTs, SafeGate"],
  ["Hidden tests", "Verifiers never returned to the agent and grading in a separate environment", "CodeActionBench, EmbodiedSWE"],
];

export const ASPIRE =
  "In ASPIRE's ablation on LIBERO-PRO, an execution engine and a skill library together raise macro-average success from 14% to 62%. " +
  "The engine records perception and control calls, exposes images before and after them, and re-runs candidate repairs. Evolutionary search then adds another 10 percentage points.";

export const JUDGES =
  "On FailBench, the best of thirteen detectors based on vision-language models reaches a macro-averaged balanced accuracy of only 0.77 when " +
  "judging manipulation outcomes. In OpenRUA's analysis of failed episodes, about a quarter involve a success condition absent from the instruction or a predicate that contradicts it.";

// What current reports rarely state, yet is needed to tell progress from regression: [quantity, what to report]
export const UNREPORTED = [
  ["Cost", "Model calls, GPU time, robot time, and human intervention, stated separately"],
  ["Variance", "How results spread across seeds and repeated runs"],
  ["Judge visibility", "Which checks and results the agent can see during development"],
  ["Judge error", "How often the judge accepts failures or rejects successes"],
  ["Sim-to-real link", "Whether simulated results hold in the real setting"],
];

// The manuscript's table of selected open problems: [problem, findings so far, first experiment]
export const PROBLEMS = [
  ["Physical continuous integration", "Existing trace-and-library loops, judge audits, and simulator studies motivate joint evaluation of reliability and cost", "Compare verification and acceptance procedures at matched search budgets, then audit accepted episodes and measure held-out success, retention, and cost"],
  ["Judges robust to search", "Optimizing against a learned reward model can amplify wrong-object failures", "Audit accepted programs from matched searches with and without verifier feedback, using independent outcome checks"],
  ["Code versus VLA on all splits", "The code–VLA comparisons in Figure 7 cover only the LIBERO-PRO position and task splits", "Run program-based methods on the object, paraphrase, and environment splits with re-run VLA baselines"],
  ["Staleness and retention", "Library growth gives non-monotonic per-task transfer; no robot study reviewed re-tests the entries of a stored skill library after a controlled one-factor change", "Hold the library fixed and change one world or API factor before adaptation, then measure surviving success separately from retention after library updates"],
  ["Interface for orchestration", "Most harnesses adopt one interface; reported preferences between code and typed calls depend on the model and the setting", "Compare code and typed calls on the same composition tasks and budgets, and repeat runs to measure uncertainty"],
  ["Postconditions for learned skills", "VLA skills competent from clean starts stall when chained", "Learn or check postconditions per skill, then measure chained success"],
  ["Cheap evaluations that hold early", "Forked reward comparisons are unreliable before the policy is competent, and longer forks help at higher cost", "Measure agreement of each proxy with full training at each stage of a reward search"],
  ["Code or weights", "Programs teach VLAs, and at matched development time the student matches its code teachers where demonstrations are plentiful", "Represent the same knowledge as code, documents, or weights at matched data and compute, then measure reuse and revision cost"],
  ["Issue-driven robot-software repair", "RoboBugBench grades repairs of 33 real Nav2 defects in Gazebo, and its audit shows the oracle passing counterfeit patches", "Extend audited behavioral oracles to more ROS 2 repositories, with paired regression scenarios, hidden checks, a record of the judge and budget, and real-robot confirmation"],
  ["Judging under injection", "Scene text can hijack embodied agents", "Place adversarial text in scenes judged by a VLM verifier of robot programs"],
];

export const CLOSING = "If the physical world is to serve as the test suite, its tests must be tested as well.";

export const TEASER_ALT =
  "A robot drawn in oil stick on a painted yellow ground: the words test_suite.py crossed out and replaced by THE WORLD, an apple falling with g = 9.81, and a tread that reads write, run, judge, keep."; a ribbon carries the same program to a kitchen, where the robot puts a moka pot on a stove under a camera, a simulator, a pass-fail clipboard and an hourglass.";

// BibTeX entry for the survey
export function surveyBibtex() {
  const authors = SURVEY.authors
    .map(([name]) => {
      const parts = name.split(" ");
      return `${parts.at(-1)}, ${parts.slice(0, -1).join(" ")}`;
    })
    .join(" and ");
  return [
    `@misc{${SURVEY.bibtexKey},`,
    `  title        = {${SURVEY.title}: ${SURVEY.subtitle}},`,
    `  author       = {${authors}},`,
    `  year         = {${SURVEY.year}},`,
    `  howpublished = {\\url{${REPO_URL}}},`,
    "  note         = {Manuscript}",
    "}",
  ].join("\n");
}
