import { Atom } from './Atom.js';

/**
 * Node class for AtomSpace
 * Nodes are atoms that represent concepts or entities
 */
export class Node extends Atom {
  /**
   * Create a new Node
   * @param {string} type - Type of the node
   * @param {string} name - Name of the node
   * @param {Object} truthValue - Truth value (strength, confidence)
   */
  constructor(type, name, truthValue) {
    super(type, truthValue);
    this.name = name;
  }
  
  /**
   * Get the name of this node
   * @returns {string} Name of the node
   */
  getName() {
    return this.name;
  }
  
  /**
   * Check if this node equals another node
   * Nodes are equal if they have the same type and name
   * @param {Node} other - Node to compare with
   * @returns {boolean} True if nodes are equal
   */
  equals(other) {
    if (!(other instanceof Node)) return false;
    return this.type === other.type && this.name === other.name;
  }
  
  /**
   * String representation of the node
   * @returns {string} String representation
   */
  toString() {
    return `${this.type}("${this.name}")`;
  }
}