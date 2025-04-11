# Policy OCR

A Node.js application that processes the Kin Coding Challenge policy document using OCR. 
This is for anyone reading this in the future. 
Ensure that the application has a way to run it outside of the tests. 
Add instructions to the documentation on how to execute the system without running the tests. 
Also add more unit tests, to cover tryReplacements and checkDifferenceCount, for User Story 4.

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


