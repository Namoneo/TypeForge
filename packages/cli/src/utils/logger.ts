const R = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';

export const logger = {
  info: (msg: string) => console.log(`${BLUE}ℹ${R}  ${msg}`),
  success: (msg: string) => console.log(`${GREEN}✓${R}  ${msg}`),
  warn: (msg: string) => console.log(`${YELLOW}⚠${R}  ${msg}`),
  error: (msg: string) => console.error(`${RED}✖${R}  ${msg}`),
  step: (msg: string) => console.log(`  ${CYAN}→${R} ${msg}`),
  dim: (msg: string) => console.log(`${DIM}${msg}${R}`),
  bold: (text: string) => `${BOLD}${text}${R}`,
  heading: (msg: string) => console.log(`\n${BOLD}${msg}${R}\n`),
  blank: () => console.log(),
};
