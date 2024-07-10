import { describe, expect, it } from 'vitest';
import { zeroPad } from '.';

describe.skip('Zero Pad', () => {
  it('should return with correct zero padding for single digit', () => {
    const padded = zeroPad(1);
    expect(padded).to.be.equal('01');
  });
  it('should return with correct zero padding for double digit', () => {
    const padded = zeroPad(22);
    expect(padded).to.be.equal('22');
  });
});