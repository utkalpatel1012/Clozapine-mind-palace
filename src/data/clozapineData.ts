import {
  PalaceRoom,
  ReferenceArticle,
  RecentAdvanceItem,
  UnderStudyItem,
  DrugInteractionScenario,
} from "../types";

export const PALACE_ROOMS: PalaceRoom[] = [
  {
    id: "history",
    doorNumber: 1,
    name: "The Archive of Genesis & Origins",
    subtitle: "From 1958 Swiss Synthesis to the 20-Year Survival Paradox",
    icon: "Hourglass",
    doorLabel: "Door I • Historical Odyssey",
    roomArchetype: "Gilded Neoclassical Library with towering mahogany bookshelves and brass astronomical clocks",
    themeColor: {
      badge: "bg-amber-950/60 text-amber-300 border-amber-800/60",
      glow: "from-amber-600/20 via-orange-950/10 to-transparent",
      border: "border-amber-700/50",
      bgGradient: "from-stone-950 via-[#14120f] to-[#0d0d12]",
      accentHex: "#d97706",
    },
    architecturalAtmosphere:
      "A soaring vaulted archive paved in polished travertine marble. Soft golden candlelight flickers across ancient leather-bound trial ledgers, brass balances, and a marble memorial wall dedicated to Finnish pharmacovigilance.",
    spatialLoci: [
      {
        id: "locus-1958-flask",
        name: "The 1958 Swiss Alchemical Alembic",
        objectVisual: "A crystalline alembic on a dark oak pedestal, bubbling with a glowing yellow dibenzodiazepine solution.",
        spatialSpot: "North alcove beneath the arched stained-glass window",
        memoryHook: "Remember 'WANDER AG': Clozapine was synthesized in 1958 by Wander AG in Bern, Switzerland, as the first atypical antipsychotic that refused to cause catalepsy in animal models.",
        scientificFact: "Synthesized in 1958 as a tricyclic dibenzodiazepine derivative. Defied the classic dopamine hypothesis of the 1960s because it demonstrated potent antipsychotic activity in humans without inducing extrapyramidal symptoms (EPS) or catalepsy in rodents.",
        clinicalAction: "Recognize that clozapine is the founding prototype of atypical antipsychotics, whose lack of motor side effects initially led researchers to mistakenly doubt its efficacy.",
        categoryTag: "Discovery",
      },
      {
        id: "locus-1975-monument",
        name: "The Finnish Black Granite Cenotaph (1975)",
        objectVisual: "A cracked slab of midnight-black granite with 16 weeping frost crystals etched into its face.",
        spatialSpot: "Eastern recess, bathed in deep crimson twilight",
        memoryHook: "Remember '16 in FINLAND': In 1975, 16 fatal cases of agranulocytosis in southwestern Finland halted the drug worldwide and forged modern pharmacovigilance.",
        scientificFact: "Between June and July 1975, an epidemic of severe agranulocytosis struck 17 psychiatric patients in Finland (16 deaths from secondary sepsis). Clozapine was promptly withdrawn from clinical use across the globe.",
        clinicalAction: "Always appreciate why hematologic surveillance exists today: Clozapine's withdrawal directly spurred the creation of mandatory blood monitoring registries.",
        categoryTag: "Crisis & Safety",
      },
      {
        id: "locus-1988-kane-scroll",
        name: "The Kane 1988 Golden Scroll of Resuscitation",
        objectVisual: "An illuminated parchment held aloft by two bronze hands, glowing with the numbers 30% vs 4%.",
        spatialSpot: "Central plinth on the marble compass rose",
        memoryHook: "Remember 'KANE 1988': John Kane's landmark multicenter double-blind trial proved 30% of treatment-resistant patients responded to clozapine vs only 4% on chlorpromazine.",
        scientificFact: "Kane et al. (1988) studied 268 hospitalized treatment-resistant schizophrenia (TRS) patients who had failed at least three previous antipsychotics. Clozapine produced a 30% response rate on BPRS versus 4% for chlorpromazine (p < 0.001).",
        clinicalAction: "Establish failure of >= 2 adequate antipsychotic trials before initiating, but do not delay clozapine indefinitely once resistance is proven.",
        categoryTag: "Landmark Trial",
      },
      {
        id: "locus-20year-clock",
        name: "The 20-Year Survival Astral Clockwork",
        objectVisual: "A grandfather clock whose pendulum swings between a skull and an hourglass, radiating emerald light.",
        spatialSpot: "Western wall beside the registry shelves",
        memoryHook: "Remember 'TIIHONEN MORTALITY PARADOX': Despite metabolic and hematologic risks, clozapine patients have the LOWEST all-cause mortality due to an 80% reduction in completed suicides.",
        scientificFact: "Tiihonen et al.'s nationwide 20-year Finnish cohort (n=62,252) demonstrated that clozapine was associated with the lowest all-cause mortality of all antipsychotics (adjusted hazard ratio 0.39 compared to no antipsychotic use), largely driven by massive reductions in suicide and cardiovascular hospitalization through regular contact.",
        clinicalAction: "Reassure anxious clinicians and families: monitored clozapine saves more lives than its adverse effects risk.",
        categoryTag: "Epidemiology",
      },
    ],
    keyMetrics: [
      { label: "Year Synthesized", value: "1958", detail: "Wander AG (Bern, Switzerland)" },
      { label: "Finnish Tragedy", value: "1975", detail: "16 deaths triggered worldwide withdrawal" },
      { label: "Kane Trial Efficacy", value: "30% vs 4%", detail: "Clozapine vs Chlorpromazine in TRS (p < 0.001)" },
      { label: "FDA Approval", value: "1989", detail: "First drug approved with mandatory monitoring" },
    ],
    subtopics: [
      {
        title: "The Paradigm Shift of Atypicality",
        content:
          "Prior to clozapine, neuroleptic dogma asserted that extrapyramidal symptoms (EPS) and neuroleptic catalepsy were obligatory markers of antipsychotic potency. Clozapine completely dismantled this assumption, opening the modern era of second-generation psychopharmacology.",
        keyPoints: [
          "Defied the classical D2 dopamine blockade requirement for antipsychotic action.",
          "Demonstrated near-zero propensity for catalepsy and tardive dyskinesia.",
          "Showed unique neurobiological efficacy in negative, cognitive, and affective domains.",
        ],
      },
      {
        title: "The Finnish Catastrophe and Birth of Pharmacovigilance",
        content:
          "The Finnish outbreak was characterized by sudden, fulminant granulocytopenia within the first 12 weeks of treatment. Investigations revealed the idiosyncratic, immune-mediated nature of the reaction, which ultimately allowed the drug to be safely resurrected under strict laboratory registries.",
        keyPoints: [
          "First systematic implementation of pre-marketing and post-marketing hematologic safety gates.",
          "Demonstrated that a drug with lethal potential can be redeemed with disciplined laboratory protocols.",
        ],
      },
    ],
    clinicalPearls: [
      "Clozapine remains the only antipsychotic with FDA approval specifically for reducing suicidal behavior in schizophrenia/schizoaffective disorder.",
      "The average delay to starting clozapine in treatment-resistant schizophrenia is tragically 4-5 years, despite guidelines recommending prompt initiation after two failed trials.",
    ],
    referenceIds: ["kane1988", "tiihonen2019", "essali2009"],
  },
  {
    id: "indications",
    doorNumber: 2,
    name: "The Clinical Sanctuary & Prescribing Indications",
    subtitle: "Evidence-Based Boundaries, TRS Definitions, and Suicidality",
    icon: "ShieldAlert",
    doorLabel: "Door II • Clinical Indications",
    roomArchetype: "High Gothic Chapter House with carved stone reliefs of the human psyche",
    themeColor: {
      badge: "bg-indigo-950/60 text-indigo-300 border-indigo-800/60",
      glow: "from-indigo-600/20 via-blue-950/10 to-transparent",
      border: "border-indigo-700/50",
      bgGradient: "from-slate-950 via-[#0c1220] to-[#0a0e17]",
      accentHex: "#6366f1",
    },
    architecturalAtmosphere:
      "Arched ribbed vaults echo with clinical precision. In the center stands a triptych of marble thrones representing the three cardinal therapeutic pillars: Treatment Resistance, Suicide Prevention, and Parkinsonian Psychosis.",
    spatialLoci: [
      {
        id: "locus-trs-gateway",
        name: "The Triple-Iron Lock Gate (TRS Criteria)",
        objectVisual: "A three-bolt iron gate inscribed with '2 Failed Antipsychotics • Adequate Dose • 6 Weeks'.",
        spatialSpot: "Western entrance portico",
        memoryHook: "Remember 'TWO FAILS FOR 6 WEEKS': TRS is clinically defined as non-response to >= 2 adequate antipsychotic trials (including at least one atypical) for >= 6 weeks at target doses.",
        scientificFact: "Treatment-resistant schizophrenia (TRS) affects approximately 30% of all schizophrenia patients. Response to a third non-clozapine antipsychotic drops to under 5-7%, whereas clozapine achieves a 30-60% response rate.",
        clinicalAction: "Audit the patient's pharmacotherapy history: if two trials of sufficient dose/duration (chlorpromazine equivalents >= 400-600 mg/day) have failed, order baseline clozapine workup immediately.",
        categoryTag: "Core Indication",
      },
      {
        id: "locus-suicide-chalice",
        name: "The Silver Chalice with Severed Braided Cord",
        objectVisual: "A gleaming silver chalice beside a cleanly severed noose cord, bathed in sapphire light.",
        spatialSpot: "Southern sanctuary altar",
        memoryHook: "Remember 'INTERSEPT 2002': The International Suicide Prevention Trial proved clozapine reduces suicidal behavior by 26% compared to olanzapine.",
        scientificFact: "FDA granted approval in 2002 for reducing the risk of recurrent suicidal behavior in schizophrenia and schizoaffective disorder based on the InterSePT trial (n=980), showing a significant 26% risk reduction (p = 0.03) against active comparator olanzapine.",
        clinicalAction: "Actively consider clozapine in any schizophrenia patient with chronic high suicide risk, self-harm gestures, or command auditory hallucinations instructing suicide, regardless of TRS status.",
        categoryTag: "FDA Indication",
      },
      {
        id: "locus-parkinson-feather",
        name: "The Weightless Peacock Feather of Parkinson's",
        objectVisual: "A golden feather resting upon a delicate balance scale that does not tilt by even a milligram.",
        spatialSpot: "Eastern niche surrounded by anatomical diagrams of the substantia nigra",
        memoryHook: "Remember 'MICRO-DOSE PARKINSON'S (6.25-50 mg)': Clozapine treats L-DOPA induced psychosis without worsening motor tremor or rigidity due to low D2 occupancy.",
        scientificFact: "In Parkinson's disease psychosis (PDP), classic neuroleptics cause disastrous motor freezing. Clozapine at ultra-low doses (6.25 to 50 mg at bedtime) resolves hallucinations without motor deterioration (PSYCLOPS trial).",
        clinicalAction: "Start at 6.25 mg at bedtime for Parkinson's psychosis; titrate cautiously by 6.25-12.5 mg every 3-5 days; therapeutic response typically occurs well below 50 mg/day.",
        categoryTag: "Special Population",
      },
      {
        id: "locus-aggression-shield",
        name: "The Aegis of Restraint (Hostility & Violence)",
        objectVisual: "A bronze shield that absorbs thrown spears, dissipating flame into harmless violet vapor.",
        spatialSpot: "Northern wall across from the pharmacotherapy archives",
        memoryHook: "Remember 'ANTI-AGGRESSION EFFECT': Clozapine exerts a specific anti-hostility, anti-impulsivity effect distinct from its sedative properties.",
        scientificFact: "Double-blind comparative trials (Volavka et al.) demonstrate that clozapine has specific, persistent anti-aggressive and anti-hostility properties in psychotic patients, superior to haloperidol, risperidone, and olanzapine.",
        clinicalAction: "In forensic psychiatry and inpatient units with refractory severe violence or psychopathic features in psychosis, evaluate clozapine as a frontline stabilizing agent.",
        categoryTag: "Off-Label / Consensus",
      },
    ],
    keyMetrics: [
      { label: "TRS Prevalence", value: "30%", detail: "Proportion of all schizophrenia cases" },
      { label: "Success After 2 Fails", value: "30-60%", detail: "Clozapine efficacy vs <7% for typicals" },
      { label: "Suicide Risk Reduction", value: "-26%", detail: "InterSePT trial vs Olanzapine (HR 0.74)" },
      { label: "Parkinson's Target Dose", value: "6.25-50 mg", detail: "Fraction of standard psychiatric dosing" },
    ],
    subtopics: [
      {
        title: "Defining True Treatment Resistance (TRS)",
        content:
          "The Consensus Criteria for Treatment-Resistant Schizophrenia (TRRIP working group) require: (1) Valid diagnosis of schizophrenia; (2) Adequate treatment with at least two different antipsychotics at chlorpromazine equivalent >= 600 mg/day for at least 6 weeks each; (3) Assured adherence via pharmacy records or long-acting injectables; (4) Persistent moderate or severe functional impairment.",
        keyPoints: [
          "Pseudo-resistance due to non-adherence must be ruled out before clozapine initiation.",
          "Clozapine should not be withheld as a 'drug of last resort' when criteria are met.",
        ],
      },
      {
        title: "Clozapine in Treatment-Resistant Bipolar Disorder",
        content:
          "While off-label in most jurisdictions, clozapine demonstrates high efficacy in treatment-resistant bipolar mania, rapid cycling, and mixed episodes. Retrospective and open-label trials show dramatic reductions in mood episode frequency and hospital admissions.",
        keyPoints: [
          "Considered when lithium, valproate, and multiple SGAs have failed.",
          "Mood-stabilizing response observed even without frank psychosis.",
        ],
      },
    ],
    clinicalPearls: [
      "In treatment-resistant schizophrenia, starting clozapine early (within the first 2-3 years of onset) yields substantially higher remission rates than starting after decades of refractory illness.",
      "Clozapine is the only antipsychotic shown in meta-analyses to improve both substance abuse comorbidities and primary psychotic symptoms simultaneously.",
    ],
    referenceIds: ["kane1988", "siskind2016", "meltzer2003"],
  },
  {
    id: "pharmacodynamics",
    doorNumber: 3,
    name: "The Synaptic Observatory (Receptor Pharmacology)",
    subtitle: "D2 Fast-Off Dissociation, 5-HT2A Antagonism, and Muscarinic Dualism",
    icon: "Atom",
    doorLabel: "Door III • Receptor Architecture",
    roomArchetype: "An astronomical observatory dome where synaptic receptors orbit like celestial constellations",
    themeColor: {
      badge: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60",
      glow: "from-emerald-600/20 via-teal-950/10 to-transparent",
      border: "border-emerald-700/50",
      bgGradient: "from-slate-950 via-[#0a1813] to-[#07120e]",
      accentHex: "#10b981",
    },
    architecturalAtmosphere:
      "A domed celestial observatory where neon-green receptor binding curves and 3D molecular meshes project onto polished obsidian floors. Holographic synaptic clefts display ligand docking in real time.",
    spatialLoci: [
      {
        id: "locus-d2-revolving-door",
        name: "The Revolving D2 Crystal Gate ('Fast-Off' Kinetics)",
        objectVisual: "A revolving glass turnstile that spins at breakneck speed, releasing dopamine keys within milliseconds.",
        spatialSpot: "Center of the observatory dome",
        memoryHook: "Remember 'LOOSE BINDING / FAST-OFF': Clozapine has low affinity for D2 (Ki ~125-160 nM) and rapidly unbinds, occupying only 30-60% of striatal receptors, leaving motor circuits unharmed.",
        scientificFact: "Unlike haloperidol (Ki ~1 nM, tight binding, >75% occupancy triggering EPS), clozapine's rapid dissociation rate allows endogenous dopamine bursts to displace it. Striatal D2 occupancy rarely exceeds 60%, safely below the 78-80% threshold for extrapyramidal symptoms and hyperprolactinemia.",
        clinicalAction: "Expect virtually zero risk of Parkinsonism or dystonia; do not prescribe anticholinergics for EPS prophylaxis, which only worsens constipation and memory.",
        categoryTag: "Dopaminergic Kinetics",
      },
      {
        id: "locus-5ht2a-prism",
        name: "The Hexagonal Serotonin 5-HT2A Prism",
        objectVisual: "A large amethyst prism that splits incoming light into violet beams, muting 5-HT2A while freeing prefrontal dopamine.",
        spatialSpot: "Northwest gallery overlooking the cortical projection map",
        memoryHook: "Remember 'HIGH 5-HT2A / LOW D2 RATIO': Clozapine binds 5-HT2A (Ki ~5-10 nM) over 10 times more avidly than D2, disinhibiting prefrontal dopamine release to improve negative symptoms.",
        scientificFact: "5-HT2A antagonism on cortical glutamatergic and GABAergic interneurons disinhibits dopaminergic firing in the mesocortical pathway, relieving negative symptoms and counteracting striatal motor impairment.",
        clinicalAction: "Appreciate why clozapine improves affective flattening and social withdrawal compared to first-generation neuroleptics.",
        categoryTag: "Serotonergic Modality",
      },
      {
        id: "locus-muscarinic-scales",
        name: "The Sialorrhea Paradox (Muscarinic M1/M4 Scale)",
        objectVisual: "A golden set of scales balancing a dry sponge on one side and an overflowing silver cup of saliva on the other.",
        spatialSpot: "South vestibule beside the salivary drainage canal",
        memoryHook: "Remember 'PARENT BLOCKS M1, NORCLOZAPINE STIMULATES M4': Parent clozapine is anticholinergic, but active metabolite Norclozapine is an M1/M4 partial agonist. M4 agonism + alpha-2 blockade causes profuse nocturnal sialorrhea (drooling)!",
        scientificFact: "Parent clozapine has strong antagonistic affinity at muscarinic M1, M2, M3, and M5 receptors. However, its primary metabolite, N-desmethylclozapine (norclozapine), is a potent allosteric/partial agonist at M1 and M4 receptors. Coupled with alpha-2 adrenergic blockade and impaired pharyngeal swallowing reflex during sleep, 30-80% of patients experience severe nocturnal hypersalivation.",
        clinicalAction: "Prescribe sublingual 1% atropine ophthalmic drops (1-2 drops under the tongue at bedtime) or ipratropium nasal spray; counsel patients to sleep on a towel.",
        categoryTag: "Muscarinic Dualism",
      },
      {
        id: "locus-h1-alpha-lead-weight",
        name: "The Lead Anchor of Sedation & Orthostasis (H1 & Alpha-1)",
        objectVisual: "A massive iron anchor inscribed with 'H1 (Ki 1.1 nM) • Alpha-1A (Ki 1.6 nM)' resting in soft sand.",
        spatialSpot: "Eastern portal leading down into the hemodynamic basement",
        memoryHook: "Remember 'H1 SEDATES, ALPHA-1 DROPS PRESSURE': Potent H1 and alpha-1 antagonism causes heavy daytime sedation, rapid orexigenic weight gain, and acute postural orthostatic syncope.",
        scientificFact: "Clozapine binds H1 with extremely high affinity (Ki = 1.1 nM), driving histamine-mediated sedation, carbohydrate craving, and metabolic dysregulation through hypothalamic AMPK activation. Alpha-1 adrenergic blockade causes peripheral vasodilation, reflex tachycardia, and orthostatic dizziness.",
        clinicalAction: "Administer the majority or entirety of daily dose at bedtime; educate patient to rise slowly from supine position to avoid syncopal falls.",
        categoryTag: "Histamine & Adrenergic",
      },
    ],
    keyMetrics: [
      { label: "D2 Binding Affinity (Ki)", value: "125-160 nM", detail: "Low affinity, rapid dissociation" },
      { label: "Striatal D2 Occupancy", value: "30-60%", detail: "Below the 78% threshold for EPS" },
      { label: "5-HT2A Affinity (Ki)", value: "5-10 nM", detail: "10-20x higher affinity than D2" },
      { label: "H1 Histamine Affinity", value: "1.1 nM", detail: "Profound sedation and orexigenesis" },
    ],
    subtopics: [
      {
        title: "The Norclozapine (NDMC) Cognitive Paradox",
        content:
          "Norclozapine (N-desmethylclozapine) possesses distinct pharmacodynamic properties from parent clozapine. It acts as a potent partial agonist at muscarinic M1 and M4 receptors and potentiates NMDA receptor neurotransmission via hippocampal CA1 allosteric mechanisms, contributing to clozapine's unique pro-cognitive signal.",
        keyPoints: [
          "M1 partial agonism enhances hippocampal synaptic plasticity and long-term potentiation (LTP).",
          "Explains why clozapine can improve cognitive flexibility where D2 antagonists impair it.",
        ],
      },
      {
        title: "Alpha-2 Adrenergic Antagonism and Norepinephrine Surge",
        content:
          "Clozapine blocks presynaptic alpha-2 autoreceptors, triggering a dramatic increase in central and peripheral norepinephrine outflow. This contributes to resting sinus tachycardia and is a hallmark signature of clozapine autonomic pharmacology.",
        keyPoints: [
          "Resting heart rate frequently increases by 10-15 beats per minute.",
          "Persistent tachycardia (>100 bpm) must be evaluated to distinguish benign adrenergic outflow from acute myocarditis.",
        ],
      },
    ],
    clinicalPearls: [
      "Unlike haloperidol or risperidone, clozapine virtually never causes sustained hyperprolactinemia because its low D2 occupancy in the tuberoinfundibular tract spares anterior pituitary lactotroph regulation.",
      "The norclozapine/clozapine ratio provides invaluable clinical guidance: a high ratio (>0.8-1.0) correlates with greater metabolic weight gain and sedation, whereas a low ratio (<0.5) indicates slow metabolism or compliance anomalies.",
    ],
    referenceIds: ["kapur2001", "seeman2002", "steele1993"],
  },
  {
    id: "pharmacokinetics",
    doorNumber: 4,
    name: "The Pharmacokinetic Laboratory (Metabolism & TDM)",
    subtitle: "CYP1A2 70% Highway, Smoking Induction/Cessation, and the 350-600 ng/mL Window",
    icon: "FlaskConical",
    doorLabel: "Door IV • PK & Metabolism",
    roomArchetype: "An intricate apothecary laboratory with bubbling glass condensers, spectrophotometers, and chromatography columns",
    themeColor: {
      badge: "bg-cyan-950/60 text-cyan-300 border-cyan-800/60",
      glow: "from-cyan-600/20 via-sky-950/10 to-transparent",
      border: "border-cyan-700/50",
      bgGradient: "from-slate-950 via-[#07131b] to-[#040e14]",
      accentHex: "#06b6d4",
    },
    architecturalAtmosphere:
      "A labyrinth of glass tubing carrying luminous fluids of varying viscosity. A central copper combustion furnace vents tobacco smoke, demonstrating hepatic enzyme induction.",
    spatialLoci: [
      {
        id: "locus-cyp1a2-furnace",
        name: "The 70% CYP1A2 Hepatic Furnace & Tobacco Stack",
        objectVisual: "A roaring copper blast furnace fed by dried tobacco leaves, incinerating clear liquid into metabolic vapor.",
        spatialSpot: "Center wall of the pharmacokinetic distillery",
        memoryHook: "Remember 'TOBACCO SMOKE INDUCES CYP1A2': Hydrocarbons in smoke induce CYP1A2 by 50%. When a patient STOPS smoking, clozapine levels DOUBLE within 3-5 days, triggering lethal toxicity!",
        scientificFact: "CYP1A2 is responsible for ~70% of clozapine clearance (minor roles by CYP2D6, CYP3A4, CYP2C19). Polycyclic aromatic hydrocarbons (PAHs) in cigarette smoke—NOT nicotine—powerfully induce hepatic CYP1A2. Smokers require 30-50% higher doses. Abrupt smoking cessation removes induction, causing plasma levels to skyrocket.",
        clinicalAction: "Ask about smoking status at EVERY visit. If a hospitalized or outpatient smoker stops smoking (e.g. smoke-free psychiatric ward), cut the clozapine dose by 30-50% immediately to prevent toxicity and seizures.",
        categoryTag: "Enzyme Induction",
      },
      {
        id: "locus-caffeine-fluvox-flask",
        name: "The Fluvoxamine & Espresso Pressure Gauge",
        objectVisual: "A glass flask overflowing with dark espresso beside a vial of fluvoxamine, sending a pressure mercury tube to the ceiling.",
        spatialSpot: "North shelf above the analytical balances",
        memoryHook: "Remember 'FLUVOXAMINE & CAFFEINE BLOCK 1A2': Fluvoxamine increases clozapine levels by 5-10 fold! Even 4-5 cups of coffee can boost levels by 50%.",
        scientificFact: "Fluvoxamine is an ultra-potent CYP1A2 and CYP2C19 inhibitor; co-administration can increase clozapine plasma concentrations by 500-1000%, precipitating coma and seizures. Caffeine competes for CYP1A2 and increases levels by 20-50%. Ciprofloxacin also causes severe CYP1A2 inhibition.",
        clinicalAction: "Avoid fluvoxamine completely; switch to sertraline or escitalopram if an SSRI is needed. Caution patients against drastically changing daily coffee intake.",
        categoryTag: "Drug Interactions",
      },
      {
        id: "locus-therapeutic-manometer",
        name: "The Golden Hydrometer of TDM (350 - 600 ng/mL)",
        objectVisual: "A calibrated golden glass manometer floating in a tube of amber serum, marked with a bright green zone between 350 and 600.",
        spatialSpot: "East testing station beside the automated centrifuge",
        memoryHook: "Remember '350 FOR EFFICACY, 600 FOR SEIZURE RISK': Trough clozapine levels <350 ng/mL risk clinical failure; levels >600 ng/mL sharply increase toxic seizure risk.",
        scientificFact: "Therapeutic drug monitoring (TDM) establishes that a 12-hour trough level >= 350 ng/mL is required for optimal therapeutic response in TRS. Between 350-600 ng/mL is the target window. Levels exceeding 600 ng/mL yield diminishing returns and escalate seizure risk; levels >1000 ng/mL are considered critical toxicity.",
        clinicalAction: "Always draw blood exactly 12 hours post-evening dose (trough level) at steady state (after >= 5-7 days of stable dosing).",
        categoryTag: "Therapeutic Drug Monitoring",
      },
      {
        id: "locus-half-life-hourglass",
        name: "The 12-Hour Dual-Chamber Hourglass (ADME)",
        objectVisual: "A dual-bulb brass hourglass where sand drains in exactly 12 hours on day one, and 14-16 hours at steady state.",
        spatialSpot: "Southwest desk of the pharmacologist",
        memoryHook: "Remember 'Tmax 2h • T1/2 12-14h • 60% BIOAVAILABILITY': Rapid oral absorption with extensive first-pass hepatic metabolism.",
        scientificFact: "Oral bioavailability is 50-60% due to first-pass extraction. Peak plasma concentration (Tmax) occurs at 1.5 to 2.5 hours. Steady-state elimination half-life averages 12 to 14 hours (range 8-30h). Food does not significantly alter bioavailability.",
        clinicalAction: "Administer divided doses (or predominantly at bedtime) to smooth peak-trough fluctuations and minimize daytime sedation.",
        categoryTag: "Basic ADME",
      },
    ],
    keyMetrics: [
      { label: "Major Clearance Pathway", value: "CYP1A2 (70%)", detail: "Minor CYP2D6, CYP3A4, CYP2C19" },
      { label: "Therapeutic Trough Window", value: "350 - 600 ng/mL", detail: "Draw 12 hours post-dose" },
      { label: "Smoking Effect on Levels", value: "-30% to -50%", detail: "PAH induction; cessation doubles levels" },
      { label: "Fluvoxamine Effect", value: "+500% to +1000%", detail: "Severe 1A2 inhibition (Contraindicated)" },
    ],
    subtopics: [
      {
        title: "Metabolic Ratio: Clozapine / Norclozapine",
        content:
          "Normal metabolic ratio of clozapine to norclozapine at steady state is typically 1.0 to 1.5. A ratio > 2.0 indicates CYP1A2 saturation, enzyme inhibition, or acute ingestion. A ratio < 0.5 suggests rapid metabolism or non-steady-state trough sampling.",
        keyPoints: [
          "Norclozapine has a longer half-life (~20-30 hours) than parent clozapine.",
          "High norclozapine levels contribute disproportionately to sedation, metabolic syndrome, and weight gain.",
        ],
      },
      {
        title: "Infection, Inflammation, and Clozapine Toxicity",
        content:
          "Severe systemic infections and viral illnesses release pro-inflammatory cytokines (IL-6, TNF-alpha, IFN-gamma) that downregulate hepatic CYP1A2 transcription. Patients with acute pneumonia, COVID-19, or sepsis can experience a sudden doubling of clozapine levels, developing toxicity while on their usual maintenance dose.",
        keyPoints: [
          "Check clozapine levels and monitor closely during any acute febrile infection.",
          "Temporary dose reduction by 30-50% is standard during significant inflammatory illness.",
        ],
      },
    ],
    clinicalPearls: [
      "Nicotine replacement patches or gums do NOT induce CYP1A2. It is solely the polycyclic aromatic hydrocarbons in the inhaled smoke of burning plant matter that activates the AhR receptor.",
      "Omeprazole is a mild CYP1A2 inducer; pantoprazole has negligible CYP1A2 interaction and is the preferred PPI for clozapine patients.",
    ],
    referenceIds: ["rostami2004", "meyer2021", "deleon2020"],
  },
  {
    id: "blackbox",
    doorNumber: 5,
    name: "The Chamber of Black Box Warnings & Lethal Risks",
    subtitle: "The 5 FDA Black Box Warnings and the Silent Killer: Gastrointestinal Hypomotility",
    icon: "Skull",
    doorLabel: "Door V • Black Box Warnings",
    roomArchetype: "A solemn stone crypt lined with obsidian vaults, glowing safety runes, and warning braziers",
    themeColor: {
      badge: "bg-red-950/60 text-red-300 border-red-800/60",
      glow: "from-red-600/20 via-rose-950/10 to-transparent",
      border: "border-red-700/50",
      bgGradient: "from-slate-950 via-[#1a0808] to-[#0f0404]",
      accentHex: "#ef4444",
    },
    architecturalAtmosphere:
      "A subterranean stone chamber flanked by five massive obsidian sarcophagi representing the five FDA Black Box warnings, with a sixth central coiled iron serpent representing fatal gastrointestinal hypomotility.",
    spatialLoci: [
      {
        id: "locus-bb1-neutropenia",
        name: "Box I: The Shattered Marrow Sarcophagus (Severe Neutropenia)",
        objectVisual: "A fractured bone marrow casket leaking empty white shells, radiating a cold warning light.",
        spatialSpot: "North alcove of the crypt",
        memoryHook: "Remember 'AGRANULOCYTOSIS (0.8%)': Idiosyncratic neutrophil destruction peaking in the first 18 weeks. ANC < 500 means STOP clozapine forever!",
        scientificFact: "Severe neutropenia (ANC < 500/uL) occurs in ~0.8% of patients, with the highest risk during weeks 3 through 18. Mechanism involves bioactivation by myeloperoxidase in polymorphonuclear leukocytes to a reactive nitrenium ion intermediate that causes direct cytotoxicity and hapten-induced immune lysis.",
        clinicalAction: "Mandatory ANC monitoring. If ANC falls below 500/uL, cease clozapine immediately, place patient in protective isolation, obtain hematology consult, and DO NOT RECHALLENGE.",
        categoryTag: "Black Box #1",
      },
      {
        id: "locus-bb2-myocarditis",
        name: "Box II: The Stethoscope on Crimson Embers (Myocarditis)",
        objectVisual: "A burning cardiology stethoscope coiled around a glass heart, with troponin sparks flying upward.",
        spatialSpot: "Northeast pedestal",
        memoryHook: "Remember 'MYOCARDITIS PEAKS DAYS 14-28': Eosinophilic inflammatory myocarditis. Triad of persistent tachycardia, fever, and chest discomfort. Check CRP and Troponin weekly x 4 weeks!",
        scientificFact: "Acute myocarditis occurs in up to 1-3% of patients in Australia/NZ and 0.05-0.2% in the US, with >80% of cases occurring within the first month (days 14-28). It is an IgE-mediated eosinophilic hypersensitivity myocarditis. Mortality is 10-20% if unrecognized.",
        clinicalAction: "Baseline ECG, troponin I/T, and CRP. Screen weekly for the first 4 weeks (Ronaldson protocol). If troponin > 2x upper limit of normal or CRP > 100 mg/L with tachycardia, stop clozapine permanently.",
        categoryTag: "Black Box #2",
      },
      {
        id: "locus-bb3-syncope",
        name: "Box III: The Collapsed Bronze Knight (Orthostasis & Arrest)",
        objectVisual: "A suit of knight's armor collapsed in a heap at the foot of a steep staircase.",
        spatialSpot: "East wall",
        memoryHook: "Remember 'ORTHOSTASIS, BRADYCARDIA & ARREST': Profound alpha-1 adrenergic and vagal effects; highest danger during rapid upward titration.",
        scientificFact: "Severe orthostatic hypotension, with or without syncope, can precipitate reflex bradycardia, heart block, and fatal cardiorespiratory arrest. Most common during initial dose escalation.",
        clinicalAction: "Titrate slowly (start 12.5 mg; increase by <= 25-50 mg/day). Check sitting and standing blood pressure and pulse at each visit.",
        categoryTag: "Black Box #3",
      },
      {
        id: "locus-bb4-seizure",
        name: "Box IV: The Discharging Electric Cage (Dose-Dependent Seizures)",
        objectVisual: "A steel Faraday cage sparking violently with blue lightning arcs whenever the dial crosses 600 mg.",
        spatialSpot: "Southeast corner",
        memoryHook: "Remember 'DOSE-DEPENDENT SEIZURES (>600 mg/day)': Lowers seizure threshold. Myoclonic jerks are the warning sign before a grand mal seizure!",
        scientificFact: "Clozapine reduces the seizure threshold in a dose- and plasma-concentration-dependent manner. Cumulative seizure risk is 1-2% at <300 mg/day, 3-4% at 300-600 mg/day, and up to 5% at >600 mg/day or trough levels >1000 ng/mL. Myoclonus frequently precedes generalized tonic-clonic convulsions.",
        clinicalAction: "If myoclonus develops or level >600 ng/mL, reduce dose or add prophylactic anticonvulsant: sodium valproate (Depakote) is first-line; NEVER carbamazepine (bone marrow suppression).",
        categoryTag: "Black Box #4",
      },
      {
        id: "locus-bb5-dementia",
        name: "Box V: The Fading Memory Mirror (Dementia Mortality)",
        objectVisual: "An antique mirror where an elderly reflection dissolves into gray smoke.",
        spatialSpot: "South alcove",
        memoryHook: "Remember 'ELDERLY DEMENTIA MORTALITY': Class warning for all antipsychotics—increased mortality in dementia-related psychosis primarily from cardiovascular and infectious causes.",
        scientificFact: "Class Black Box warning: Elderly patients with dementia-related psychosis treated with antipsychotic drugs are at an increased risk of death (1.6 to 1.7-fold increase vs placebo) from cardiovascular events (heart failure, sudden death) or infections (pneumonia).",
        clinicalAction: "Clozapine is not approved for dementia-related psychosis. If used off-label for severe Parkinson's dementia psychosis, use lowest possible doses (6.25-25 mg).",
        categoryTag: "Black Box #5",
      },
      {
        id: "locus-silent-killer-ileus",
        name: "The Silent Killer: The Coiled Obstructed Serpent (Paralytic Ileus)",
        objectVisual: "A bloated, petrified stone serpent with swollen coils, choking on gravel, with a sign reading 'KILLS MORE THAN AGRANULOCYTOSIS'.",
        spatialSpot: "Center of the floor in front of the warnings altar",
        memoryHook: "Remember 'GI HYPOMOTILITY KILLS MORE THAN AGRANULOCYTOSIS': Mortality rate of clozapine-induced paralytic ileus is 15-28%! Check daily bowel habits!",
        scientificFact: "Clozapine-induced gastrointestinal hypomotility (CIGH) affects 50-80% of patients. Driven by profound anticholinergic (M3) and antiserotonergic (5-HT3/4) antagonism. Can progress silently to severe constipation, fecal impaction, stercoral bowel perforation, peritonitis, septic shock, and death.",
        clinicalAction: "PROPHYLAXIS IS MANDATORY: Every clozapine patient should be screened for bowel frequency; start docusate/senna or polyethylene glycol (Miralax) at the earliest sign; NEVER ignore >48h without bowel movement.",
        categoryTag: "The Silent Killer",
      },
    ],
    keyMetrics: [
      { label: "Agranulocytosis Incidence", value: "0.8%", detail: "Peak risk weeks 3 to 18" },
      { label: "Myocarditis Peak Window", value: "Days 14 - 28", detail: "Check weekly troponin and CRP" },
      { label: "Seizure Risk at >600mg", value: "Up to 5%", detail: "Dose & plasma-level dependent" },
      { label: "Ileus Case Fatality", value: "15 - 28%", detail: "Higher overall mortality than agranulocytosis" },
    ],
    subtopics: [
      {
        title: "Differentiating Benign Clozapine Fever vs NMS vs Sepsis",
        content:
          "Up to 10-15% of patients experience a benign, self-limiting drug fever during the first 1-3 weeks of clozapine titration, often resolving spontaneously without intervention. However, any fever requires immediate exclusion of: (1) Neutropenic sepsis (check urgent stat CBC); (2) Acute myocarditis (check troponin, CRP, ECG); (3) Neuroleptic Malignant Syndrome (check CK, rigidity, autonomic instability).",
        keyPoints: [
          "Do not reflexively discontinue clozapine for benign isolated drug fever if ANC and troponin are normal.",
          "If temperature > 38.5°C persists with tachycardia or elevated CRP, suspect early myocarditis.",
        ],
      },
      {
        title: "Metabolic Derangements: DKA and Weight Gain",
        content:
          "Clozapine carries the highest risk of metabolic syndrome among all antipsychotics, including rapid weight gain (mean 5-10 kg in year 1), severe dyslipidemia, and new-onset type 2 diabetes. Rarely, rapid-onset diabetic ketoacidosis (DKA) can occur within weeks of initiation, even without prior diabetes or significant obesity.",
        keyPoints: [
          "Check baseline and periodic fasting glucose, HbA1c, and lipid panel (months 3, 6, 12, then annually).",
          "Educate patients on symptoms of hyperglycemia (polyuria, polydipsia, fatigue).",
        ],
      },
    ],
    clinicalPearls: [
      "More clozapine-treated patients die from clozapine-induced gastrointestinal hypomotility (CIGH) and bowel necrosis than from agranulocytosis in modern practice.",
      "Cardiomyopathy (dilated cardiomyopathy with heart failure) can develop insidiously months to years after initiation, unlike myocarditis which is acute and early. An annual echocardiogram is recommended.",
    ],
    referenceIds: ["ronaldson2011", "everypalmer2017", "palmer2008"],
  },
  {
    id: "hematology",
    doorNumber: 6,
    name: "The Hematology Surveillance Vault (REMS & ANC Rules)",
    subtitle: "Absolute Neutrophil Count Algorithms, Benign Ethnic Neutropenia, and the 2025 REMS Update",
    icon: "ShieldCheck",
    doorLabel: "Door VI • Hematology & REMS",
    roomArchetype: "A fortified bank vault lined with titanium safety deposit boxes, microscopes, and automated cell counters",
    themeColor: {
      badge: "bg-teal-950/60 text-teal-300 border-teal-800/60",
      glow: "from-teal-600/20 via-cyan-950/10 to-transparent",
      border: "border-teal-700/50",
      bgGradient: "from-slate-950 via-[#071616] to-[#040e0e]",
      accentHex: "#14b8a6",
    },
    architecturalAtmosphere:
      "A subterranean high-security laboratory flanked by holographic smear counters. In the center stands a grand bronze scales comparing 1500 white blood cells for the general population versus 1000 for Benign Ethnic Neutropenia.",
    spatialLoci: [
      {
        id: "locus-1500-shield",
        name: "The 1500 White Shield Wall (General Population Baseline)",
        objectVisual: "A defensive wall constructed from 1500 interlocking ivory shields with a green crest.",
        spatialSpot: "North portal of the surveillance vault",
        memoryHook: "Remember 'BASELINE ANC >= 1500/uL': For the general population, clozapine requires an Absolute Neutrophil Count >= 1500/uL to initiate treatment.",
        scientificFact: "Standard initiation threshold requires baseline ANC >= 1500/uL. Total White Blood Cell (WBC) count is no longer the metric; clinical safety is governed exclusively by the Absolute Neutrophil Count.",
        clinicalAction: "Calculate ANC = WBC x (% segmented neutrophils + % bands). Confirm >= 1500/uL before writing the first prescription.",
        categoryTag: "General Protocol",
      },
      {
        id: "locus-1000-golden-key",
        name: "The 1000 Golden Key of Benign Ethnic Neutropenia (BEN)",
        objectVisual: "A filigree golden key inscribed with 'DARC Null • Baseline ANC >= 1000/uL'.",
        spatialSpot: "East security alcove",
        memoryHook: "Remember 'BEN BASELINE IS 1000': Patients of African descent or Middle Eastern ancestry with Benign Ethnic Neutropenia have naturally lower circulating ANC without infection risk!",
        scientificFact: "Benign Ethnic Neutropenia (BEN) is a normal genetic variation linked to the Duffy Antigen Receptor for Chemokines (DARC/ACKR1) null phenotype (rs2814778), where neutrophils are pooled in the marginal tissue pool rather than blood. Patients have normal bone marrow reserves and immune competence. Baseline ANC requirement for BEN is >= 1000/uL.",
        clinicalAction: "Identify patients with BEN; designate them under the BEN protocol to prevent inappropriate drug withholding or premature cessation.",
        categoryTag: "BEN Protocol",
      },
      {
        id: "locus-monitoring-schedule-triad",
        name: "The 6-6-4 Cadence Pendulum (Weekly -> Bi-Weekly -> Monthly)",
        objectVisual: "A three-tier pendulum clock swinging with three distinct bells: 1st tier (Weekly x 6mo), 2nd tier (Bi-weekly x 6mo), 3rd tier (Every 4 weeks forever).",
        spatialSpot: "Central clock tower within the vault",
        memoryHook: "Remember 'WEEKLY x 6 MONTHS -> EVERY 2 WEEKS x 6 MONTHS -> EVERY 4 WEEKS FOREVER': The surveillance schedule relaxes as the agranulocytosis danger curve drops.",
        scientificFact: "Hematologic surveillance cadence: (1) Weeks 1 through 26: Weekly ANC testing; (2) Weeks 27 through 52: Every 2 weeks; (3) After 12 months of continuous normal ANCs: Every 4 weeks for the duration of clozapine treatment.",
        clinicalAction: "Maintain strict testing adherence; if a draw is overdue, dispense only enough medication until the next scheduled test.",
        categoryTag: "Surveillance Cadence",
      },
      {
        id: "locus-red-siren-500",
        name: "The Crimson Siren of Agranulocytosis (ANC < 500)",
        objectVisual: "An emergency red rotating siren flashing over an auto-locking titanium door marked 'STOP FOREVER'.",
        spatialSpot: "West wall above the emergency isolator",
        memoryHook: "Remember 'ANC < 500 = IMMEDIATE PERMANENT STOP': Severe agranulocytosis. Discontinue immediately, isolate, admit, do not rechallenge!",
        scientificFact: "ANC < 500/uL (Severe Neutropenia/Agranulocytosis): Immediate clozapine discontinuation. Daily ANC until recovery >= 1000/uL. Protective reverse isolation. Infectious disease and hematology consults. Administer G-CSF (Filgrastim 5 mcg/kg/day). Contraindicated for future rechallenge.",
        clinicalAction: "Action for ANC 1000-1499 (Mild): Continue treatment, increase monitoring to 3x/week. Action for ANC 500-999 (Moderate): Interrupt clozapine, daily CBC, consider resume when >= 1000/uL.",
        categoryTag: "Emergency Action",
      },
      {
        id: "locus-2025-rems-scroll",
        name: "The February 2025 REMS Freedom Declaration",
        objectVisual: "An unrolled parchment with a broken bureaucratic seal, glowing with the date 'Feb 24, 2025'.",
        spatialSpot: "South archive desk",
        memoryHook: "Remember '2025 FDA REMS ELIMINATION': In February 2025, the FDA officially eliminated the centralized REMS registry requirement to remove barriers to care while maintaining clinical ANC guidelines in prescribing info.",
        scientificFact: "On February 24, 2025, the US FDA officially eliminated the centralized Clozapine REMS registry requirement, recognizing that the registry imposed severe administrative burdens on pharmacies and prescribers and led to unwarranted treatment interruptions. While the centralized reporting portal is gone, regular ANC monitoring as detailed in prescribing information remains a standard of clinical practice.",
        clinicalAction: "Educate team members that while national registry certification is eliminated, rigorous point-of-care or laboratory ANC surveillance remains medically and legally mandatory.",
        categoryTag: "2025 Breakthrough",
      },
    ],
    keyMetrics: [
      { label: "General Baseline ANC", value: ">= 1,500 /uL", detail: "Standard initiation threshold" },
      { label: "BEN Baseline ANC", value: ">= 1,000 /uL", detail: "Benign Ethnic Neutropenia criteria" },
      { label: "Agranulocytosis Cutoff", value: "< 500 /uL", detail: "Immediate cessation, protective isolation" },
      { label: "FDA REMS Elimination", value: "Feb 24, 2025", detail: "Centralized registry eliminated by FDA" },
    ],
    subtopics: [
      {
        title: "ANC Action Grid (General Population)",
        content:
          "Normal (ANC >= 1500): Continue standard schedule. Mild Neutropenia (ANC 1000-1499): Continue clozapine, monitor ANC 3x/week until >= 1500. Moderate Neutropenia (ANC 500-999): Interrupt clozapine therapy immediately, daily hematology consult, resume when ANC >= 1000. Severe Agranulocytosis (ANC < 500): Permanently discontinue; never rechallenge.",
        keyPoints: [
          "Never base treatment decisions on WBC count alone; always calculate ANC.",
          "Mild neutropenia does NOT require stopping the drug, avoiding unnecessary relapses.",
        ],
      },
      {
        title: "G-CSF / Filgrastim in Clozapine Neutropenia",
        content:
          "Granulocyte Colony-Stimulating Factor (G-CSF / Filgrastim, 300-480 mcg SC daily) stimulates the bone marrow production and release of functional neutrophils. Indicated for ANC < 500/uL or febrile neutropenia to shorten duration of critical vulnerability to bacterial sepsis.",
        keyPoints: [
          "Accelerates myeloid recovery from 14 days down to 2-4 days.",
          "Must be administered under hematology guidance.",
        ],
      },
    ],
    clinicalPearls: [
      "In patients with Benign Ethnic Neutropenia (BEN), an ANC of 1100 /uL is completely normal for their physiology; pausing clozapine would cause catastrophic psychiatric relapse for a benign genetic trait.",
      "Pseudoneutropenia can occur due to in vitro EDTA-induced neutrophil agglutination; if an unexpected drop occurs in an asymptomatic patient, repeat the test using a heparinized or sodium citrate tube.",
    ],
    referenceIds: ["fda2025rems", "myles2018", "kelly2015"],
  },
  {
    id: "titration",
    doorNumber: 7,
    name: "The Apothecary of Titration & Clinical Pearls",
    subtitle: "12.5 mg Initiation, The 48-Hour Reset Rule, Sialorrhea and Motility Protocols",
    icon: "Sliders",
    doorLabel: "Door VII • Titration & Pearls",
    roomArchetype: "An expansive clinical apothecary with rows of amber dropper bottles, precision pipettes, and dosing ledgers",
    themeColor: {
      badge: "bg-purple-950/60 text-purple-300 border-purple-800/60",
      glow: "from-purple-600/20 via-fuchsia-950/10 to-transparent",
      border: "border-purple-700/50",
      bgGradient: "from-slate-950 via-[#12091d] to-[#0b0512]",
      accentHex: "#a855f7",
    },
    architecturalAtmosphere:
      "A grand vaulted apothecary room lined with tiered mahogany drawers and frosted glass titration vessels. Clockwork dosing dials show slow daily titrations, while an hourglass with a broken neck highlights the 48-hour rule.",
    spatialLoci: [
      {
        id: "locus-12point5-dropper",
        name: "The 12.5 mg Micro-Dropper (Initiation)",
        objectVisual: "A tiny crystal dropper dispensing a single amber drop marked '12.5 mg Day 1'.",
        spatialSpot: "North dispensing counter",
        memoryHook: "Remember 'START AT 12.5 mg': Never start with a full dose! Day 1 is 12.5 mg once or twice daily to test tolerance to alpha-1 adrenergic collapse.",
        scientificFact: "Initiation: 12.5 mg once or twice daily on Day 1. Increase by 25-50 mg/day as tolerated to reach 300-450 mg/day by weeks 2-3 in divided doses. Standard maintenance range in TRS is 300-600 mg/day (max FDA approved dose 900 mg/day).",
        clinicalAction: "Start with 12.5 mg at bedtime; monitor blood pressure and pulse for orthostatic drop and reflex tachycardia.",
        categoryTag: "Dosing Initiation",
      },
      {
        id: "locus-48hour-hourglass",
        name: "The 48-Hour Shattered Hourglass (The Missed Dose Reset Rule)",
        objectVisual: "An hourglass where red sand drains in 48 hours; if missed, an automatic hammer shatters the chamber.",
        spatialSpot: "East wall above the patient compliance board",
        memoryHook: "Remember 'MISSED 48 HOURS? MUST RE-START AT 12.5 mg!': If a patient stops taking clozapine for >= 48 hours, autonomic tolerance is LOST. Giving their regular dose can cause fatal collapse!",
        scientificFact: "Tolerance to clozapine's profound alpha-1 adrenergic and cholinergic effects decays rapidly. If treatment is interrupted for 48 hours or more, the patient MUST NOT resume their previous maintenance dose (e.g. 400 mg). Resuming at high dose risks severe orthostatic hypotension, syncope, and cardiac arrest. Re-titration must restart from 12.5 mg.",
        clinicalAction: "Inquire about compliance at every check. If >= 48 hours have elapsed without medication, reset to 12.5 mg Day 1 and re-titrate rapidly (can re-titrate somewhat faster than initial titration under close observation).",
        categoryTag: "Critical Safety Rule",
      },
      {
        id: "locus-atropine-pipette",
        name: "The Sublingual Atropine Pipette (Sialorrhea Protocol)",
        objectVisual: "An amber eyedropper bottle labeled 'Atropine 1% Ophthalmic Drops — For Sublingual Use'.",
        spatialSpot: "South compounding shelf",
        memoryHook: "Remember 'SUBLINGUAL ATROPINE FOR DROOLING': 1-2 drops of 1% atropine eye drops placed under the tongue at bedtime selectively dries oral secretions.",
        scientificFact: "Nocturnal sialorrhea is embarrassing and causes aspiration pneumonia. Because systemic anticholinergics worsen constipation and cognitive function, local sublingual application of 1% atropine ophthalmic solution (1-2 drops sublingually at bedtime) or ipratropium bromide 0.03% nasal spray (1-2 sprays intraorally) provides localized muscarinic antagonism with minimal systemic absorption.",
        clinicalAction: "First line for nocturnal drooling: Sublingual atropine 1% drops or ipratropium spray at bedtime; elevate head of bed; place towel on pillow.",
        categoryTag: "Adverse Effect Pearl",
      },
      {
        id: "locus-bowel-ledger",
        name: "The Daily Bowel Ledger & Senna Compendium",
        objectVisual: "A bound leather ledger with a fountain pen and packets of senna/docusate, with 'NO BOWEL MOVEMENT IN 48h = CODE RED'.",
        spatialSpot: "West desk beside the patient charts",
        memoryHook: "Remember 'PRESCRIBE LAXATIVE ON DAY ONE': Clozapine should almost never be prescribed without concurrent stool softener or osmotic laxative prophylaxis.",
        scientificFact: "Gastrointestinal hypomotility occurs in almost all patients. Up to 80% have prolonged colonic transit times (often exceeding 100 hours vs normal ~30h). Osmotic laxatives (macrogol / polyethylene glycol / Miralax) or stimulant laxatives (senna, bisacodyl) should be initiated prophylactically.",
        clinicalAction: "Ask about bowel movements at every contact. If no bowel movement for 48 hours, initiate aggressive laxative regimen; if vomiting, abdominal pain, or distension develop, obtain urgent abdominal X-ray/CT.",
        categoryTag: "GI Protocol",
      },
    ],
    keyMetrics: [
      { label: "Starting Dose", value: "12.5 mg", detail: "Once or twice daily on Day 1" },
      { label: "Target Maintenance", value: "300 - 450 mg", detail: "Divided doses, larger dose at night" },
      { label: "Missed Dose Threshold", value: ">= 48 Hours", detail: "Mandates re-titration from 12.5 mg" },
      { label: "Max FDA Daily Dose", value: "900 mg/day", detail: "Requires plasma level and seizure caution" },
    ],
    subtopics: [
      {
        title: "Standard Titration Schedule for Inpatients vs Outpatients",
        content:
          "Day 1: 12.5 mg qhs (or 12.5 mg bid). Day 2: 25 mg bid. Days 3-7: Increase by 25-50 mg every 2-3 days to reach 100-150 mg/day. Weeks 2-3: Increase by 25-50 mg daily as tolerated to reach target 300-400 mg/day. Slower titration is recommended for outpatients, elderly, or those with cardiovascular risk.",
        keyPoints: [
          "Dose increases should be paused if resting tachycardia (>110 bpm) or severe sedation emerges.",
          "Give the majority of the daily dose at bedtime (e.g. 100 mg AM, 300 mg PM) to align peak sedation with sleep.",
        ],
      },
      {
        title: "Managing Clozapine-Induced Tachycardia",
        content:
          "Sinus tachycardia is seen in ~25% of patients due to alpha-2 presynaptic blockade and anticholinergic vagal inhibition. If resting HR persistently exceeds 100-110 bpm after ruling out myocarditis, a cardioselective beta-blocker (atenolol 25-50 mg or bisoprolol 2.5-5 mg) or the funny-channel inhibitor ivabradine (5-7.5 mg bid) can be introduced.",
        keyPoints: [
          "Never start a non-selective beta-blocker like propranolol if asthma or orthostasis is present.",
          "Ivabradine reduces heart rate without lowering blood pressure, making it an ideal agent for clozapine tachycardia with borderline hypotension.",
        ],
      },
    ],
    clinicalPearls: [
      "If a patient forgets their clozapine for just 24 hours, they can generally resume their regular dose; but once 48 hours have passed, you must never resume the full dose due to lost autonomic tolerance.",
      "Always avoid co-prescribing carbamazepine with clozapine: carbamazepine is both a potent CYP3A4/1A2 inducer and causes bone marrow suppression, exponentially increasing agranulocytosis risk.",
    ],
    referenceIds: ["meyer2021", "ronaldson2011", "shirazi2016"],
  },
  {
    id: "advances",
    doorNumber: 8,
    name: "The Chamber of Recent Advances (2024-2026)",
    subtitle: "FDA REMS Elimination, Point-of-Care Capillary ANC, and GLP-1 Metabolic Protection",
    icon: "Sparkles",
    doorLabel: "Door VIII • Recent Advances",
    roomArchetype: "A futuristic crystalline research conservatory with touch-screens, microfluidic chips, and DNA sequencers",
    themeColor: {
      badge: "bg-amber-950/60 text-amber-300 border-amber-800/60",
      glow: "from-amber-500/20 via-yellow-950/10 to-transparent",
      border: "border-amber-500/50",
      bgGradient: "from-slate-950 via-[#161208] to-[#0e0a04]",
      accentHex: "#f59e0b",
    },
    architecturalAtmosphere:
      "A high-tech conservatory illuminated by warm amber fiber-optic chandeliers. Floating holographic interfaces display 2024-2026 clinical trial updates, microfluidic capillary test cartridges, and pharmacogenomic arrays.",
    spatialLoci: [
      {
        id: "locus-rems-removal",
        name: "The Dismantled Registry Scaffold (FDA REMS Elimination 2025)",
        objectVisual: "A shattered iron framework of bureaucratic forms giving way to a clean, illuminated patient pathway.",
        spatialSpot: "Central entrance to the conservatory",
        memoryHook: "Remember 'FEBRUARY 2025 REMS ELIMINATION': The FDA officially removed the centralized Clozapine REMS registry requirement on Feb 24, 2025, breaking decades of underutilization!",
        scientificFact: "Effective February 24, 2025, the US FDA eliminated the Clozapine REMS program after extensive review demonstrated the centralized registry created administrative barriers leading to dangerous treatment interruptions without adding safety benefit over routine clinical blood monitoring.",
        clinicalAction: "Prescribers and pharmacies no longer need centralized enrollment or mandatory online portal submission, though standard ANC monitoring as per prescribing information continues.",
        categoryTag: "Regulatory Advance",
      },
      {
        id: "locus-poc-fingerstick",
        name: "The 5-Minute Microfluidic Cartridge (Point-of-Care ANC)",
        objectVisual: "A compact handheld diagnostic device with a glowing digital display reading 'ANC: 2,450 /uL in 4:32 min'.",
        spatialSpot: "East testing bench",
        memoryHook: "Remember 'POINT-OF-CARE FINGERSTICK ANC': Handheld devices (Athelas, HemoScreen) deliver lab-grade ANC in under 5 minutes from a single drop of capillary blood.",
        scientificFact: "Point-of-care (POC) hematology analyzers utilizing microfluidics and machine learning image recognition enable 5-minute fingerstick ANC measurements in outpatient psychiatric clinics, community pharmacies, and home-visit settings, slashing discontinuation rates by 70% (CHAMPION program).",
        clinicalAction: "Adopt POC fingerstick testing to avoid venous phlebotomy trauma, reduce lab turnaround from days to minutes, and prevent treatment interruptions.",
        categoryTag: "Diagnostic Tech",
      },
      {
        id: "locus-glp1-dual-action",
        name: "The Dual-Coil GLP-1 Metabolic Shield (Semaglutide & Tirzepatide)",
        objectVisual: "A helical peptide model wrapping around an insulin crystal, shielding an adipocyte while a warning flag waves 'Monitor Bowel'.",
        spatialSpot: "Southwest clinical trials pavilion",
        memoryHook: "Remember 'GLP-1 RAs CONQUER WEIGHT GAIN, BUT WATCH THE GUT': Semaglutide reverses clozapine weight gain and HbA1c without affecting psychosis, but additively slows bowel motility!",
        scientificFact: "Recent RCTs and meta-analyses (2023-2025) demonstrate that once-weekly GLP-1 receptor agonists (semaglutide, liraglutide, tirzepatide) produce significant weight loss (-5 to -10 kg), reduce visceral adiposity, and normalize HbA1c in clozapine patients without worsening psychotic symptoms or altering clozapine plasma levels. However, clinicians must vigilantly monitor for additive GI hypomotility.",
        clinicalAction: "Consider early co-prescription of GLP-1 RAs in patients experiencing rapid clozapine weight gain (>5% in 3 months); enforce strict daily bowel movement monitoring.",
        categoryTag: "Metabolic Breakthrough",
      },
      {
        id: "locus-pgx-chip",
        name: "The Pharmacogenomic Bio-Chip (HLA & Rare CYP1A2 Variants)",
        objectVisual: "A silicon bio-chip illuminated by golden laser lines highlighting 'HLA-B*38:02 • CYP1A2*1F'.",
        spatialSpot: "Northwest genetic sequencing console",
        memoryHook: "Remember 'GENOMICS PREVENTS TOXICITY': Testing for HLA alleles (HLA-B*38:02, HLA-DRB1*04:02) and CYP1A2 ultrarapid/poor metabolizers personalizes dosing.",
        scientificFact: "Genome-wide association studies identify specific human leukocyte antigen (HLA) alleles associated with clozapine-induced agranulocytosis (CIA), including HLA-B*38:02 in Ashkenazi Jewish populations and HLA-DRB1*04:02. Rare loss-of-function variants in CYP1A2 explain patients who develop severe toxicity at low doses (100 mg).",
        clinicalAction: "Use pharmacogenomic testing in complex multi-drug regimens or patients with extreme unexpected plasma-to-dose ratios.",
        categoryTag: "Precision Medicine",
      },
    ],
    keyMetrics: [
      { label: "FDA REMS Elimination", value: "Feb 24, 2025", detail: "Major milestone reducing prescribing barriers" },
      { label: "POC Fingerstick Time", value: "< 5 Minutes", detail: "Athelas / HemoScreen capillary testing" },
      { label: "GLP-1 RA Weight Loss", value: "-5 to -10 kg", detail: "Reverses clozapine-induced adiposity" },
      { label: "Genetic Risk Alleles", value: "HLA-B*38:02", detail: "Predictor of immune agranulocytosis susceptibility" },
    ],
    subtopics: [
      {
        title: "The Championing of Point-of-Care (POC) Hematology",
        content:
          "Historically, venous blood draws and lab delays led to hundreds of unnecessary clozapine cessations each year due to delayed lab results or patient phobia of venipuncture. Capillary blood analysis via point-of-care machines provides immediate, actionable ANC verification while the patient is in the clinic chair.",
        keyPoints: [
          "Validated against standard Sysmex laboratory automated analyzers (r > 0.96).",
          "Dramatically improves treatment retention in vulnerable outpatient cohorts.",
        ],
      },
      {
        title: "GLP-1 RAs: Balancing Weight Loss with GI Transit Time",
        content:
          "While semaglutide and tirzepatide are revolutionary for cardiometabolic protection, both delay gastric emptying. Because clozapine inherently causes gastrointestinal hypomotility via M3/5-HT4 blockade, combining them requires vigilant bowel monitoring and aggressive prophylactic laxative use.",
        keyPoints: [
          "Screen bowel movement frequency at every follow-up.",
          "Hold GLP-1 agonist if patient reports absence of bowel movements for >48 hours.",
        ],
      },
    ],
    clinicalPearls: [
      "The elimination of the centralized REMS database does not mean monitoring is optional; it empowers clinicians to manage ANC monitoring directly without administrative portal lockouts.",
      "Co-administering semaglutide in clozapine patients has shown preliminary signals of reducing neuroinflammation and improving prefrontal cognitive task performance in addition to weight loss.",
    ],
    referenceIds: ["fda2025rems", "correll2023", "siskind2024"],
  },
  {
    id: "understudy",
    doorNumber: 9,
    name: "The Chamber of Future Horizons & Under Study",
    subtitle: "Muscarinic PAMs, G-CSF Rechallenge Protocols, and Neuroimaging Biomarkers",
    icon: "Compass",
    doorLabel: "Door IX • Investigational Pipeline",
    roomArchetype: "An esoteric visionary observatory facing an endless cosmic horizon with telescope arrays and quantum computers",
    themeColor: {
      badge: "bg-blue-950/60 text-blue-300 border-blue-800/60",
      glow: "from-blue-600/20 via-indigo-950/10 to-transparent",
      border: "border-blue-700/50",
      bgGradient: "from-slate-950 via-[#0a1120] to-[#060b14]",
      accentHex: "#3b82f6",
    },
    architecturalAtmosphere:
      "A vast astronomical terrace overlooking a starfield. Transparent glass display cubes contain molecular simulations of M1/M4 positive allosteric modulators, neuroimaging PET scans of prefrontal glutamatergic pathways, and stem-cell derived granulocyte colonies.",
    spatialLoci: [
      {
        id: "locus-m1m4-pams",
        name: "The Allosteric Muscarinic Keyhole (M1/M4 PAMs)",
        objectVisual: "A glowing blue receptor cavity that only opens when both acetylcholine and a synthetic modulator dock simultaneously.",
        spatialSpot: "North observation platform",
        memoryHook: "Remember 'M1/M4 PAMs INSPIRED BY CLOZAPINE': Clozapine's metabolite Norclozapine stimulates M1/M4. Novel agents (Xanomeline-Trospium / Cobenfy & Emraclidine) exploit this exact pathway WITHOUT D2 blockade!",
        scientificFact: "Clozapine's unique efficacy was long suspected to stem from Norclozapine's M1/M4 partial agonism. This hypothesis sparked the development of the muscarinic antipsychotics (e.g. Xanomeline-Trospium, approved in late 2024; Emraclidine). Ongoing trials study whether adding muscarinic PAMs to clozapine can rescue ultra-treatment-resistant schizophrenia (UTRS).",
        clinicalAction: "Watch for upcoming combination trials of clozapine with novel muscarinic modulators for cognitive and refractory symptom breakthroughs.",
        categoryTag: "Pipeline Mechanism",
      },
      {
        id: "locus-gcsf-rechallenge-bridge",
        name: "The G-CSF Rechallenge Suspension Bridge",
        objectVisual: "A suspension bridge spanning a deep chasm, supported by glowing golden pillars of Filgrastim.",
        spatialSpot: "East terrace projecting over the canyon",
        memoryHook: "Remember 'G-CSF FACILITATED RECHALLENGE': In refractory patients who had non-severe neutropenia, co-administering G-CSF allows successful clozapine re-initiation in up to 63% of cases.",
        scientificFact: "Historically, any neutropenia meant permanent clozapine banishment. Emerging protocols (Manu et al., Lally et al.) demonstrate that in ultra-treatment-resistant patients with no alternative therapeutic options, a supervised rechallenge with prophylactic or on-demand Granulocyte Colony-Stimulating Factor (G-CSF / Filgrastim) achieves a 63% success rate after mild/moderate neutropenia.",
        clinicalAction: "Never attempt rechallenge after true agranulocytosis (ANC < 500); for mild neutropenia or BEN, G-CSF facilitated protocols can be conducted in tertiary academic centers with IRB and hematology co-management.",
        categoryTag: "Rechallenge Frontier",
      },
      {
        id: "locus-mrs-glutamate",
        name: "The 7-Tesla MRS Prefrontal Resonator (Glutamate Biomarkers)",
        objectVisual: "A magnetic resonance spectrometer projecting a 3D magnetic map of the anterior cingulate cortex glowing with glutamate peaks.",
        spatialSpot: "South analytical laboratory",
        memoryHook: "Remember 'ANTERIOR CINGULATE GLUTAMATE PREDICTS RESPONSE': Elevated anterior cingulate glutamate on 1H-MRS indicates a 'glutamatergic psychosis' that responds specifically to clozapine, not D2 blockers!",
        scientificFact: "Proton magnetic resonance spectroscopy (1H-MRS) at 7 Tesla reveals that patients with treatment-resistant schizophrenia have elevated glutamate + glutamine (Glx) in the anterior cingulate cortex (ACC), whereas non-refractory patients have hyper-dopaminergic striatal profiles. Clozapine selectively normalizes ACC glutamate levels, positioning baseline MRS as a candidate predictive biomarker.",
        clinicalAction: "Anticipate the transition from trial-and-error prescribing to pre-treatment neuroimaging-guided clozapine selection.",
        categoryTag: "Biomarkers",
      },
      {
        id: "locus-neurogenesis-mirror",
        name: "The Caudate-Frontal Volumetric Matrix",
        objectVisual: "A dual brain hologram showing the caudate nucleus shrinking back to normal size while prefrontal gray matter expands.",
        spatialSpot: "West wall neuroanatomy display",
        memoryHook: "Remember 'REVERSES FIRST-GEN CAUDATE HYPERTROPHY': First-generation neuroleptics cause caudate enlargement; switching to clozapine normalizes basal ganglia volume and increases frontal gray matter.",
        scientificFact: "Longitudinal MRI studies demonstrate that typical antipsychotics induce basal ganglia hypertrophy due to chronic high D2 blockade. Switching to clozapine reduces caudate volume toward healthy controls and correlates with superior executive functioning and cognitive processing speed.",
        clinicalAction: "Recognize that clozapine facilitates neuroplastic remodeling of cortico-striatal loops compared to static D2 blockade.",
        categoryTag: "Neuroimaging",
      },
    ],
    keyMetrics: [
      { label: "G-CSF Rechallenge Success", value: "63%", detail: "In mild/moderate neutropenia (Manu et al.)" },
      { label: "M1/M4 Target Receptors", value: "Cholinergic", detail: "Antipsychotic action without D2 blockade" },
      { label: "Glutamate ACC Biomarker", value: "1H-MRS", detail: "Predicts clozapine-specific response" },
      { label: "Caudate Normalization", value: "Structural MRI", detail: "Reverses D2-blocker basal ganglia swelling" },
    ],
    subtopics: [
      {
        title: "The Clozapine Rechallenge Protocol Decision Tree",
        content:
          "Rechallenging clozapine requires strict risk stratification. Absolutely Contraindicated: Prior clozapine-induced myocarditis, cardiomyopathy, or severe agranulocytosis (ANC < 500/uL with sepsis). Considered with Caution: Mild neutropenia, benign ethnic neutropenia misclassification, or prior NMS. Protocols involve weekly hematology reviews, pre-emptive G-CSF availability, and ultra-slow titration.",
        keyPoints: [
          "Multidisciplinary ethics and hematology review is mandatory.",
          "Must have fully informed consent acknowledging the ~38% risk of recurrent neutropenia.",
        ],
      },
      {
        title: "Glutamatergic vs Dopaminergic Subtypes of Schizophrenia",
        content:
          "Neurochemical imaging has solidified the hypothesis that schizophrenia consists of at least two neurobiologically distinct subtypes: Type A (hyperdopaminergic, responsive to standard D2 blockers) and Type B (normodopaminergic with cortical glutamatergic/GABAergic dysfunction, inherently treatment-resistant to D2 antagonists but responsive to clozapine).",
        keyPoints: [
          "Explains why waiting for two failed D2 trials delays the correct pharmacological intervention.",
          "Validates clozapine's unique NMDA/GABA modulatory profile.",
        ],
      },
    ],
    clinicalPearls: [
      "In ultra-treatment-resistant schizophrenia (UTRS), where clozapine alone produces incomplete response, electroconvulsive therapy (ECT) augmentation has the strongest meta-analytic evidence, followed by lamotrigine or aripiprazole augmentation.",
      "Never rechallenge a patient who developed clozapine myocarditis: recurrence risk is high and often fatal.",
    ],
    referenceIds: ["manu2018", "lally2022", "deleon2024"],
  },
];

