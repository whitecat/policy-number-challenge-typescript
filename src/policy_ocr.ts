import fs from "fs";

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

    parseEntry(entryLines: string[]): string {

        return [...Array(9).keys()]
            .map(i => {
                const index = i * 3;
                const digitStr =
                    entryLines[0].slice(index, index + 3) +
                    entryLines[1].slice(index, index + 3) +
                    entryLines[2].slice(index, index + 3);
                return this.DIGIT_MAP[digitStr] || "?";
            })
            .join("");
    }

    validateChecksum(policyNumber: string): boolean {
        if (!/^\d+$/.test(policyNumber)) {
            return false;
        }

        const sum = policyNumber
            .split('')
            .reverse()
            .map(Number)
            .reduce((acc, number, index) =>
                acc + ((index + 1) * number)
            );

        return sum % 11 === 0;
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

    processAndOutputFile(inputFile: string, outputFile: string) {
        const entries = fs.readFileSync(inputFile, 'utf-8').split('\n');

        if(!this.validateFile(entries)) {
            return;
        }

        const outputText: string[] = [];

        for (let i = 0; i < entries.length; i += 4) {
            const entryLines = entries.slice(i, i + 4);
            let entry = this.parseEntry(entryLines);
            if (entry.includes("?")) {
                entry += " ILL"
            } else if (!this.validateChecksum(entry)) {
                entry += " ERR"
            }
            outputText.push(entry);
        }

        fs.writeFileSync(outputFile, outputText.join('\n'));
    }
}
