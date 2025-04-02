export class PolicyOcr {
    private static ZERO =
        " _ " +
        "| |" +
        "|_|";

    private static ONE =
        "   " +
        "  |" +
        "  |";

    private static TWO =
        " _ " +
        " _|" +
        "|_ ";

    private static THREE =
        " _ " +
        " _|" +
        " _|";

    private static FOUR =
        "   " +
        "|_|" +
        "  |";

    private static FIVE =
        " _ " +
        "|_ " +
        " _|";

    private static SIX =
        " _ " +
        "|_ " +
        "|_|";

    private static SEVEN =
        " _ " +
        "  |" +
        "  |";

    private static EIGHT =
        " _ " +
        "|_|" +
        "|_|";

    private static NINE =
        " _ " +
        "|_|" +
        " _|";

    private static DIGIT_MAP: { [key: string]: string } = {
        [PolicyOcr.ZERO]: '0',
        [PolicyOcr.ONE]: '1',
        [PolicyOcr.TWO]: '2',
        [PolicyOcr.THREE]: '3',
        [PolicyOcr.FOUR]: '4',
        [PolicyOcr.FIVE]: '5',
        [PolicyOcr.SIX]: '6',
        [PolicyOcr.SEVEN]: '7',
        [PolicyOcr.EIGHT]: '8',
        [PolicyOcr.NINE]: '9'
    };

    static parseEntry(entryLine: string): string {
        const entryLines = entryLine.split('\n')
        if (entryLines.length != 4) {
            throw new RangeError('Error parsing policy')
        }
        entryLines.every(line => line.length === 27) || (() => { throw new RangeError('Line length must be 27 characters'); })();

        return [...Array(9).keys()]
            .map(i => {
                const index = i * 3;
                const digitStr =
                    entryLines[0].slice(index, index + 3) +
                    entryLines[1].slice(index, index + 3) +
                    entryLines[2].slice(index, index + 3);
                return this.DIGIT_MAP[digitStr];
            })
            .join("");
    }
}
