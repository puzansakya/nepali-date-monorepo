
import { describe, expect, it } from 'vitest';
import { ad2bs, bs2ad } from '.';

describe('Nepali Date Converter', () => {
    it('ad2bs', () => {

        expect(ad2bs("2021-01-01")).toBe("2077-09-17")

        expect(ad2bs("2024-04-15")).toBe("2081-01-03")
        expect(ad2bs("2024-04-27")).toBe("2081-01-15")
        expect(ad2bs("2024-05-13")).toBe("2081-01-31")
        
        expect(ad2bs("2024-05-14")).toBe("2081-02-01")
        expect(ad2bs("2024-05-28")).toBe("2081-02-15")
        expect(ad2bs("2024-06-14")).toBe("2081-02-32")
        
        expect(ad2bs("2024-06-15")).toBe("2081-03-01")
        expect(ad2bs("2024-06-29")).toBe("2081-03-15")
        expect(ad2bs("2024-07-04")).toBe("2081-03-20")
        expect(ad2bs("2024-07-15")).toBe("2081-03-31")
        
        expect(ad2bs("2024-07-16")).toBe("2081-04-01")
        expect(ad2bs("2024-07-30")).toBe("2081-04-15")
        expect(ad2bs("2024-08-16")).toBe("2081-04-32")
        
    });
  
    it('bs2ad', () => {
        expect(bs2ad("2081-01-03")).toBe("2024-04-15")
        expect(bs2ad("2081-01-15")).toBe("2024-04-27")
        expect(bs2ad("2081-01-31")).toBe("2024-05-13")
        
        expect(bs2ad("2081-02-01")).toBe("2024-05-14")
        expect(bs2ad("2081-02-15")).toBe("2024-05-28")
        expect(bs2ad("2081-02-32")).toBe("2024-06-14")
        
        expect(bs2ad("2081-03-01")).toBe("2024-06-15")
        expect(bs2ad("2081-03-15")).toBe("2024-06-29")
        expect(bs2ad("2081-03-20")).toBe("2024-07-04")
        expect(bs2ad("2081-03-31")).toBe("2024-07-15")
        
        expect(bs2ad("2081-04-01")).toBe("2024-07-16")
        expect(bs2ad("2081-04-15")).toBe("2024-07-30")
        expect(bs2ad("2081-04-32")).toBe("2024-08-16")
        
    });
});




