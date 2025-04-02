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
});