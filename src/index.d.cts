export interface ParsedPan {
  valid: boolean;
  pan?: string;
  entityTypeCode?: string;
  entityType?: string;
  holderInitial?: string;
  sequenceNumber?: string;
  checkDigit?: string;
}

export interface IsValidPanOptions {
  /** If provided, the first letter is checked against the PAN's 5th character. */
  holderName?: string;
}

/**
 * Validates a PAN's structure (format + holder-category code). The 10th
 * check character uses an unpublished government algorithm and cannot be
 * verified offline - only its presence as a letter is checked.
 */
export function isValidPan(input: string, options?: IsValidPanOptions): boolean;

/**
 * Parses a PAN into its structural components.
 */
export function parsePan(input: string): ParsedPan;
