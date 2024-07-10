import { describe, expect, it } from 'vitest';
import { isDateInConversionRange } from '.';

describe('Nepali Date Converter', () => {

  it('should return true if eng date is in conversion range', () => {
    // pass 1
    expect(isDateInConversionRange("2024-10-29", false)).to.be.true;

    // pass 2
    expect(isDateInConversionRange("1943-04-15", false)).to.be.true;

    // pass 3
    expect(isDateInConversionRange("2033-03-01", false)).to.be.true;
  });

  it('should return false if eng date is not in conversion range', () => {
    // pass 1
    expect(isDateInConversionRange("2124-10-29", false)).to.be.false;

    // pass 2
    expect(isDateInConversionRange("1940-10-29", false)).to.be.false;
  });

  it('should return true if nepali date is in conversion range', () => {
    const isEngDateInConversionRangeData = isDateInConversionRange("1990-10-29", true);
    expect(isEngDateInConversionRangeData).to.be.false;
  });

  it('should return true if nepali date is in conversion range', () => {
    expect(isDateInConversionRange("2091-10-29", true)).to.be.false;
  });
});

