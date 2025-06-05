import { Atom } from './atoms/Atom.js';
import { Node } from './atoms/Node.js';
import { Link } from './atoms/Link.js';

/**
 * AtomSpace class
 * AtomSpace is a hypergraph database for representing knowledge
 */
export class AtomSpace {
  constructor() {
    // Atoms indexed by ID for quick lookup
    this.atomsById = new Map();
    
    // Nodes indexed by type and name for quick lookup
    this.nodesByTypeAndName = new Map();
    
    // Links indexed by type for quick lookup
    this.linksByType = new Map();
  }
  
  /**
   * Add an atom to the AtomSpace
   * @param {Atom} atom - Atom to add
   * @returns {Atom} The atom that was added (or existing equivalent)
   */
  addAtom(atom) {
    if (!(atom instanceof Atom)) {
      throw new Error('Can only add atoms to AtomSpace');
    }
    
    // If atom is a Node, check if it already exists
    if (atom instanceof Node) {
      const existingNode = this.getNode(atom.getType(), atom.getName());
      if (existingNode) {
        return existingNode;
      }
      
      // Add to nodesByTypeAndName index
      const typeMap = this.nodesByTypeAndName.get(atom.getType()) || new Map();
      typeMap.set(atom.getName(), atom);
      this.nodesByTypeAndName.set(atom.getType(), typeMap);
    }
    
    // If atom is a Link, check if it already exists
    if (atom instanceof Link) {
      const existingLink = this.findLink(atom);
      if (existingLink) {
        return existingLink;
      }
      
      // Add to linksByType index
      const typeSet = this.linksByType.get(atom.getType()) || new Set();
      typeSet.add(atom);
      this.linksByType.set(atom.getType(), typeSet);
    }
    
    // Add to main index
    this.atomsById.set(atom.getId(), atom);
    
    return atom;
  }
  
  /**
   * Find an existing link that equals the given link
   * @param {Link} link - Link to find
   * @returns {Link|null} Existing link or null
   */
  findLink(link) {
    const typeSet = this.linksByType.get(link.getType());
    if (!typeSet) return null;
    
    for (const existingLink of typeSet) {
      if (link.equals(existingLink)) {
        return existingLink;
      }
    }
    
    return null;
  }
  
  /**
   * Get an atom by ID
   * @param {string} id - ID of the atom
   * @returns {Atom|undefined} Atom with the given ID
   */
  getAtom(id) {
    return this.atomsById.get(id);
  }
  
  /**
   * Get a node by type and name
   * @param {string} type - Type of the node
   * @param {string} name - Name of the node
   * @returns {Node|undefined} Node with the given type and name
   */
  getNode(type, name) {
    const typeMap = this.nodesByTypeAndName.get(type);
    if (!typeMap) return undefined;
    return typeMap.get(name);
  }
  
  /**
   * Get all atoms in the AtomSpace
   * @returns {Array<Atom>} All atoms
   */
  getAtoms() {
    return Array.from(this.atomsById.values());
  }
  
  /**
   * Get all nodes in the AtomSpace
   * @returns {Array<Node>} All nodes
   */
  getNodes() {
    return this.getAtoms().filter(atom => atom instanceof Node);
  }
  
  /**
   * Get all links in the AtomSpace
   * @returns {Array<Link>} All links
   */
  getLinks() {
    return this.getAtoms().filter(atom => atom instanceof Link);
  }
  
  /**
   * Get all atoms of a given type
   * @param {string} type - Type of atoms to get
   * @returns {Array<Atom>} Atoms of the given type
   */
  getAtomsByType(type) {
    // Check for nodes of this type
    const nodes = [];
    const typeMap = this.nodesByTypeAndName.get(type);
    if (typeMap) {
      nodes.push(...typeMap.values());
    }
    
    // Check for links of this type
    const links = [];
    const typeSet = this.linksByType.get(type);
    if (typeSet) {
      links.push(...typeSet);
    }
    
    return [...nodes, ...links];
  }
  
  /**
   * Remove an atom from the AtomSpace
   * @param {Atom|string} atomOrId - Atom or ID of atom to remove
   * @returns {boolean} True if atom was removed
   */
  removeAtom(atomOrId) {
    const atom = atomOrId instanceof Atom ? atomOrId : this.getAtom(atomOrId);
    
    if (!atom) return false;
    
    // Remove from main index
    this.atomsById.delete(atom.getId());
    
    // Remove from type-specific indexes
    if (atom instanceof Node) {
      const typeMap = this.nodesByTypeAndName.get(atom.getType());
      if (typeMap) {
        typeMap.delete(atom.getName());
        if (typeMap.size === 0) {
          this.nodesByTypeAndName.delete(atom.getType());
        }
      }
    } else if (atom instanceof Link) {
      const typeSet = this.linksByType.get(atom.getType());
      if (typeSet) {
        typeSet.delete(atom);
        if (typeSet.size === 0) {
          this.linksByType.delete(atom.getType());
        }
      }
    }
    
    return true;
  }
  
  /**
   * Clear the AtomSpace
   */
  clear() {
    this.atomsById.clear();
    this.nodesByTypeAndName.clear();
    this.linksByType.clear();
  }
  
  /**
   * Get the size of the AtomSpace
   * @returns {number} Number of atoms in the AtomSpace
   */
  size() {
    return this.atomsById.size;
  }
}