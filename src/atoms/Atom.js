import { v4 as uuidv4 } from 'uuid';
import { AttentionValue } from '../attention/AttentionValue.js';

/**
 * Base class for all Atoms in the AtomSpace
 * Atoms are the basic units of knowledge representation in AtomSpace
 */
export class Atom {
  constructor(type, truthValue = { strength: 1.0, confidence: 0.9 }) {
    this.id = uuidv4();
    this.type = type;
    this.truthValue = truthValue;
    this.attentionValue = new AttentionValue();
    this.incomingSet = new Set();
  }
  
  /**
   * Get the ID of this atom
   * @returns {string} UUID of the atom
   */
  getId() {
    return this.id;
  }
  
  /**
   * Get the type of this atom
   * @returns {string} Type of the atom
   */
  getType() {
    return this.type;
  }
  
  /**
   * Get the truth value of this atom
   * @returns {Object} Truth value with strength and confidence
   */
  getTruthValue() {
    return { ...this.truthValue };
  }
  
  /**
   * Set the truth value of this atom
   * @param {Object} tv - Truth value with strength and confidence
   */
  setTruthValue(tv) {
    this.truthValue = { ...tv };
  }
  
  /**
   * Get the attention value of this atom
   * @returns {AttentionValue} Attention value
   */
  getAttentionValue() {
    return this.attentionValue;
  }
  
  /**
   * Set the attention value of this atom
   * @param {AttentionValue} av - Attention value
   */
  setAttentionValue(av) {
    this.attentionValue = av;
  }
  
  /**
   * Add an atom to the incoming set
   * @param {Atom} atom - Atom to add to incoming set
   */
  addToIncomingSet(atom) {
    this.incomingSet.add(atom);
  }
  
  /**
   * Get the incoming set of this atom
   * @returns {Set} Set of atoms that reference this atom
   */
  getIncomingSet() {
    return this.incomingSet;
  }
  
  /**
   * Check if this atom equals another atom
   * Base implementation compares IDs
   * @param {Atom} other - Atom to compare with
   * @returns {boolean} True if atoms are equal
   */
  equals(other) {
    if (!(other instanceof Atom)) return false;
    return this.id === other.id;
  }
  
  /**
   * String representation of the atom
   * @returns {string} String representation
   */
  toString() {
    return `Atom(${this.type}:${this.id})`;
  }
}