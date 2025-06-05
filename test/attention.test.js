import { describe, it, expect, beforeEach } from 'vitest';
import { 
  AtomSpace, ConceptNode, OrderedLink, EvaluationLink,
  AttentionValue, AttentionBank, ECAN 
} from '../src/index.js';

describe('Attention System', () => {
  let atomspace;
  let alice, bob, person;

  beforeEach(() => {
    atomspace = new AtomSpace();
    alice = atomspace.addAtom(new ConceptNode("Alice"));
    bob = atomspace.addAtom(new ConceptNode("Bob"));
    person = atomspace.addAtom(new ConceptNode("Person"));
  });

  it('should create atoms with default attention values', () => {
    const av = alice.getAttentionValue();
    expect(av.getSTI()).toBe(AttentionValue.DEFAULT_STI);
    expect(av.getLTI()).toBe(AttentionValue.DEFAULT_LTI);
    expect(av.getVLTI()).toBe(AttentionValue.DEFAULT_VLTI);
  });

  it('should update attention values', () => {
    const newAV = new AttentionValue(100, 50, true);
    alice.setAttentionValue(newAV);
    
    expect(alice.getAttentionValue().getSTI()).toBe(100);
    expect(alice.getAttentionValue().getLTI()).toBe(50);
    expect(alice.getAttentionValue().getVLTI()).toBe(true);
  });

  it('should stimulate atom attention', () => {
    const initialSTI = alice.getAttentionValue().getSTI();
    atomspace.stimulateAtom(alice, 50);
    
    expect(alice.getAttentionValue().getSTI()).toBe(initialSTI + 50);
  });

  it('should identify atoms in attentional focus', () => {
    // Initially no atoms in attentional focus
    expect(atomspace.getAttentionalFocus().length).toBe(0);
    
    // Stimulate Alice above the focus threshold
    atomspace.stimulateAtom(alice, AttentionValue.NOTICEABLE + 10);
    
    // Now Alice should be in the attentional focus
    const focusAtoms = atomspace.getAttentionalFocus();
    expect(focusAtoms.length).toBe(1);
    expect(focusAtoms[0]).toBe(alice);
  });

  it('should identify disposable atoms', () => {
    // Make Alice's attention very low
    alice.setAttentionValue(new AttentionValue(AttentionValue.DISPOSABLE - 10, 0, false));
    
    // Alice should be disposable
    expect(alice.getAttentionValue().isDisposable()).toBe(true);
    
    // But not if VLTI is true
    alice.setAttentionValue(new AttentionValue(AttentionValue.DISPOSABLE - 10, 0, true));
    expect(alice.getAttentionValue().isDisposable()).toBe(false);
  });

  it('should decay attention over time', () => {
    // Set high STI for Alice
    alice.setAttentionValue(new AttentionValue(100, 0, false));
    
    // Manually run an attention update cycle
    atomspace.getAttentionBank().updateAttention();
    
    // STI should decay
    expect(alice.getAttentionValue().getSTI()).toBeLessThan(100);
  });

  it('should spread activation between connected atoms', () => {
    // Create a relationship between Alice and Bob
    const friendship = new ConceptNode("Friendship");
    atomspace.addAtom(friendship);
    
    const listLink = new OrderedLink("ListLink", [alice, bob]);
    atomspace.addAtom(listLink);
    
    const evalLink = new EvaluationLink(friendship, listLink);
    atomspace.addAtom(evalLink);
    
    // Give Alice high attention
    alice.setAttentionValue(new AttentionValue(100, 0, false));
    
    // Spread activation
    atomspace.getAttentionBank().spreadActivation();
    
    // Bob and the links should get some activation
    expect(bob.getAttentionValue().getSTI()).toBeGreaterThan(0);
    expect(listLink.getAttentionValue().getSTI()).toBeGreaterThan(0);
    expect(evalLink.getAttentionValue().getSTI()).toBeGreaterThan(0);
  });
});