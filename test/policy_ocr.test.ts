import {PolicyOcr} from '../src/policy_ocr';
import * as fs from 'fs';

describe('PolicyOcr', () => {
    it('loads', () => {
        expect(PolicyOcr).toBeDefined();
    });

    it('loads the sample.txt', () => {
        const sampleContent = fs.readFileSync('./test/assets/sample.txt', 'utf-8');
        expect(sampleContent.split('\n').length).toBe(44);
    });

    describe('User Story 1 - parseEntry - read in policy document', () => {
        it('parse document throws error if entry line is not 4 lines', () => {
            const entryLine = [
                "    _  _     _  _  _  _  _ ",
                "  | _| _||_||_ |_   ||_||_|",
                "  ||_  _|  | _||_|  ||_| _|",
            ].join('\n');

            expect(() => PolicyOcr.parseEntry(entryLine)).toThrow(RangeError);
        })

        it('parse document throws error if entry line are not all 27 characters in length', () => {
            const entryLine = [
                "    _  _     _  _  _  _  _ ",
                "  | _| _||_||_ |_   ||_||_|",
                "  ||_  _|  | _||_|  ||_| _",
                "                           ",
            ].join('\n');

            expect(() => PolicyOcr.parseEntry(entryLine)).toThrow(RangeError);
        })

        it('parse document reads in a single line', () => {
            const entryLine = [
                "    _  _     _  _  _  _  _ ",
                "  | _| _||_||_ |_   ||_||_|",
                "  ||_  _|  | _||_|  ||_| _|",
                "                           ",
            ].join('\n');

            PolicyOcr.parseEntry(entryLine)

            expect(PolicyOcr.parseEntry(entryLine)).toBe("123456789");
        })
    })

    describe('User Story 2 - validateChecksum', () => {
        it('return true if policy number is valid', () => {
            const policyNumber = "000000000";
            expect(PolicyOcr.validateChecksum(policyNumber)).toBe(true);
        })

        it('return true if policy number is valid another check', () => {
            const policyNumber = "000000051";
            expect(PolicyOcr.validateChecksum(policyNumber)).toBe(true);
        })

        it('returns false if policy number is invalid', () => {
            const policyNumber = "000000021";
            expect(PolicyOcr.validateChecksum(policyNumber)).toBe(false);
        })
    })
});
