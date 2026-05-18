#!/usr/bin/env node
/**
 * TypeForge - Main entry point
 */

export function greet(name: string): string {
  return `Hello from TypeForge, ${name}!`;
}

if (require.main === module) {
  console.log(greet("World"));
}
