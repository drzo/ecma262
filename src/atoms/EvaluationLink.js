import { OrderedLink } from './OrderedLink.js';

/**
 * EvaluationLink class for AtomSpace
 * EvaluationLinks represent relationships or predicates
 */
export class EvaluationLink extends OrderedLink {
  /**
   * Create a new EvaluationLink
   * @param {Atom} predicate - Predicate atom (usually a Node)
   * @param {Link} arguments - Link containing arguments
   * @param {Object} truthValue - Truth value (strength, confidence)
   */
  constructor(predicate, argumentLink, truthValue) {
    super('EvaluationLink', [predicate, argumentLink], truthValue);
  }
  
  /**
   * Get the predicate of this evaluation link
   * @returns {Atom} Predicate atom
   */
  getPredicate() {
    return this.getAtom(0);
  }
  
  /**
   * Get the argument link of this evaluation link
   * @returns {Link} Argument link
   */
  getArguments() {
    return this.getAtom(1);
  }
}