// Structure per NSDL/Income Tax Dept spec: AAAAA9999A
// 1-3: alphabetic series, 4: holder category, 5: first letter of surname/name,
// 6-9: sequence number, 10: check character (unpublished algorithm, format-only here).
const PAN_PATTERN = /^([A-Z]{3})([ABCFGHLJPT])([A-Z])(\d{4})([A-Z])$/;

const ENTITY_TYPES = {
  A: 'Association of Persons (AOP)',
  B: 'Body of Individuals (BOI)',
  C: 'Company',
  F: 'Firm / LLP',
  G: 'Government',
  H: 'Hindu Undivided Family (HUF)',
  J: 'Artificial Juridical Person',
  L: 'Local Authority',
  P: 'Individual',
  T: 'Trust',
};

function normalize(input) {
  return typeof input === 'string' ? input.trim().toUpperCase() : '';
}

/**
 * Parses a PAN into its structural components.
 * @param {string} input
 * @returns {{
 *   valid: boolean,
 *   pan?: string,
 *   entityTypeCode?: string,
 *   entityType?: string,
 *   holderInitial?: string,
 *   sequenceNumber?: string,
 *   checkDigit?: string,
 * }}
 */
function parsePan(input) {
  const pan = normalize(input);
  const match = PAN_PATTERN.exec(pan);

  if (!match) {
    return { valid: false };
  }

  const [, , entityTypeCode, holderInitial, sequenceNumber, checkDigit] = match;

  return {
    valid: true,
    pan,
    entityTypeCode,
    entityType: ENTITY_TYPES[entityTypeCode],
    holderInitial,
    sequenceNumber,
    checkDigit,
  };
}

/**
 * Validates a PAN's structure (format + holder-category code). The 10th
 * check character uses an unpublished government algorithm and cannot be
 * verified offline - only its presence as a letter is checked.
 * @param {string} input
 * @param {{ holderName?: string }} [options] - If provided, `holderName`'s
 *   first letter is checked against the PAN's 5th character.
 * @returns {boolean}
 */
function isValidPan(input, options = {}) {
  const parsed = parsePan(input);

  if (!parsed.valid) {
    return false;
  }

  if (options.holderName) {
    const expectedInitial = options.holderName.trim().charAt(0).toUpperCase();
    if (expectedInitial !== parsed.holderInitial) {
      return false;
    }
  }

  return true;
}

module.exports = { isValidPan, parsePan };
