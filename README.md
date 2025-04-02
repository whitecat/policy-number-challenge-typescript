# Policy OCR

A Node.js application for the Kin Coding Challenge policy document OCR processing.

## System Requirements

- Node.js (v14 or higher)
- npm (v6 or higher)


## Installation

1. Install dependencies:
```bash
npm install
```


## Usage

Run tests using Jest:

```bash
npm test
```

## Project Structure

```
policy_ocr/
├── src/           # Source code
├── tests/         # Test files
├── package.json   # Project dependencies
├── tsconfig.json  # TypeScript configuration
├── jest.config.js # Jest configuration
└── README.md      # Project documentation
```


## Dependencies

This project uses:

- TypeScript for static typing
- Jest and ts-jest for testing


## Assumptions

I assume we want to not process a file if lineCount%4=0, or every line is 27 characters long because something is wrong with the file.