export const RECENT_ADVANCES_DATA: RecentAdvanceItem[] = [
  {
    id: "rems-elimination-2025",
    title: "Official US FDA Elimination of Clozapine REMS Registry",
    year: "2025 (Feb 24)",
    tag: "Regulatory Milestone",
    statusBadge: "FDA Completed Action",
    summary:
      "The US FDA formally eliminated the centralized Clozapine REMS program, dismantling mandatory online portal enrollment and reporting requirements to expand access to life-saving therapy.",
    breakthroughDetail:
      "After more than three decades of mandatory federal registry oversight, the FDA determined that the centralized REMS registry imposed severe burdens on prescribers, pharmacies, and patients—frequently causing harmful, unintended treatment interruptions due to technical glitches and administrative delays—without evidence of reducing agranulocytosis deaths beyond routine clinical monitoring. While the centralized reporting database is discontinued, healthcare providers are still instructed to monitor ANC levels as detailed in the drug's prescribing information.",
    clinicalPracticeShift:
      "Prescribers can now write clozapine without navigating a burdensome web portal. Dispensing pharmacies no longer face restrictive REMS authorization lockouts. Clinical responsibility shifts back to direct clinician-patient monitoring.",
    references: ["fda2025rems"],
  },
  {
    id: "poc-fingerstick-anc",
    title: "Point-of-Care Capillary Fingerstick Hematology Analyzers",
    year: "2024-2026",
    tag: "Diagnostic Technology",
    statusBadge: "Clinical Implementation",
    summary:
      "Adoption of 5-minute microfluidic capillary fingerstick analyzers (Athelas, HemoScreen) enabling instantaneous on-site ANC confirmation.",
    breakthroughDetail:
      "Traditional venous blood draws required dedicated phlebotomy appointments and 24-48 hour turnaround times, causing patient anxiety, missed doses, and dropouts. Point-of-care fingerstick devices use a micro-drop of capillary blood and automated digital microscopy to generate a verified Absolute Neutrophil Count in under 5 minutes right in the clinic or pharmacy. Programs like CHAMPION demonstrated a 70% decrease in premature treatment discontinuations.",
    clinicalPracticeShift:
      "Enables immediate medication dispensing during the patient visit. Eliminates venous access struggles in chronically ill patients and vastly improves adherence.",
    references: ["myles2018", "fda2025rems"],
  },
  {
    id: "glp1-cardiometabolic",
    title: "GLP-1 Receptor Agonist Co-Therapy for Metabolic Syndrome",
    year: "2023-2026",
    tag: "Pharmacotherapy",
    statusBadge: "Phase III & Guideline Support",
    summary:
      "Once-weekly GLP-1 RAs (Semaglutide, Tirzepatide) effectively reverse clozapine-induced weight gain, visceral adiposity, and insulin resistance.",
    breakthroughDetail:
      "Randomized controlled trials and real-world cohort studies show that co-prescribing semaglutide or liraglutide induces robust weight loss (-5 to -10 kg), significant HbA1c reductions, and improvements in lipid profiles without destabilizing psychiatric symptoms or altering clozapine serum concentrations. Recent 2025 meta-analyses also suggest possible neuroprotective and anti-inflammatory benefits.",
    clinicalPracticeShift:
      "Clinicians are proactively initiating GLP-1 RAs when early weight gain occurs. Crucial Caveat: Because both drugs slow gastrointestinal transit, clinicians must screen for constipation to avoid exacerbating paralytic ileus.",
    references: ["correll2023", "siskind2024"],
  },
  {
    id: "pharmacogenomics-hla",
    title: "Precision Pharmacogenomics: HLA Alleles & CYP1A2 Variants",
    year: "2024-2025",
    tag: "Genomics",
    statusBadge: "Translational Evidence",
    summary:
      "Discovery of genetic predictors for clozapine-induced agranulocytosis (HLA-B*38:02) and rare CYP1A2 loss-of-function variants.",
    breakthroughDetail:
      "Genome-wide association studies (GWAS) have localized genetic susceptibility to clozapine-induced agranulocytosis (CIA) to specific immune loci (HLA-B*38:02 and HLA-DRB1*04:02). Furthermore, rare loss-of-function single nucleotide variants in CYP1A2 have been characterized, explaining why non-smokers occasionally develop severe toxic concentrations (>1000 ng/mL) at modest doses of 100-200 mg/day.",
    clinicalPracticeShift:
      "Informs individualized dosing strategies and helps distinguish benign genetic neutropenia (BEN) from impending toxic agranulocytosis.",
    references: ["deleon2020", "meyer2021"],
  },
];

