// Chip design flow: 8 stages. Order matters (Stage 1 -> Stage 8).
// "icon" is an SVG path drawn inside a 24x24 viewBox.
export const STAGES = [
  { id: 'spec',   label: 'Specification',  desc: 'Decide what the chip must do: features, speed, power and area targets.', icon: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7' },
  { id: 'rtl',    label: 'RTL Design',     desc: 'Describe the hardware in Verilog or VHDL at register-transfer level.', icon: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16' },
  { id: 'verify', label: 'Verification',   desc: 'Test the design with testbenches, UVM and assertions before building it.', icon: 'M5 12l4 4 10-10' },
  { id: 'synth',  label: 'Synthesis',      desc: 'Turn RTL into a gate-level netlist using a standard cell library.', icon: 'M4 6h6v4H4zM14 14h6v4h-6zM10 8h4v8M4 14h6v4H4z' },
  { id: 'dft',    label: 'DFT',            desc: 'Add scan chains and test logic so manufactured chips can be tested.', icon: 'M4 12h4l2-6 4 12 2-6h4' },
  { id: 'pd',     label: 'Physical Design', desc: 'Floorplan, place, route and meet timing. The layout of the chip.', icon: 'M3 3h18v18H3zM3 9h18M9 3v18' },
  { id: 'sta',    label: 'Signoff / STA',  desc: 'Check timing, power and design rules before sending the chip to fab.', icon: 'M12 6v6l4 2M12 3a9 9 0 100 18 9 9 0 000-18z' },
  { id: 'fab',    label: 'Tape-out',       desc: 'Final files go to the foundry. Then fabrication, packaging and testing.', icon: 'M12 3l9 5v8l-9 5-9-5V8zM12 12l9-5M12 12v9M12 12L3 7' },
]

// stage must match one of the STAGES ids above.
// progress is a sample value (0-100). Later this can come from your backend.
export const COURSES = [
  {
    id: 'digital-electronics', stage: 'spec', title: 'Digital Electronics Basics',
    blurb: 'Logic gates, flip-flops, counters and FSMs. The base for all chip design.',
    skills: ['Logic gates', 'FSM', 'Timing'], level: 'Beginner', lessons: 18, hours: 9, progress: 0,
  },
  {
    id: 'verilog', stage: 'rtl', title: 'Verilog for RTL Design',
    blurb: 'Write synthesizable Verilog: modules, always blocks, FSMs and datapaths.',
    skills: ['Verilog', 'RTL', 'FSM'], level: 'Beginner', lessons: 24, hours: 12, progress: 0,
  },
  {
    id: 'systemverilog', stage: 'verify', title: 'SystemVerilog Testbenches',
    blurb: 'Build self-checking testbenches with classes, randomization and coverage.',
    skills: ['SystemVerilog', 'Coverage', 'Assertions'], level: 'Intermediate', lessons: 22, hours: 11, progress: 0,
  },
  {

    id: 'uvm', stage: 'verify', title: 'UVM Methodology',
    blurb: 'Industry-standard verification: agents, sequences, scoreboards and env.',
    skills: ['UVM', 'Agents', 'Scoreboard'], level: 'Advanced', lessons: 28, hours: 16, progress: 0,
  },
  {
    id: 'synthesis', stage: 'synth', title: 'Logic Synthesis',
    blurb: 'Constraints, libraries and optimization. Get a clean gate-level netlist.',
    skills: ['SDC', 'Synthesis', 'Libraries'], level: 'Intermediate', lessons: 16, hours: 8, progress: 0,
  },
  {
    id: 'dft', stage: 'dft', title: 'DFT and Scan Insertion',
    blurb: 'Scan chains, ATPG and BIST. Make your chip testable after fabrication.',
    skills: ['Scan', 'ATPG', 'BIST'], level: 'Intermediate', lessons: 14, hours: 7, progress: 0,
  },
  {
    id: 'physical-design', stage: 'pd', title: 'Physical Design Flow',
    blurb: 'Floorplanning, placement, CTS and routing from netlist to layout.',
    skills: ['Floorplan', 'CTS', 'Routing'], level: 'Advanced', lessons: 26, hours: 15, progress: 0,
  },
  {
    id: 'sta', stage: 'sta', title: 'Static Timing Analysis',
    blurb: 'Setup, hold, clock skew and timing closure explained step by step.',
    skills: ['STA', 'Setup/Hold', 'Skew'], level: 'Advanced', lessons: 20, hours: 10, progress: 0,
  },
  {
    id: 'tapeout', stage: 'fab', title: 'Signoff and Tape-out',
    blurb: 'DRC, LVS, IR drop and final checks before the design goes to the foundry.',
    skills: ['DRC', 'LVS', 'GDSII'], level: 'Advanced', lessons: 12, hours: 6, progress: 0,
  },
]