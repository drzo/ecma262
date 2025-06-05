# ECMAtomSpace

A JavaScript implementation of OpenCog's AtomSpace knowledge representation system, built using modern ECMAScript standards.

## Overview

ECMAtomSpace provides a JavaScript implementation of the core concepts from OpenCog's AtomSpace. It enables developers to create, manipulate, and query hypergraphs for knowledge representation and reasoning in web applications.

## Features

- **Atoms**: Base units for knowledge representation
  - **Nodes**: Represent concepts or entities
  - **Links**: Connect atoms together to form relationships
- **AtomSpace**: Hypergraph database for storing and querying atoms
- **Truth Values**: Represent uncertainty in knowledge
- **Attention System**: Economic Attention Allocation (ECAN)
  - **AttentionValues**: Multi-component importance metrics (STI, LTI, VLTI)
  - **Attention Allocation**: Automatic resource management
  - **Activation Spreading**: Activation flows through connected atoms

## Installation

```bash
npm install ecmatomspace
```

## Usage

```javascript
import { 
  AtomSpace, ConceptNode, OrderedLink, EvaluationLink,
  AttentionValue 
} from 'ecmatomspace';

// Create an AtomSpace
const atomspace = new AtomSpace();

// Create and add nodes
const person = atomspace.addAtom(new ConceptNode("Person"));
const alice = atomspace.addAtom(new ConceptNode("Alice"));

// Create and add an IsA relationship
const isA = atomspace.addAtom(new EvaluationLink(
  new ConceptNode("IsA"),
  new OrderedLink("ListLink", [alice, person])
));

// Start the ECAN attention allocation system
atomspace.startAttentionAllocation();

// Stimulate an atom (increase its attention)
atomspace.stimulateAtom(alice, 50);

// Later, get the atoms in the attentional focus
const focusAtoms = atomspace.getAttentionalFocus();
```

## Core Components

### AtomSpace

The AtomSpace is a hypergraph database that stores atoms (nodes and links) and provides methods for querying and manipulating them.

### Atoms

Atoms are the basic units of knowledge representation in AtomSpace:

- **Nodes**: Represent concepts or entities (e.g., `ConceptNode("Person")`)
- **Links**: Connect atoms together to form relationships (e.g., `EvaluationLink`)

### Truth Values

Truth values represent the degree of confidence in the truth of an atom, with components:

- **Strength**: How true the atom is (0.0 to 1.0)
- **Confidence**: How confident we are in the strength value (0.0 to 1.0)

### Attention System

The attention system manages cognitive resources and focuses computation on important atoms:

- **Attention Values**: Each atom has an attention value with components:
  - **STI** (Short-Term Importance): Rapidly changing importance value
  - **LTI** (Long-Term Importance): Slowly changing importance value
  - **VLTI** (Very Long-Term Importance): Flag to protect against forgetting

- **ECAN**: Economic Attention Allocation
  - Automatically manages attention values
  - Spreads activation between related atoms
  - Identifies disposable (forgettable) atoms

## Development

To set up the development environment:

```bash
git clone https://github.com/yourusername/ecmatomspace.git
cd ecmatomspace
npm install
npm run dev
```

## License

MIT