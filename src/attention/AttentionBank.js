import PriorityQueue from 'priority-queue-typescript';
import { AttentionValue } from './AttentionValue.js';
import { Atom } from '../atoms/Atom.js';

/**
 * AttentionBank class
 * Manages attention allocation for the AtomSpace
 */
export class AttentionBank {
  constructor(atomspace) {
    this.atomspace = atomspace;
    this.attentionalFocus = new PriorityQueue(
      (a, b) => b.getAttentionValue().getSTI() - a.getAttentionValue().getSTI()
    );
    this.focusThreshold = AttentionValue.NOTICEABLE;
    
    // System parameters
    this.attentionDecay = 0.05; // Rate of decay for STI
    this.forgettingThreshold = AttentionValue.DISPOSABLE;
    this.maxSTI = AttentionValue.MAXIMUM;
    this.minSTI = -AttentionValue.MAXIMUM;
    
    // Totals for normalization
    this.totalSTI = 0;
    this.totalLTI = 0;
  }
  
  /**
   * Update the attentional focus queue with atoms above threshold
   */
  updateAttentionalFocus() {
    // Clear the current focus
    this.attentionalFocus = new PriorityQueue(
      (a, b) => b.getAttentionValue().getSTI() - a.getAttentionValue().getSTI()
    );
    
    // Add atoms with STI above threshold to the focus
    const atoms = this.atomspace.getAtoms();
    for (const atom of atoms) {
      if (atom.getAttentionValue().getSTI() >= this.focusThreshold) {
        this.attentionalFocus.enqueue(atom);
      }
    }
  }
  
  /**
   * Get atoms in the attentional focus
   * @returns {Array<Atom>} Atoms in attentional focus
   */
  getAttentionalFocus() {
    return this.attentionalFocus.toArray();
  }
  
  /**
   * Set the attention value of an atom
   * @param {Atom} atom - The atom to update
   * @param {AttentionValue} av - The new attention value
   */
  setAttentionValue(atom, av) {
    // Update the totals
    const oldAV = atom.getAttentionValue();
    this.totalSTI += av.getSTI() - oldAV.getSTI();
    this.totalLTI += av.getLTI() - oldAV.getLTI();
    
    // Set the new attention value
    atom.setAttentionValue(av);
    
    // Update the attentional focus if needed
    if (av.getSTI() >= this.focusThreshold || oldAV.getSTI() >= this.focusThreshold) {
      this.updateAttentionalFocus();
    }
  }
  
  /**
   * Stimulate an atom, increasing its STI
   * @param {Atom} atom - Atom to stimulate
   * @param {number} amount - Amount of stimulation
   */
  stimulateAtom(atom, amount) {
    const av = atom.getAttentionValue();
    const newAV = new AttentionValue(
      Math.min(av.getSTI() + amount, this.maxSTI),
      av.getLTI(),
      av.getVLTI()
    );
    this.setAttentionValue(atom, newAV);
  }
  
  /**
   * Perform attention allocation and decay
   * Called periodically to update the attention of all atoms
   */
  updateAttention() {
    const atoms = this.atomspace.getAtoms();
    
    // Decay all atoms' STI values
    for (const atom of atoms) {
      const av = atom.getAttentionValue();
      if (av.getSTI() !== 0) {
        const decayAmount = Math.abs(av.getSTI()) * this.attentionDecay;
        const newSTI = av.getSTI() > 0 ? 
          Math.max(0, av.getSTI() - decayAmount) : 
          Math.min(0, av.getSTI() + decayAmount);
        
        this.setAttentionValue(atom, new AttentionValue(
          newSTI,
          av.getLTI(),
          av.getVLTI()
        ));
      }
    }
    
    // Update attentional focus
    this.updateAttentionalFocus();
  }
  
  /**
   * Identify atoms that can be forgotten (removed from memory)
   * @returns {Array<Atom>} Atoms that can be forgotten
   */
  getForgettableAtoms() {
    return this.atomspace.getAtoms().filter(atom => 
      atom.getAttentionValue().isDisposable()
    );
  }
  
  /**
   * Spread activation from atoms in the attentional focus
   * This is a key mechanism of ECAN
   */
  spreadActivation() {
    const focusAtoms = this.getAttentionalFocus();
    
    for (const sourceAtom of focusAtoms) {
      if (!sourceAtom.getAttentionValue().isSpreadable()) continue;
      
      // Calculate amount to spread based on source atom's STI
      const sourceSTI = sourceAtom.getAttentionValue().getSTI();
      const spreadAmount = sourceSTI * 0.2; // Spread 20% of STI
      
      // Get linked atoms
      const targetAtoms = new Set();
      
      // If it's a link, add its outgoing set
      if (sourceAtom.getOutgoingSet) {
        sourceAtom.getOutgoingSet().forEach(atom => targetAtoms.add(atom));
      }
      
      // Add atoms from incoming set
      sourceAtom.getIncomingSet().forEach(link => {
        targetAtoms.add(link);
        if (link.getOutgoingSet) {
          link.getOutgoingSet().forEach(atom => {
            if (atom !== sourceAtom) targetAtoms.add(atom);
          });
        }
      });
      
      // Spread activation to target atoms
      const spreadPerAtom = spreadAmount / targetAtoms.size;
      targetAtoms.forEach(atom => {
        this.stimulateAtom(atom, spreadPerAtom);
      });
    }
  }
}