export const UNDER_STUDY_DATA: UnderStudyItem[] = [
  {
    id: "muscarinic-pam-trials",
    title: "Positive Allosteric Modulators of M1 and M4 Muscarinic Receptors",
    phase: "Phase II/III & Combination Trials",
    investigationalDomain: "Novel Antipsychotic Mechanisms & Augmentation",
    hypothesis:
      "Clozapine's active metabolite Norclozapine achieves its unique pro-cognitive and anti-psychotic efficacy via M1/M4 partial agonism. Pure M1/M4 PAMs can replicate clozapine's benefits without D2 blockade, EPS, metabolic collapse, or agranulocytosis.",
    ongoingEvidence:
      "Following the landmark approval of Xanomeline-Trospium in late 2024, researchers are now testing muscarinic agonists and M4 PAMs (such as emraclidine) as augmentation agents in patients with partial clozapine response, targeting resistant cognitive deficits and negative symptoms.",
    futureImplications:
      "Could provide the first mechanistically distinct non-D2 augmentation strategy for Ultra-Treatment-Resistant Schizophrenia (UTRS).",
    references: ["steele1993", "siskind2016"],
  },
  {
    id: "gcsf-rechallenge-protocols",
    title: "Standardized G-CSF Facilitated Clozapine Rechallenge",
    phase: "Tertiary Academic Clinical Protocols",
    investigationalDomain: "Hematology / Refractory Schizophrenia Rescue",
    hypothesis:
      "Patients with severe TRS who experienced mild-to-moderate neutropenia can safely resume clozapine when co-administered with scheduled or as-needed Filgrastim (G-CSF).",
    ongoingEvidence:
      "Case series and systematic reviews (Manu et al., Lally et al.) indicate that clozapine rechallenge after non-fatal neutropenia achieves long-term success in 63% of cases when supported by G-CSF. Studies are standardizing the exact dosing protocols (e.g. 300 mcg SC once weekly or bi-weekly).",
    futureImplications:
      "Prevents tragic psychiatric deterioration and institutionalization in patients who have completely exhausted all other psychiatric options.",
    references: ["manu2018", "lally2022"],
  },
  {
    id: "glutamate-mrs-biomarker",
    title: "7-Tesla Proton MRS Anterior Cingulate Glutamate as a Predictive Biomarker",
    phase: "Translational Neuroimaging",
    investigationalDomain: "Precision Psychiatry Biomarkers",
    hypothesis:
      "Treatment-resistant schizophrenia is driven by cortical glutamatergic-GABAergic dysfunction rather than striatal dopamine hyperfunction. Elevated prefrontal Glx levels on 1H-MRS can predict clozapine responsiveness prior to treatment initiation.",
    ongoingEvidence:
      "Multi-center 7T MRS studies demonstrate that TRS non-responders to typical antipsychotics exhibit significantly higher glutamate/GABA ratios in the anterior cingulate cortex, which specifically normalize after 12 weeks of clozapine therapy.",
    futureImplications:
      "Could eliminate the tragic 4-5 year delay in starting clozapine by identifying biological responders at first-episode psychosis.",
    references: ["tiihonen2019", "siskind2016"],
  },
  {
    id: "microdosing-lewy-body",
    title: "Ultra-Low Dose Clozapine Microdosing in Lewy Body Dementia & PDP",
    phase: "Investigational Dosing Trials",
    investigationalDomain: "Neurodegenerative Psychosis",
    hypothesis:
      "Ultra-low dose clozapine (3.125 to 12.5 mg) can control severe visual hallucinations and delusions in Dementia with Lewy Bodies without triggering fatal autonomic or cognitive worsening.",
    ongoingEvidence:
      "Pilot investigations indicate that clozapine's loose D2 binding allows selective suppression of mesolimbic hyperactivity while sparing depleted nigrostriatal circuitry in synucleinopathies.",
    futureImplications:
      "Could offer a safe sanctuary treatment for patients who develop life-threatening neuroleptic sensitivity from other second-generation antipsychotics.",
    references: ["meltzer2003"],
  },
];

