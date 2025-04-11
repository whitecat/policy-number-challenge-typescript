import {PolicyOcr} from '../src/policy_ocr';
import * as fs from 'fs';

describe('PolicyOcr', () => {
    let policyOcr: PolicyOcr = new PolicyOcr();

    it('loads', () => {
        expect(policyOcr).toBeDefined();
    });

    it('loads the sample.txt', () => {
        const sampleContent = fs.readFileSync('./test/assets/sampleInput.txt', 'utf-8');
        expect(sampleContent.split('\n').length).toBe(48);
    });

    describe('parseEntry', () => {
        it('parse document reads in a single line', () => {
            const entryLine = [
                "    _  _     _  _  _  _  _ ",
                "  | _| _||_||_ |_   ||_||_|",
                "  ||_  _|  | _||_|  ||_| _|",
                "                           ",
            ]

            policyOcr.parseEntry(entryLine)

            expect(policyOcr.parseEntry(entryLine)).toBe("123456789");
        })

        it('Add ? for entries that are not digits', () => {
            const entryLine = [
                "    _  _     _  _  _  _  _ ",
                "  | _| _ |_||_ |_   ||_||_|",
                "  ||_  _|  | _||_|  ||_| _|",
                "                           ",
            ]

            policyOcr.parseEntry(entryLine)

            expect(policyOcr.parseEntry(entryLine)).toBe("12?456789");
        })
    })

    describe('isValidChecksum', () => {
        it('return true if policy number is valid', () => {
            const policyNumber = "000000000";
            expect(policyOcr.isValidChecksum(policyNumber)).toBe(true);
        })

        it('return true if policy number is valid another check', () => {
            const policyNumber = "000000051";
            expect(policyOcr.isValidChecksum(policyNumber)).toBe(true);
        })

        it('returns false if policy number is invalid', () => {
            const policyNumber = "000000021";
            expect(policyOcr.isValidChecksum(policyNumber)).toBe(false);
        })

        it('returns false if policy number contains illegal character', () => {
            const policyNumber = "0000000?1";
            expect(policyOcr.isValidChecksum(policyNumber)).toBe(false);
        })
    })

    describe('validateFile', () => {
        it('validateFile throws error if entry line is not lines not dividable by 4', () => {
            const entryLines = [
                "    _  _     _  _  _  _  _ ",
                "  | _| _||_||_ |_   ||_||_|",
                "  ||_  _|  | _||_|  ||_| _|",
            ]

            expect(() => policyOcr.validateFile(entryLines)).toThrow(RangeError);
        })

        it('validateFile throws error if entry line are not all 27 characters in length', () => {
            const entryLines = [
                "    _  _     _  _  _  _  _ ",
                "  | _| _||_||_ |_   ||_||_|",
                "  ||_  _|  | _||_|  ||_| _",
                "                           ",
            ]

            expect(() => policyOcr.validateFile(entryLines)).toThrow(RangeError);
        })

        it('passes true with valid file', () => {
            const entryLines = [
                "    _  _     _  _  _  _  _ ",
                "  | _| _ |_||_ |_   ||_||_|",
                "  ||_  _|  | _||_|  ||_| _|",
                "                           ",
            ]

            expect(policyOcr.validateFile(entryLines)).toBe(true);
        })
    })

    describe('.processAndOutputFile', () => {
        let inputFile: string;
        let outputFile: string;

        beforeEach(() => {
            inputFile = './test_input.txt';
            outputFile = './test_output.txt';
        });

        afterEach(() => {
            if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
            if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
        });

        it('correctly processes entries that can be corrected', () => {
            const inputContent = [
                " _  _  _  _  _  _  _  _    ",
                "| || || || || || || ||    |",
                "|_||_||_||_||_||_| _| _|  |",
                "                           "
            ].join('\n');

            fs.writeFileSync(inputFile, inputContent);

            policyOcr.processAndOutputFile(inputFile, outputFile);

            const output = fs.readFileSync(outputFile, 'utf-8').split('\n');
            expect(output[0]).not.toContain(" ERR");
        });

        it('correctly processes entries that can be corrected test', () => {
            const inputContent = [
                "    _  _  _  _  _  _  _  _ ",
                "  || || || || || || || || |",
                "  ||_||_||_||_||_||_||_||_|",
                "                           "
            ].join('\n');

            fs.writeFileSync(inputFile, inputContent);

            policyOcr.processAndOutputFile(inputFile, outputFile);

            const output = fs.readFileSync(outputFile, 'utf-8').split('\n');
            expect(output[0]).toContain(" AMB");
        });
    });
});
