import { Link } from './Link.js';

/**
 * OrderedLink class for AtomSpace
 * OrderedLinks maintain order of outgoing set
 */
export class OrderedLink extends Link {
  /**
   * Create a new OrderedLink
   * @param {string} type - Type of the link
   * @param {Array<Atom>} outgoingSet - Atoms that this link connects
   * @param {Object} truthValue - Truth value (strength, confidence)
   */
  constructor(type, outgoingSet, truthValue) {
    super(type, outgoingSet, truthValue);
  }
  
  /**
   * Check if this link equals another link
   * OrderedLinks are equal if they have same type and same ordered outgoing set
   * @param {OrderedLink} other - Link to compare with
   * @returns {boolean} True if links are equal
   */
  equals(other) {
    if (!(other instanceof OrderedLink)) return false;
    if (this.type !== other.type) return false;
    if (this.outgoingSet.length !== other.outgoingSet.length) return false;
    
    // Check if outgoing sets contain the same atoms in the same order
    for (let i = 0; i < this.outgoingSet.length; i++) {
      if (!this.outgoingSet[i].equals(other.outgoingSet[i])) {
        return false;
      }
    }
    
    return true;
  }
}