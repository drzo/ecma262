import { Atom } from './Atom.js';

/**
 * Link class for AtomSpace
 * Links connect atoms together
 */
export class Link extends Atom {
  /**
   * Create a new Link
   * @param {string} type - Type of the link
   * @param {Array<Atom>} outgoingSet - Atoms that this link connects
   * @param {Object} truthValue - Truth value (strength, confidence)
   */
  constructor(type, outgoingSet = [], truthValue) {
    super(type, truthValue);
    this.outgoingSet = [...outgoingSet];
    
    // Add this link to incoming set of all atoms in outgoing set
    this.outgoingSet.forEach(atom => {
      if (atom instanceof Atom) {
        atom.addToIncomingSet(this);
      }
    });
  }
  
  /**
   * Get the outgoing set of this link
   * @returns {Array<Atom>} Outgoing set
   */
  getOutgoingSet() {
    return [...this.outgoingSet];
  }
  
  /**
   * Get atom at index in outgoing set
   * @param {number} index - Index in outgoing set
   * @returns {Atom} Atom at index
   */
  getAtom(index) {
    if (index < 0 || index >= this.outgoingSet.length) {
      throw new Error(`Index ${index} out of bounds for outgoing set of size ${this.outgoingSet.length}`);
    }
    return this.outgoingSet[index];
  }
  
  /**
   * Get the arity (number of atoms in outgoing set)
   * @returns {number} Arity
   */
  getArity() {
    return this.outgoingSet.length;
  }
  
  /**
   * Check if this link equals another link
   * Links are equal if they have same type and same outgoing set
   * @param {Link} other - Link to compare with
   * @returns {boolean} True if links are equal
   */
  equals(other) {
    if (!(other instanceof Link)) return false;
    if (this.type !== other.type) return false;
    if (this.outgoingSet.length !== other.outgoingSet.length) return false;
    
    // Check if outgoing sets contain the same atoms
    for (let i = 0; i < this.outgoingSet.length; i++) {
      if (!this.outgoingSet[i].equals(other.outgoingSet[i])) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * String representation of the link
   * @returns {string} String representation
   */
  toString() {
    const outgoingStr = this.outgoingSet.map(atom => atom.toString()).join(', ');
    return `${this.type}(${outgoingStr})`;
  }
}