export const DRUG_INTERACTIONS_DATA: DrugInteractionScenario[] = [
  {
    drug: "Fluvoxamine (Luvox)",
    classType: "SSRI Antidepressant",
    metabolicPathway: "Potent CYP1A2 & CYP2C19 Inhibition",
    interactionEffect: "Increases clozapine plasma levels by 500% to 1000% (5-10 fold spike)",
    severity: "Contraindicated",
    clinicalGuidance: "NEVER co-prescribe. Can trigger catastrophic toxicity, coma, and status epilepticus. If an antidepressant is required, select sertraline or escitalopram.",
    plasmaChangePercent: "+500% to +1000%",
  },
  {
    drug: "Tobacco Smoking (Inhaled Cigarettes)",
    classType: "Environmental Xenobiotic",
    metabolicPathway: "CYP1A2 Induction via Polycyclic Aromatic Hydrocarbons (PAHs)",
    interactionEffect: "Smoking reduces clozapine levels by 30-50%. Abrupt cessation DOUBLES levels.",
    severity: "High Risk",
    clinicalGuidance: "Inquire about smoking at every visit. If patient stops smoking (e.g. inpatient admission), reduce clozapine dose by 30-50% immediately to prevent toxicity.",
    plasmaChangePercent: "-40% (Smoking) / +100% (Quitting)",
  },
  {
    drug: "Caffeine (Coffee / Energy Drinks)",
    classType: "Xanthine Stimulant",
    metabolicPathway: "Competitive CYP1A2 Substrate & Inhibitor",
    interactionEffect: "Heavy coffee consumption (4-6 cups) increases clozapine levels by 20-50%",
    severity: "Moderate Risk",
    clinicalGuidance: "Advise patients to maintain consistent caffeine intake. Abruptly quitting or doubling coffee intake will cause significant plasma fluctuations.",
    plasmaChangePercent: "+20% to +50%",
  },
  {
    drug: "Ciprofloxacin (Cipro)",
    classType: "Fluoroquinolone Antibiotic",
    metabolicPathway: "Potent CYP1A2 Inhibition",
    interactionEffect: "Increases clozapine levels by 200% to 400%",
    severity: "High Risk",
    clinicalGuidance: "Avoid ciprofloxacin for infections in clozapine patients. Choose an alternative antibiotic (e.g. amoxicillin, cephalosporins, or macrolides with caution).",
    plasmaChangePercent: "+200% to +400%",
  },
  {
    drug: "Carbamazepine (Tegretol)",
    classType: "Anticonvulsant / Mood Stabilizer",
    metabolicPathway: "CYP3A4/1A2 Induction + Direct Bone Marrow Toxicity",
    interactionEffect: "Decreases clozapine levels AND causes synergistic bone marrow suppression",
    severity: "Contraindicated",
    clinicalGuidance: "STRICTLY CONTRAINDICATED. Synergistic suppression of granulocyte production causes extreme agranulocytosis risk. Use valproate instead.",
    plasmaChangePercent: "-50% + Bone Marrow Aplasia Risk",
  },
  {
    drug: "Sodium Valproate / Divalproex (Depakote)",
    classType: "Anticonvulsant / Mood Stabilizer",
    metabolicPathway: "Protein Binding Displacement & Mild Metabolic Inhibition",
    interactionEffect: "Preferred anticonvulsant for clozapine seizures. May slightly displace clozapine.",
    severity: "Monitor / Adjust",
    clinicalGuidance: "First-line prophylactic and treatment agent for clozapine-induced myoclonus and seizures. Monitor for additive sedation, weight gain, and rare thrombocytopenia.",
    plasmaChangePercent: "+10% to +20% (Free Fraction)",
  },
  {
    drug: "Semaglutide / GLP-1 RAs",
    classType: "Incretin Mimetic / Antidiabetic",
    metabolicPathway: "Delayed Gastric Emptying & Gut Motility Deceleration",
    interactionEffect: "Reverses metabolic syndrome, but exerts additive gastrointestinal hypomotility",
    severity: "Monitor / Adjust",
    clinicalGuidance: "Excellent for clozapine-induced obesity, but mandates aggressive prophylactic bowel monitoring to prevent constipation from escalating into paralytic ileus.",
    plasmaChangePercent: "Negligible direct PK change",
  },
  {
    drug: "Omeprazole (Prilosec)",
    classType: "Proton Pump Inhibitor",
    metabolicPathway: "Mild CYP1A2 Induction via AhR",
    interactionEffect: "May slightly reduce clozapine levels by 10-20%",
    severity: "Monitor / Adjust",
    clinicalGuidance: "Pantoprazole has minimal CYP1A2 interaction and is preferred if a PPI is needed for GERD.",
    plasmaChangePercent: "-10% to -20%",
  },
];

