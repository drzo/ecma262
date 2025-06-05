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
- **Attention Values**: Manage cognitive resources

## Installation

```bash
npm install ecmatomspace
```

## Usage

```javascript
import { AtomSpace, ConceptNode, OrderedLink, EvaluationLink } from 'ecmatomspace';

// Create an AtomSpace
const atomspace = new AtomSpace();

// Create some nodes
const person = new ConceptNode("Person");
const alice = new ConceptNode("Alice");
const bob = new ConceptNode("Bob");

// Add nodes to the AtomSpace
atomspace.addAtom(person);
atomspace.addAtom(alice);
atomspace.addAtom(bob);

// Create relationships
const isA = new EvaluationLink(
  new ConceptNode("IsA"),
  new OrderedLink("ListLink", [alice, person])
);

// Add relationships to the AtomSpace
atomspace.addAtom(isA);

// Query the AtomSpace
const allPersons = atomspace.getAtomsByType("ConceptNode");
console.log(allPersons);
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