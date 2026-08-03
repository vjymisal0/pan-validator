import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidPan, parsePan } from '../src/index.js';

// Synthetic, structurally-valid PANs used for illustration only - not real numbers.
const VALID_INDIVIDUAL_PAN = 'AAAPL1234C'; // P = Individual
const VALID_COMPANY_PAN = 'AAACT1234D'; // C = Company

test('parsePan accepts a well-formed individual PAN', () => {
  const result = parsePan(VALID_INDIVIDUAL_PAN);

  assert.equal(result.valid, true);
  assert.equal(result.entityTypeCode, 'P');
  assert.equal(result.entityType, 'Individual');
  assert.equal(result.holderInitial, 'L');
  assert.equal(result.sequenceNumber, '1234');
  assert.equal(result.checkDigit, 'C');
});

test('parsePan accepts a well-formed company PAN', () => {
  const result = parsePan(VALID_COMPANY_PAN);

  assert.equal(result.valid, true);
  assert.equal(result.entityTypeCode, 'C');
  assert.equal(result.entityType, 'Company');
});

test('parsePan is case-insensitive and trims whitespace', () => {
  const result = parsePan(`  ${VALID_INDIVIDUAL_PAN.toLowerCase()}  `);
  assert.equal(result.valid, true);
  assert.equal(result.pan, VALID_INDIVIDUAL_PAN);
});

test('parsePan rejects wrong length', () => {
  assert.equal(parsePan('AAAPL123C').valid, false);
  assert.equal(parsePan('AAAPL12345C').valid, false);
});

test('parsePan rejects an unknown holder-category code', () => {
  // 4th char 'D' is not a valid PAN entity-type code.
  assert.equal(parsePan('AAADL1234C').valid, false);
});

test('parsePan rejects digits in the letter positions', () => {
  assert.equal(parsePan('1AAPL1234C').valid, false);
});

test('isValidPan returns a plain boolean', () => {
  assert.equal(isValidPan(VALID_INDIVIDUAL_PAN), true);
  assert.equal(isValidPan('not-a-pan'), false);
});

test('isValidPan cross-checks holderName against the 5th character', () => {
  assert.equal(isValidPan(VALID_INDIVIDUAL_PAN, { holderName: 'Lakshmi' }), true);
  assert.equal(isValidPan(VALID_INDIVIDUAL_PAN, { holderName: 'Kumar' }), false);
});