export const REFERENCE_LIBRARY: ReferenceArticle[] = [
  {
    id: "kane1988",
    title: "Clozapine for the Treatment-Resistant Schizophrenic: A Double-Blind Comparison With Chlorpromazine",
    authors: "Kane J, Honigfeld G, Singer J, Meltzer H",
    journal: "Archives of General Psychiatry",
    year: 1988,
    pmid: "3056327",
    doi: "10.1001/archpsyc.1988.01800330013001",
    category: "Landmark & Efficacy",
    evidenceLevel: "Randomized Controlled Trial",
    summary:
      "The pivotal multi-center double-blind trial that led to FDA approval. Investigated 268 patients with confirmed treatment-resistant schizophrenia failing prior antipsychotics.",
    keyFinding:
      "Clozapine achieved a 30% response rate versus only 4% for chlorpromazine on BPRS criteria (p < 0.001) without producing extrapyramidal symptoms or catalepsy.",
    url: "https://pubmed.ncbi.nlm.nih.gov/3056327/",
  },
  {
    id: "tiihonen2019",
    title: "20-Year Nationwide Follow-Up Study on All-Cause and Cause-Specific Mortality in Schizophrenia",
    authors: "Tiihonen J, Tanskanen A, Taipale H",
    journal: "World Psychiatry",
    year: 2019,
    pmid: "31189498",
    doi: "10.1002/wps.20699",
    category: "Landmark & Efficacy",
    evidenceLevel: "Landmark Cohort",
    summary:
      "Comprehensive nationwide Finnish cohort of 62,252 patients followed for 20 years assessing real-world mortality rates associated with various antipsychotics.",
    keyFinding:
      "Clozapine had the lowest all-cause mortality of all antipsychotics (adjusted hazard ratio 0.39), with an 80% reduction in completed suicides compared to no antipsychotic use.",
    url: "https://pubmed.ncbi.nlm.nih.gov/31189498/",
  },
  {
    id: "meltzer2003",
    title: "Clozapine Treatment for Suicidality in Schizophrenia: International Suicide Prevention Trial (InterSePT)",
    authors: "Meltzer HY, Alphs L, Green AI, Altamura AC, et al.",
    journal: "Archives of General Psychiatry",
    year: 2003,
    pmid: "12578431",
    doi: "10.1001/archpsyc.60.1.82",
    category: "Landmark & Efficacy",
    evidenceLevel: "Randomized Controlled Trial",
    summary:
      "Randomized open-label trial with masked raters comparing clozapine vs olanzapine in 980 schizophrenia/schizoaffective patients at high risk for suicide.",
    keyFinding:
      "Clozapine significantly reduced suicidal behavior (suicide attempts, hospitalizations to prevent suicide) by 26% compared to olanzapine (HR 0.74, p = 0.03), leading to the 2002 FDA approval.",
    url: "https://pubmed.ncbi.nlm.nih.gov/12578431/",
  },
  {
    id: "siskind2016",
    title: "Clozapine v. First- and Second-Generation Antipsychotics in Treatment-Refractory Schizophrenia: Systematic Review and Meta-Analysis",
    authors: "Siskind D, McCartney L, Goldschlager R, Kisely S",
    journal: "The British Journal of Psychiatry",
    year: 2016,
    pmid: "27634636",
    doi: "10.1192/bjp.bp.115.177261",
    category: "Landmark & Efficacy",
    evidenceLevel: "Meta-Analysis",
    summary:
      "Meta-analysis of 21 randomized controlled trials (2,364 patients) evaluating clozapine versus typical and atypical antipsychotics in treatment-resistant illness.",
    keyFinding:
      "Clozapine was unequivocally superior to both first-generation and other second-generation antipsychotics for total symptom reduction in refractory schizophrenia (SMD = 0.40).",
    url: "https://pubmed.ncbi.nlm.nih.gov/27634636/",
  },
  {
    id: "fda2025rems",
    title: "FDA Elimination of Clozapine Risk Evaluation and Mitigation Strategy (REMS) Program",
    authors: "US Food and Drug Administration (FDA) Center for Drug Evaluation and Research",
    journal: "FDA Drug Safety Communication / Federal Register",
    year: 2025,
    category: "Recent Advances (2024-2026)",
    evidenceLevel: "FDA Guidance",
    summary:
      "Official regulatory action by the US FDA eliminating the centralized Clozapine REMS registry requirements effective February 24, 2025.",
    keyFinding:
      "Determined that centralized portal registration and reporting was overly burdensome and caused inappropriate treatment interruptions. Prescribers continue clinical ANC monitoring under prescribing information.",
    url: "https://www.fda.gov/drugs/drug-safety-and-availability/",
  },
  {
    id: "ronaldson2011",
    title: "A New Monitoring Protocol for Clozapine-Induced Myocarditis Based on an Analysis of 75 Cases",
    authors: "Ronaldson KJ, Fitzgerald PB, Taylor AJ, Path C, McNeil JJ",
    journal: "Journal of Clinical Psychiatry",
    year: 2011,
    pmid: "21672506",
    doi: "10.4088/JCP.10m06631",
    category: "Cardiovascular Safety",
    evidenceLevel: "Systematic Review",
    summary:
      "Landmark Australian study identifying peak incidence of clozapine-induced myocarditis and establishing the standard laboratory monitoring protocol.",
    keyFinding:
      "Over 80% of myocarditis cases occur between days 14 and 28. Established weekly baseline and serial screening of Troponin I/T and CRP for the first 4 weeks, with prompt discontinuation if troponin exceeds 2x ULN.",
    url: "https://pubmed.ncbi.nlm.nih.gov/21672506/",
  },
  {
    id: "everypalmer2017",
    title: "Clozapine-Induced Gastrointestinal Hypomotility: A Serious, Underappreciated and Potentially Fatal Adverse Effect",
    authors: "Every-Palmer S, Ellis PM",
    journal: "CNS Drugs",
    year: 2017,
    pmid: "28585149",
    doi: "10.1007/s40263-017-0444-4",
    category: "GI Motility & Sialorrhea",
    evidenceLevel: "Systematic Review",
    summary:
      "Comprehensive review detailing the epidemiology, pathophysiology, and fatal outcomes of clozapine-induced gastrointestinal hypomotility (CIGH).",
    keyFinding:
      "CIGH causes more cumulative deaths than agranulocytosis, with a case fatality rate between 15% and 28% once bowel ischemia or perforation develops. Prophylactic laxatives must be routine.",
    url: "https://pubmed.ncbi.nlm.nih.gov/28585149/",
  },
  {
    id: "myles2018",
    title: "Point-of-Care Testing for Absolute Neutrophil Count in Clozapine Users: A Systemic Evaluation",
    authors: "Myles N, Myles H, Xia S, Large M, et al.",
    journal: "Schizophrenia Research",
    year: 2018,
    pmid: "29731336",
    doi: "10.1016/j.schres.2018.04.032",
    category: "Hematology & REMS",
    evidenceLevel: "Systematic Review",
    summary:
      "Evaluation of capillary point-of-care (POC) hematology analyzers compared to standard central laboratory venous phlebotomy.",
    keyFinding:
      "Capillary point-of-care ANC testing showed high concordance (correlation coefficient > 0.95) with laboratory venipuncture, reducing result turnaround from 24-48 hours to under 5 minutes.",
    url: "https://pubmed.ncbi.nlm.nih.gov/29731336/",
  },
  {
    id: "correll2023",
    title: "Management of Clozapine-Induced Metabolic Syndrome: GLP-1 Receptor Agonists and Beyond",
    authors: "Correll CU, Robinson DG, Schooler NR",
    journal: "The Lancet Psychiatry",
    year: 2023,
    pmid: "37421976",
    doi: "10.1016/S2215-0366(23)00189-X",
    category: "Recent Advances (2024-2026)",
    evidenceLevel: "Systematic Review",
    summary:
      "Systematic review of pharmacological interventions to counter clozapine-associated weight gain, hyperinsulinemia, and cardiovascular risk.",
    keyFinding:
      "GLP-1 receptor agonists (semaglutide, liraglutide) achieve clinically meaningful, sustained weight loss (-5 to -8 kg) and glycemic control without impairing antipsychotic efficacy.",
    url: "https://pubmed.ncbi.nlm.nih.gov/37421976/",
  },
  {
    id: "rostami2004",
    title: "Pharmacokinetics and Metabolism of Clozapine: The Central Role of CYP1A2 and Therapeutic Drug Monitoring",
    authors: "Rostami-Hodjegan A, Amin AM, Spencer EP, Lennard MS, Tucker GT",
    journal: "Clinical Pharmacokinetics",
    year: 2004,
    pmid: "15530130",
    doi: "10.2165/00003088-200443150-00004",
    category: "Pharmacokinetics & TDM",
    evidenceLevel: "Systematic Review",
    summary:
      "In-depth pharmacokinetic analysis of clozapine biotransformation pathways, enzyme saturation, and plasma concentration thresholds.",
    keyFinding:
      "CYP1A2 accounts for ~70% of clozapine clearance. Established the 350-600 ng/mL plasma concentration target and quantified the 50% decrease in clearance caused by CYP1A2 saturation or inhibitors.",
    url: "https://pubmed.ncbi.nlm.nih.gov/15530130/",
  },
  {
    id: "manu2018",
    title: "Clozapine Rechallenge After Neutropenia or Agranulocytosis: A Systematic Review and Meta-Analysis of 108 Cases",
    authors: "Manu P, Lapitskaya Y, Shaikh A, Kane JM",
    journal: "Journal of Clinical Psychiatry",
    year: 2018,
    pmid: "29757529",
    doi: "10.4088/JCP.17r11762",
    category: "Under Study & Pipeline",
    evidenceLevel: "Systematic Review",
    summary:
      "Analysis of 108 published rechallenge attempts after clozapine-induced neutropenia, examining predictors of success and failure.",
    keyFinding:
      "Rechallenge after non-severe neutropenia succeeded in 63% of patients, but succeeded in only 17% after true agranulocytosis (ANC < 500). G-CSF co-administration significantly increased success rates.",
    url: "https://pubmed.ncbi.nlm.nih.gov/29757529/",
  },
  {
    id: "lally2022",
    title: "Augmentation Strategies in Clozapine-Resistant Schizophrenia: A Systematic Review and Network Meta-Analysis",
    authors: "Lally J, MacCabe JH, Correll CU",
    journal: "Schizophrenia Bulletin",
    year: 2022,
    pmid: "35134208",
    doi: "10.1093/schbul/sbab142",
    category: "Under Study & Pipeline",
    evidenceLevel: "Meta-Analysis",
    summary:
      "Network meta-analysis of randomized controlled trials evaluating augmentation strategies in ultra-treatment-resistant schizophrenia.",
    keyFinding:
      "Electroconvulsive therapy (ECT) augmentation demonstrated the largest effect size for total psychopathology reduction, followed by lamotrigine and low-dose aripiprazole.",
    url: "https://pubmed.ncbi.nlm.nih.gov/35134208/",
  },
];

export const CLOZAPINE_REFERENCES = REFERENCE_LIBRARY;

