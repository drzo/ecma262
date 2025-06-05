import { describe, it, expect, beforeEach } from 'vitest';
import { AtomSpace, Atom, Node, Link, ConceptNode, OrderedLink, EvaluationLink } from '../src/index.js';

describe('AtomSpace', () => {
  let atomspace;

  beforeEach(() => {
    atomspace = new AtomSpace();
  });

  it('should create an empty AtomSpace', () => {
    expect(atomspace.size()).toBe(0);
  });

  it('should add nodes to the AtomSpace', () => {
    const node = new ConceptNode('test');
    atomspace.addAtom(node);
    expect(atomspace.size()).toBe(1);
    expect(atomspace.getNode('ConceptNode', 'test')).toBe(node);
  });

  it('should not duplicate nodes with the same type and name', () => {
    const node1 = new ConceptNode('test');
    const node2 = new ConceptNode('test');
    
    const added1 = atomspace.addAtom(node1);
    const added2 = atomspace.addAtom(node2);
    
    expect(added1).toBe(node1);
    expect(added2).toBe(node1); // Should return the first node, not add the second
    expect(atomspace.size()).toBe(1);
  });

  it('should add links to the AtomSpace', () => {
    const node1 = new ConceptNode('node1');
    const node2 = new ConceptNode('node2');
    atomspace.addAtom(node1);
    atomspace.addAtom(node2);
    
    const link = new OrderedLink('TestLink', [node1, node2]);
    atomspace.addAtom(link);
    
    expect(atomspace.size()).toBe(3);
    expect(atomspace.getAtomsByType('TestLink').length).toBe(1);
  });

  it('should not duplicate links with the same type and outgoing set', () => {
    const node1 = new ConceptNode('node1');
    const node2 = new ConceptNode('node2');
    atomspace.addAtom(node1);
    atomspace.addAtom(node2);
    
    const link1 = new OrderedLink('TestLink', [node1, node2]);
    const link2 = new OrderedLink('TestLink', [node1, node2]);
    
    atomspace.addAtom(link1);
    atomspace.addAtom(link2);
    
    expect(atomspace.size()).toBe(3); // 2 nodes + 1 link
  });

  it('should create and query an EvaluationLink', () => {
    const predicate = new ConceptNode('IsA');
    const subject = new ConceptNode('Alice');
    const object = new ConceptNode('Person');
    
    atomspace.addAtom(predicate);
    atomspace.addAtom(subject);
    atomspace.addAtom(object);
    
    const listLink = new OrderedLink('ListLink', [subject, object]);
    const evalLink = new EvaluationLink(predicate, listLink);
    
    atomspace.addAtom(listLink);
    atomspace.addAtom(evalLink);
    
    // 3 nodes + 2 links = 5 atoms
    expect(atomspace.size()).toBe(5);
    
    // Check that the incoming set of Alice contains the ListLink
    expect(subject.getIncomingSet().size).toBe(1);
    
    // Check that we can retrieve the predicate from the EvaluationLink
    const retrievedEvalLink = atomspace.getAtomsByType('EvaluationLink')[0];
    expect(retrievedEvalLink.getPredicate().getName()).toBe('IsA');
  });

  it('should remove atoms from the AtomSpace', () => {
    const node = new ConceptNode('test');
    atomspace.addAtom(node);
    expect(atomspace.size()).toBe(1);
    
    atomspace.removeAtom(node);
    expect(atomspace.size()).toBe(0);
    expect(atomspace.getNode('ConceptNode', 'test')).toBeUndefined();
  });

  it('should clear the AtomSpace', () => {
    atomspace.addAtom(new ConceptNode('node1'));
    atomspace.addAtom(new ConceptNode('node2'));
    expect(atomspace.size()).toBe(2);
    
    atomspace.clear();
    expect(atomspace.size()).toBe(0);
  });
});