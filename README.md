# pan-validator

## Module format

This package is ESM-only. Use `import` syntax in Node.js projects with `type: module`. CommonJS applications can load it with `await import("pan-card-validator")`.


Validate and parse Indian PAN (Permanent Account Number) card numbers - zero dependencies.

## Install

```bash
npm install pan-card-validator
```

## Usage

```js
import { isValidPan, parsePan } from 'pan-card-validator';

isValidPan('AAAPL1234C'); // true
isValidPan('not-a-pan');  // false

parsePan('AAAPL1234C');
// {
//   valid: true,
//   pan: 'AAAPL1234C',
//   entityTypeCode: 'P',
//   entityType: 'Individual',
//   holderInitial: 'L',
//   sequenceNumber: '1234',
//   checkDigit: 'C',
// }

parsePan('not-a-pan'); // { valid: false }
```

### Cross-checking the holder's name

A PAN's 5th character is the first letter of the holder's surname (for individuals) or entity name (for others). If you have the name on hand, pass it to catch a mismatched PAN:

```js
isValidPan('AAAPL1234C', { holderName: 'Lakshmi' }); // true - starts with 'L'
isValidPan('AAAPL1234C', { holderName: 'Kumar' });   // false - starts with 'K', not 'L'
```

## What this validates - and what it can't

A PAN is `AAAAA9999A`:

| Position | Meaning |
|---|---|
| 1-3 | Alphabetic series (no independent meaning) |
| 4 | Holder category: `A` AOP, `B` BOI, `C` Company, `F` Firm/LLP, `G` Government, `H` HUF, `J` Artificial Juridical Person, `L` Local Authority, `P` Individual, `T` Trust |
| 5 | First letter of surname (individuals) or entity name (others) |
| 6-9 | Sequence number |
| 10 | Check character |

This library validates the structure and the holder-category code (position 4), and can optionally cross-check position 5 against a supplied name.

**It cannot verify the 10th check character.** Unlike GSTIN or Aadhaar, the PAN check-digit algorithm is not publicly documented by the Income Tax Department - only their own systems (or the [official verification API](https://eportal.incometax.gov.in/)) can confirm a PAN is genuinely issued. This library only tells you a PAN is *well-formed*, not that it *exists*.

## License

MIT
