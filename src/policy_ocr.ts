export class PolicyOcr {
    private ZERO =
        " _ " +
        "| |" +
        "|_|";

    private ONE =
        "   " +
        "  |" +
        "  |";

    private TWO =
        " _ " +
        " _|" +
        "|_ ";

    private THREE =
        " _ " +
        " _|" +
        " _|";

    private FOUR =
        "   " +
        "|_|" +
        "  |";

    private FIVE =
        " _ " +
        "|_ " +
        " _|";

    private SIX =
        " _ " +
        "|_ " +
        "|_|";

    private SEVEN =
        " _ " +
        "  |" +
        "  |";

    private EIGHT =
        " _ " +
        "|_|" +
        "|_|";

    private NINE =
        " _ " +
        "|_|" +
        " _|";

    private DIGIT_MAP: { [key: string]: string } = {
        [this.ZERO]: '0',
        [this.ONE]: '1',
        [this.TWO]: '2',
        [this.THREE]: '3',
        [this.FOUR]: '4',
        [this.FIVE]: '5',
        [this.SIX]: '6',
        [this.SEVEN]: '7',
        [this.EIGHT]: '8',
        [this.NINE]: '9'
    };

    private REVERSE_DIGIT_MAP: { [key: string]: string } = Object.fromEntries(
        Object.entries(this.DIGIT_MAP).map(([key, value]) => [value, key])
    );

    parseEntry(entryLines: string[]): string {
        if (entryLines.length !== 4) {
            return "Invalid entry";
        }

        const digits = Array.from({length: 9}, (_, i) => {
            const digitStr =
                entryLines[0].slice(i * 3, i * 3 + 3) +
                entryLines[1].slice(i * 3, i * 3 + 3) +
                entryLines[2].slice(i * 3, i * 3 + 3);

            return this.DIGIT_MAP[digitStr] || '?';
        });

        return digits.join('');
    }

    isValidChecksum(policyNumber: string): boolean {
        if (!/^\d{9}$/.test(policyNumber)) {
            return false;
        }

        const sum = policyNumber
            .split('')
            .reverse()
            .map(Number)
            .reduce((acc, digit, idx) => acc + (idx + 1) * digit, 0);

        return sum % 11 === 0;
    }

    private tryReplacements(
        currentPolicy: string[],
        position: number,
        stack: Array<{ currentPolicy: string[], position: number }>,
        policyDigitStr: string | null
    ): void {
        for (const replacement of Object.keys(this.REVERSE_DIGIT_MAP)) {
            if (policyDigitStr === null && currentPolicy[position] === replacement) continue;

            const currentDigitStr = policyDigitStr || this.REVERSE_DIGIT_MAP[currentPolicy[position]];
            const replacementDigitStr = this.REVERSE_DIGIT_MAP[replacement];

            if (currentDigitStr && replacementDigitStr &&
                this.checkDifferenceCount(currentDigitStr, replacementDigitStr)) {
                const newPolicy = [...currentPolicy];
                newPolicy[position] = replacement;
                stack.push({currentPolicy: newPolicy, position: position + 1});
            }
        }
    }

    checkDifferenceCount(str1: string, str2: string): boolean {
        if (str1.length !== str2.length) {
            return false;
        }

        let diffCount = 0;

        for (let i = 0; i < str1.length; i++) {
            if (str1[i] !== str2[i]) {
                diffCount++;
                if (diffCount > 1) {
                    return false;
                }
            }
        }

        return diffCount === 1;
    }

    searchErrCorrections(entryLines: string[]): string[] {
        const corrections = new Set<string>();
        const policy = this.parseEntry(entryLines).split('');
        const stack: Array<{ currentPolicy: string[], position: number }> = [];
        stack.push({currentPolicy: [...policy], position: 0});

        while (stack.length > 0) {
            const {currentPolicy, position} = stack.pop()!;
            const policyNumber = currentPolicy.join('');
            const validChecksum = this.isValidChecksum(policyNumber);

            if (position === 9) {
                if (validChecksum) {
                    corrections.add(policyNumber);
                }
                continue;
            }

            if (!validChecksum) {
                this.tryReplacements(currentPolicy, position, stack, null);
            } else {
                corrections.add(policyNumber);
            }
            stack.push({currentPolicy: currentPolicy, position: position + 1});
        }

        return [...corrections];
    }

    searchIllCorrections(entryLines: string[]): string[] {
        const corrections: string[] = [];
        const policy = this.parseEntry(entryLines).split('');
        const stack: Array<{ currentPolicy: string[], position: number }> = [];

        stack.push({currentPolicy: [...policy], position: 0});

        while (stack.length > 0) {
            const {currentPolicy, position} = stack.pop()!;

            if (position === 9) {
                const joinedPolicy = currentPolicy.join('');
                if (this.isValidChecksum(joinedPolicy)) {
                    corrections.push(joinedPolicy);
                }
                continue;
            }

            if (currentPolicy[position] === '?') {
                const policyDigitStr =
                    entryLines[0].slice(position * 3, position * 3 + 3) +
                    entryLines[1].slice(position * 3, position * 3 + 3) +
                    entryLines[2].slice(position * 3, position * 3 + 3);
                this.tryReplacements(currentPolicy, position, stack, policyDigitStr);
            } else {
                stack.push({currentPolicy: currentPolicy, position: position + 1});
            }
        }

        return corrections;
    }

    validateFile(entryLines: string[]): boolean {
        if (entryLines.length % 4 !== 0) {
            throw new RangeError('Error parsing policy')
        }

        if (!entryLines.every(line => line.length === 27)) {
            throw new RangeError('Line length must be 27 characters');
        }

        return true
    }

    processAndOutputFile(inputFile: string, outputFile: string): void {
        const fs = require('fs');

        const inputContent = fs.readFileSync(inputFile, 'utf-8');
        const entries = inputContent.split('\n').filter(Boolean);

        if(!this.validateFile(entries)) {
            return;
        }

        const results = [];

        for (let i = 0; i < entries.length; i += 4) {
            const entryLines = entries.slice(i, i + 4);
            const policy = this.parseEntry(entryLines);

            if (policy.includes('?')) {
                const corrections = this.searchIllCorrections(entryLines);

                if (corrections.length === 1) {
                    results.push(corrections[0]);
                } else if (corrections.length === 0) {
                    results.push(`${policy} ILL`);
                } else {
                    results.push(`${policy} AMB`);
                }
            } else if (this.isValidChecksum(policy)) {
                results.push(policy);
            } else {
                const corrections = this.searchErrCorrections(entryLines);

                if (corrections.length === 1) {
                    results.push(corrections[0]);
                } else if (corrections.length === 0) {
                    results.push(`${policy} ERR`);
                } else {
                    results.push(`${policy} AMB`);
                }
            }
        }

        fs.writeFileSync(outputFile, results.join('\n'), 'utf-8');
    }
}
