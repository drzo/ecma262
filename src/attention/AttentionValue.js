/**
 * AttentionValue class
 * Represents the attention value of an atom in the AtomSpace
 * Based on OpenCog's ECAN (Economic Attention Allocation)
 */
export class AttentionValue {
  // Default starting values
  static DEFAULT_STI = 0;
  static DEFAULT_LTI = 0;
  static DEFAULT_VLTI = false;
  
  // AttentionValue boundaries
  static DISPOSABLE = -80;
  static NONDISPOSABLE = -20;
  static NORMAL = 0;
  static NOTICEABLE = 50;
  static HIGH = 80;
  static VERY_HIGH = 100;
  static MAXIMUM = 300;
  
  /**
   * Create a new AttentionValue
   * @param {number} sti - Short-Term Importance
   * @param {number} lti - Long-Term Importance
   * @param {boolean} vlti - Very Long-Term Importance (flag)
   */
  constructor(
    sti = AttentionValue.DEFAULT_STI, 
    lti = AttentionValue.DEFAULT_LTI, 
    vlti = AttentionValue.DEFAULT_VLTI
  ) {
    this.sti = sti;
    this.lti = lti;
    this.vlti = vlti;
  }
  
  /**
   * Get the Short-Term Importance (STI)
   * @returns {number} STI value
   */
  getSTI() {
    return this.sti;
  }
  
  /**
   * Get the Long-Term Importance (LTI)
   * @returns {number} LTI value
   */
  getLTI() {
    return this.lti;
  }
  
  /**
   * Get the Very Long-Term Importance (VLTI) flag
   * @returns {boolean} VLTI flag
   */
  getVLTI() {
    return this.vlti;
  }
  
  /**
   * Set the Short-Term Importance (STI)
   * @param {number} sti - New STI value
   */
  setSTI(sti) {
    this.sti = sti;
  }
  
  /**
   * Set the Long-Term Importance (LTI)
   * @param {number} lti - New LTI value
   */
  setLTI(lti) {
    this.lti = lti;
  }
  
  /**
   * Set the Very Long-Term Importance (VLTI) flag
   * @param {boolean} vlti - New VLTI flag
   */
  setVLTI(vlti) {
    this.vlti = vlti;
  }
  
  /**
   * Change the STI value by a given amount
   * @param {number} amount - Amount to change STI by
   */
  decaySTI(amount) {
    this.sti -= amount;
  }
  
  /**
   * Change the LTI value by a given amount
   * @param {number} amount - Amount to change LTI by
   */
  decayLTI(amount) {
    this.lti -= amount;
  }
  
  /**
   * Create a string representation of the attention value
   * @returns {string} String representation
   */
  toString() {
    return `AV(sti: ${this.sti}, lti: ${this.lti}, vlti: ${this.vlti})`;
  }
  
  /**
   * Check if the atom is above the threshold for spreading activation
   * @returns {boolean} True if the atom should spread activation
   */
  isSpreadable() {
    return this.sti > AttentionValue.NOTICEABLE;
  }
  
  /**
   * Check if the atom is disposable (can be forgotten)
   * @returns {boolean} True if the atom is disposable
   */
  isDisposable() {
    return !this.vlti && this.sti < AttentionValue.DISPOSABLE;
  }
}