// Sample data. Later this can come from the backend (e.g. GET /api/courses).
// progress = % completed by the logged-in user (0 = not started).
// STAGES follow the real chip design flow, left to right.
export const STAGES = [
  { id: 'foundations', short: 'CMOS and digital logic', label: 'Foundations', desc: 'Transistors, CMOS and digital logic. Everything else in VLSI is built on these.', icon: 'M3 12h5M8 6v12M12 6v3.5M12 10.5v3M12 14.5v3.5M12 7.5h7V4M12 16.5h7V20M12 12h4' },
  { id: 'rtl', short: 'Verilog and SystemVerilog', label: 'RTL Design', desc: 'Describe the hardware in Verilog and SystemVerilog. This code becomes the chip.', icon: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 5l-4 14' },
  { id: 'verification', short: 'Testbenches and UVM', label: 'Verification', desc: 'Prove the design does what the spec says before it is built. Often most of a project\'s effort.', icon: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5' },
  { id: 'synthesis', short: 'Gates and timing', label: 'Synthesis and STA', desc: 'Turn RTL into gates, then check that every path meets its timing.', icon: 'M12 4a8 8 0 1 0 0 16a8 8 0 0 0 0-16M12 8v4l3 2' },
  { id: 'pd', short: 'Placement, clocks, routing', label: 'Physical Design', desc: 'Place the cells, build the clock tree and route the wires to produce the final layout.', icon: 'M3 3h18v18H3zM3 12h18M12 3v18M6.5 7.5h3M14.5 16.5h3' },
  { id: 'dft', short: 'Scan and ATPG', label: 'DFT and Test', desc: 'Add scan and test logic so every manufactured chip can be checked.', icon: 'M12 3v4M12 17v4M3 12h4M17 12h4M12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6' },
  { id: 'analog', short: 'Amplifiers and layout', label: 'Analog and Mixed-Signal', desc: 'Amplifiers, biasing and layout for the analog blocks inside a chip.', icon: 'M2 12c2-7 4-7 6 0s4 7 6 0 4-7 6 0' },
  { id: 'career', short: 'Questions and coding', label: 'Interview Prep', desc: 'Practise the questions VLSI interviews ask, with model answers.', icon: 'M3 8h18v12H3zM9 8V5h6v3M3 13h18' },
]

export const COURSES = [
  { id: 'cmos-basics', stage: 'foundations', title: 'Semiconductor Devices and CMOS Basics', level: 'Beginner', lessons: 20, hours: 16, progress: 70, skills: ['PN junction', 'MOSFET', 'CMOS inverter'], blurb: 'How transistors work and how they combine into the CMOS gates every chip uses.' },
  { id: 'digital-for-vlsi', stage: 'foundations', title: 'Digital Electronics for VLSI', level: 'Beginner', lessons: 26, hours: 20, progress: 100, skills: ['Logic design', 'FSMs', 'Timing'], blurb: 'Combinational and sequential design, state machines and the timing ideas behind them.' },
  { id: 'verilog-zero', stage: 'rtl', title: 'Verilog HDL from Zero', level: 'Beginner', lessons: 28, hours: 21, progress: 45, skills: ['Verilog', 'Testbenches', 'FSM coding'], blurb: 'Write synthesizable Verilog and test it with your own testbenches.' },
  { id: 'advanced-rtl', stage: 'rtl', title: 'Advanced RTL Design', level: 'Intermediate', lessons: 24, hours: 20, progress: 0, skills: ['SystemVerilog', 'Pipelining', 'CDC'], blurb: 'Pipelines, clock domain crossing, FIFOs and coding style that synthesizes cleanly.' },
  { id: 'sv-verification', stage: 'verification', title: 'SystemVerilog for Verification', level: 'Intermediate', lessons: 30, hours: 24, progress: 0, skills: ['Classes', 'Assertions', 'Coverage'], blurb: 'Constrained-random testing, assertions and functional coverage.' },
  { id: 'uvm', stage: 'verification', title: 'UVM Masterclass', level: 'Advanced', lessons: 26, hours: 22, progress: 0, skills: ['UVM', 'Sequences', 'Scoreboards'], blurb: 'Build a reusable UVM testbench: agents, sequences, scoreboards and the factory.' },
  { id: 'synthesis', stage: 'synthesis', title: 'Logic Synthesis and Constraints', level: 'Intermediate', lessons: 18, hours: 14, progress: 0, skills: ['SDC', 'Synthesis', 'Area and power'], blurb: 'Turn RTL into a gate-level netlist and steer it with timing constraints.' },
  { id: 'sta', stage: 'synthesis', title: 'Static Timing Analysis', level: 'Intermediate', lessons: 22, hours: 18, progress: 0, skills: ['Setup and hold', 'Clocks', 'Slack'], blurb: 'Read timing reports, fix violations and understand setup, hold and clock skew.' },
  { id: 'pd-flow', stage: 'pd', title: 'Physical Design Flow', level: 'Advanced', lessons: 28, hours: 24, progress: 0, skills: ['Floorplan', 'CTS', 'Routing'], blurb: 'Floorplanning, placement, clock tree synthesis, routing and signoff checks.' },
  { id: 'low-power', stage: 'pd', title: 'Low Power Design Techniques', level: 'Advanced', lessons: 16, hours: 12, progress: 0, skills: ['Clock gating', 'UPF', 'DVFS'], blurb: 'Where chip power goes and the techniques used to cut it.' },
  { id: 'dft', stage: 'dft', title: 'DFT and Scan Design', level: 'Advanced', lessons: 20, hours: 16, progress: 0, skills: ['Scan chains', 'ATPG', 'BIST'], blurb: 'Make chips testable with scan insertion, ATPG and built-in self-test.' },
  { id: 'analog-ic', stage: 'analog', title: 'Analog IC Design Basics', level: 'Intermediate', lessons: 24, hours: 20, progress: 0, skills: ['Amplifiers', 'Biasing', 'Matching'], blurb: 'Single-stage amplifiers, current mirrors, biasing and the layout habits that matter.' },
  { id: 'vlsi-interview', stage: 'career', title: 'VLSI Interview Prep', level: 'All levels', lessons: 22, hours: 14, progress: 0, skills: ['CMOS', 'STA', 'Digital design'], blurb: 'The questions VLSI interviews actually ask, from CMOS to timing, with model answers.' },
  { id: 'rtl-practice', stage: 'career', title: 'RTL Coding Practice', level: 'Intermediate', lessons: 40, hours: 18, progress: 0, skills: ['Verilog', 'FSMs', 'Puzzles'], blurb: 'Timed RTL coding problems of the kind asked in design interviews.' },
]
