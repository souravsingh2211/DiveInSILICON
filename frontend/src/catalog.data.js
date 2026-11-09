// Sample content for the Interview prep, Projects and Internships pages.
// Replace with your real data (or load it from the backend later).
export const NAV = [
  ['Home', '/'],
  ['Courses', '/courses'],
  ['Interview prep', '/interview'],
  ['Projects', '/projects'],
  ['Internships', '/internships'],
]

const item = (id, title, tag, blurb, meta, skills) => ({ id, title, tag, blurb, meta, skills })

export const CATALOG = {
  interview: {
    title: 'Crack your VLSI interview.',
    sub: 'Question banks, timed RTL coding and mock rounds, with model answers.',
    search: 'Search topics or skills (e.g. STA, FSM)',
    cta: 'Start practising',
    icon: 'M4 5h16v11H9l-5 4z',
    filters: ['All', 'Question bank', 'Coding practice', 'Mock round'],
    items: [
      item('i-cmos', 'CMOS and Devices', 'Question bank', 'Inverters, delays, MOSFET behaviour and the device basics interviewers start with.', ['40 questions', 'Beginner'], ['CMOS', 'MOSFET', 'Delay']),
      item('i-digital', 'Digital Design', 'Question bank', 'Logic minimisation, FSMs, setup and hold, metastability and clock domain crossing.', ['50 questions', 'Beginner'], ['FSMs', 'Timing', 'CDC']),
      item('i-rtl', 'RTL and Verilog', 'Question bank', 'Blocking vs non-blocking, synthesizable coding, latches and common pitfalls.', ['45 questions', 'Intermediate'], ['Verilog', 'RTL', 'Synthesis']),
      item('i-sta', 'Static Timing Analysis', 'Question bank', 'Setup, hold, skew, OCV and how to fix timing violations.', ['30 questions', 'Intermediate'], ['STA', 'Slack', 'Clocks']),
      item('i-dv', 'Verification and UVM', 'Question bank', 'Constrained-random testing, coverage, assertions and UVM concepts.', ['35 questions', 'Intermediate'], ['UVM', 'Coverage', 'SVA']),
      item('i-pd', 'DFT and Physical Design', 'Question bank', 'Scan, ATPG, floorplanning, CTS, routing and signoff questions.', ['25 questions', 'Advanced'], ['DFT', 'CTS', 'Routing']),
      item('i-code', 'RTL Coding Practice', 'Coding practice', 'Timed Verilog problems: FSMs, counters, FIFOs and arbiters.', ['40 problems', 'Intermediate'], ['Verilog', 'FSMs', 'FIFOs']),
      item('i-puzzles', 'Digital Design Puzzles', 'Coding practice', 'Short logic puzzles that come up in design rounds.', ['30 puzzles', 'Beginner'], ['Logic', 'Counters', 'Gates']),
      item('i-mock-rtl', 'Mock round: RTL Design', 'Mock round', 'A timed round with one RTL question, followed by a discussion of your code.', ['60 minutes', 'Intermediate'], ['Verilog', 'Design']),
      item('i-mock-dv', 'Mock round: Verification', 'Mock round', 'Build a small testbench and talk through your verification plan.', ['60 minutes', 'Advanced'], ['SystemVerilog', 'UVM']),
      item('i-mock-fund', 'Mock round: Fundamentals', 'Mock round', 'A mixed round on CMOS, digital design and timing basics.', ['45 minutes', 'Beginner'], ['CMOS', 'Digital']),
    ],
  },
  projects: {
    title: 'Build things recruiters can see.',
    sub: 'Guided VLSI projects, from a first ALU to a pipelined core, each with a write-up you can share.',
    search: 'Search projects or skills (e.g. UART, UVM)',
    cta: 'Start project',
    icon: 'M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4',
    filters: ['All', 'Beginner', 'Intermediate', 'Advanced'],
    items: [
      item('p-alu', '8-bit ALU in Verilog', 'Beginner', 'Write, simulate and test a complete arithmetic logic unit.', ['About 6 hours', 'RTL Design'], ['Verilog', 'Testbench']),
      item('p-traffic', 'Traffic light controller', 'Beginner', 'Design a finite state machine and check every state transition.', ['About 4 hours', 'RTL Design'], ['FSM', 'Verilog']),
      item('p-uart', 'UART transmitter and receiver', 'Intermediate', 'Design a serial interface and verify it with a testbench.', ['About 10 hours', 'RTL Design'], ['Verilog', 'Baud rate', 'Testbench']),
      item('p-fifo', 'Synchronous FIFO with a testbench', 'Intermediate', 'Build a FIFO, then verify it with constrained-random tests.', ['About 10 hours', 'Verification'], ['SystemVerilog', 'Assertions']),
      item('p-i2c', 'I2C master controller', 'Intermediate', 'Implement the I2C protocol and test it against a simple slave model.', ['About 14 hours', 'RTL Design'], ['Protocols', 'FSM']),
      item('p-arb', 'Round-robin arbiter', 'Intermediate', 'Share a resource fairly between requesters and prove it with assertions.', ['About 8 hours', 'RTL Design'], ['Arbitration', 'SVA']),
      item('p-fir', 'FIR filter in RTL', 'Advanced', 'Turn a filter equation into a pipelined, synthesizable design.', ['About 16 hours', 'Signal processing'], ['Pipelining', 'Fixed point']),
      item('p-risc', 'Pipelined RISC-V core (RV32I)', 'Advanced', 'Build a five-stage pipeline with hazard handling and test it with programs.', ['About 40 hours', 'Digital design'], ['Pipelining', 'Hazards', 'Verilog']),
      item('p-axi', 'AXI-lite slave with a UVM testbench', 'Advanced', 'Design a bus slave and verify it with a reusable UVM environment.', ['About 30 hours', 'Verification'], ['AXI', 'UVM', 'Coverage']),
    ],
  },
  internships: {
    title: 'Take your first step into the industry.',
    sub: 'Internship tracks for the roles VLSI teams hire for. Build the skills, then apply from your dashboard.',
    search: 'Search roles or skills (e.g. UVM, STA)',
    cta: 'View track',
    icon: 'M7 17L17 7M9 7h8v8',
    filters: ['All', 'Front-end', 'Verification', 'Back-end', 'Test'],
    items: [
      item('n-rtl', 'RTL Design Intern', 'Front-end', 'Write and review Verilog for real design blocks.', ['3 months', 'Remote'], ['Verilog', 'SystemVerilog', 'FSMs']),
      item('n-digital', 'Digital Design Intern', 'Front-end', 'Work on microarchitecture, RTL and lint clean-up for small blocks.', ['3 months', 'Remote'], ['RTL', 'Lint', 'Timing']),
      item('n-dv', 'Design Verification Intern', 'Verification', 'Build testbenches and find bugs before tape-out.', ['3 months', 'Remote'], ['SystemVerilog', 'UVM', 'Coverage']),
      item('n-uvm', 'UVM Verification Intern', 'Verification', 'Create agents, sequences and scoreboards for a protocol block.', ['6 months', 'Hybrid'], ['UVM', 'Sequences', 'Scoreboards']),
      item('n-pd', 'Physical Design Intern', 'Back-end', 'Work on floorplanning, clock trees and layout closure.', ['6 months', 'On-site'], ['Floorplan', 'CTS', 'Routing']),
      item('n-sta', 'STA and Timing Intern', 'Back-end', 'Analyse timing reports and help close setup and hold violations.', ['3 months', 'Hybrid'], ['STA', 'Constraints', 'Slack']),
      item('n-dft', 'DFT Intern', 'Test', 'Insert scan chains and generate test patterns for small designs.', ['3 months', 'Hybrid'], ['Scan', 'ATPG', 'BIST']),
    ],
  },
}
