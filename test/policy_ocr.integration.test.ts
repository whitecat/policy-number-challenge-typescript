import {PolicyOcr} from '../src/policy_ocr';
import * as fs from 'fs';
import * as path from 'path';

describe('PolicyOcr integration test', () => {
    let outputFile: string;

    beforeEach(() => {
        outputFile = path.resolve(__dirname, 'test_output.txt');
    });

    afterEach(() => {
        if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
    });

    it('test large file outputs a correct file', () => {
        const policyOcr = new PolicyOcr();
        const inputFile = path.resolve(__dirname, 'assets/sampleInput.txt');
        const expectedOutput = path.resolve(__dirname, 'assets/sampleOutput.txt');

        policyOcr.processAndOutputFile(inputFile, outputFile);

        const output = fs.readFileSync(outputFile, 'utf-8').split('\n');
        const expected = fs.readFileSync(expectedOutput, 'utf-8').split('\n');

        expect(output).toEqual(expected);
    });
});
