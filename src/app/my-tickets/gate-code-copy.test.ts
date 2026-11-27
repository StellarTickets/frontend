import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// #242 "done when": the shared CopyButton is used on My tickets for the gate code.
describe('My tickets gate code (#242)', () => {
  it('renders CopyButton for the gate code', () => {
    const page = readFileSync(join(__dirname, 'page.tsx'), 'utf8');
    expect(page).toMatch(/import \{ CopyButton \} from '@\/components\/copy-button'/);
    expect(page).toMatch(/<CopyButton value=\{secret\} label="Copy gate code" \/>/);
  });
});
