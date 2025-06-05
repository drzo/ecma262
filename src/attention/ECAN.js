import { AttentionValue } from './AttentionValue.js';

/**
 * ECAN (Economic Attention Allocation) class
 * Implements the economic attention allocation mechanisms
 * from OpenCog for managing cognitive resources
 */
export class ECAN {
  constructor(attentionBank) {
    this.attentionBank = attentionBank;
    
    // ECAN parameters
    this.decayPercentage = 0.05;
    this.targetAtoms = 1000;
    this.maxSpreadPercentage = 0.5;
    this.updateInterval = 100; // ms
    
    // Timing variables
    this.lastUpdate = Date.now();
    this.isRunning = false;
  }
  
  /**
   * Start the ECAN agent
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.run();
  }
  
  /**
   * Stop the ECAN agent
   */
  stop() {
    this.isRunning = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
  
  /**
   * Run a single ECAN cycle
   */
  run() {
    if (!this.isRunning) return;
    
    const now = Date.now();
    const elapsed = now - this.lastUpdate;
    this.lastUpdate = now;
    
    // Perform attention allocation
    this.decayAttention();
    this.spreadAttention();
    this.forgetAtoms();
    
    // Schedule next update
    this.timeoutId = setTimeout(() => this.run(), this.updateInterval);
  }
  
  /**
   * Decay attention values for all atoms
   */
  decayAttention() {
    this.attentionBank.updateAttention();
  }
  
  /**
   * Spread activation from high-STI atoms to their neighbors
   */
  spreadAttention() {
    this.attentionBank.spreadActivation();
  }
  
  /**
   * Forget (remove) atoms with low attention values
   */
  forgetAtoms() {
    const atomspace = this.attentionBank.atomspace;
    const forgettableAtoms = this.attentionBank.getForgettableAtoms();
    
    // Forget up to 5% of forgettable atoms each cycle
    const forgetCount = Math.ceil(forgettableAtoms.length * 0.05);
    
    // Sort by STI, forget the lowest ones
    forgettableAtoms.sort((a, b) => 
      a.getAttentionValue().getSTI() - b.getAttentionValue().getSTI()
    );
    
    for (let i = 0; i < forgetCount && i < forgettableAtoms.length; i++) {
      atomspace.removeAtom(forgettableAtoms[i]);
    }
  }
  
  /**
   * Set the decay percentage for attention values
   * @param {number} percentage - Decay percentage (0.0 to 1.0)
   */
  setDecayPercentage(percentage) {
    if (percentage < 0 || percentage > 1) {
      throw new Error('Decay percentage must be between 0 and 1');
    }
    this.decayPercentage = percentage;
    this.attentionBank.attentionDecay = percentage;
  }
  
  /**
   * Set the maximum percentage of STI that can be spread in one cycle
   * @param {number} percentage - Maximum spread percentage (0.0 to 1.0)
   */
  setMaxSpreadPercentage(percentage) {
    if (percentage < 0 || percentage > 1) {
      throw new Error('Max spread percentage must be between 0 and 1');
    }
    this.maxSpreadPercentage = percentage;
  }
  
  /**
   * Set the update interval for ECAN cycles
   * @param {number} interval - Update interval in milliseconds
   */
  setUpdateInterval(interval) {
    if (interval < 10) {
      throw new Error('Update interval must be at least 10ms');
    }
    this.updateInterval = interval;
  }
}