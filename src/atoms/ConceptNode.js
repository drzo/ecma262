import { Node } from './Node.js';

/**
 * ConceptNode class for AtomSpace
 * ConceptNodes represent named concepts
 */
export class ConceptNode extends Node {
  /**
   * Create a new ConceptNode
   * @param {string} name - Name of the concept
   * @param {Object} truthValue - Truth value (strength, confidence)
   */
  constructor(name, truthValue) {
    super('ConceptNode', name, truthValue);
  }
}