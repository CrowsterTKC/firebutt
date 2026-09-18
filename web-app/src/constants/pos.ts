export const partOfSpeechV1: PartOfSpeech = {
  CC: {
    description: 'Coordinating conjunction',
    examples: ['and', 'but', 'or', 'nor', 'for', 'so', 'yet'],
  },
  CD: {
    description: 'Cardinal number',
    examples: ['one', 'two', 'three'],
  },
  DT: {
    description: 'Determiner',
    examples: ['the', 'some', 'a', 'an'],
  },
  EX: {
    description: 'Existential there',
    examples: ['there'],
  },
  FW: {
    description: 'Foreign word',
    examples: ['coup', 'déjà vu'],
  },
  IN: {
    description: 'Preposition or subordinating conjunction',
    examples: ['in', 'of', 'about', 'at', 'for', 'with', 'on', 'as'],
  },
  JJ: {
    description: 'Adjective',
    examples: ['big', 'small', 'happy', 'sad'],
  },
  JJR: {
    description: 'Adjective, comparative',
    examples: ['bigger', 'smaller', 'happier', 'sadder'],
  },
  JJS: {
    description: 'Adjective, superlative',
    examples: ['biggest', 'smallest', 'happiest', 'saddest'],
  },
  LS: {
    description: 'List item marker',
    examples: ['1.', '2.', '3.'],
  },
  MD: {
    description: 'Modal',
    examples: [
      'can',
      'could',
      'may',
      'might',
      'must',
      'shall',
      'should',
      'will',
      'would',
    ],
  },
  NN: {
    description: 'Noun, singular or mass',
    examples: ['dog', 'cat', 'car', 'house'],
  },
  NNP: {
    description: 'Proper noun, singular',
    examples: ['John', 'Mary', 'London', 'Paris'],
  },
  NNPS: {
    description: 'Proper noun, plural',
    examples: ['Johns', 'Marys', 'Londons', 'Parises'],
  },
  NNS: {
    description: 'Noun, plural',
    examples: ['dogs', 'cats', 'cars', 'houses'],
  },
  POS: {
    description: 'Possessive ending',
    examples: ["'s", "'"],
  },
  PDT: {
    description: 'Predeterminer',
    examples: ['all', 'both', 'half'],
  },
  PP$: {
    description: 'Possessive pronoun',
    examples: ['my', 'your', 'his', 'her', 'its', 'our', 'their'],
  },
  PRP: {
    description: 'Personal pronoun',
    examples: ['I', 'you', 'he', 'she', 'it', 'we', 'they'],
  },
  RB: {
    description: 'Adverb',
    examples: ['quickly', 'slowly', 'happily', 'sadly'],
  },
  RBR: {
    description: 'Adverb, comparative',
    examples: ['more quickly', 'less quickly'],
  },
  RBS: {
    description: 'Adverb, superlative',
    examples: ['most quickly', 'least quickly'],
  },
  RP: {
    description: 'Particle',
    examples: ['up', 'down', 'in', 'out'],
  },
  SYM: {
    description: 'Symbol',
    examples: ['$', '%', '&', '@'],
  },
  TO: {
    description: 'to',
    examples: ['to'],
  },
  UH: {
    description: 'Interjection',
    examples: ['oh', 'ah', 'wow'],
  },
  VB: {
    description: 'Verb, base form',
    examples: ['run', 'eat', 'sleep'],
  },
  VBD: {
    description: 'Verb, past tense',
    examples: ['ran', 'ate', 'slept'],
  },
  VBG: {
    description: 'Verb, gerund or present participle',
    examples: ['running', 'eating', 'sleeping'],
  },
  VBN: {
    description: 'Verb, past participle',
    examples: ['run', 'eaten', 'slept'],
  },
  VBP: {
    description: 'Verb, non-3rd person singular present',
    examples: ['run', 'eat', 'sleep'],
  },
  VBZ: {
    description: 'Verb, 3rd person singular present',
    examples: ['runs', 'eats', 'sleeps'],
  },
  WDT: {
    description: 'Wh-determiner',
    examples: ['which', 'that'],
  },
  WP: {
    description: 'Wh-pronoun',
    examples: ['who', 'what'],
  },
  WP$: {
    description: 'Possessive wh-pronoun',
    examples: ['whose'],
  },
  WRB: {
    description: 'Wh-abverb',
    examples: ['where', 'when', 'why'],
  },
  ',': {
    description: 'Comma',
    examples: [','],
  },
  '.': {
    description: 'Sentence-final punctuation',
    examples: ['.', '!', '?'],
  },
  ':': {
    description: 'Mid-sentence punctuation',
    examples: [':', ';', '...'],
  },
  $: {
    description: 'Dollar sign',
    examples: ['$'],
  },
  '#': {
    description: 'Number sign',
    examples: ['#'],
  },
  '"': {
    description: 'Quotation marks',
    examples: ['"', "'"],
  },
  '(': {
    description: 'Left parenthesis',
    examples: ['('],
  },
  ')': {
    description: 'Right parenthesis',
    examples: [')'],
  },
};

export const partOfSpeechV2: PartOfSpeech = {
  ADJ: {
    description: 'Adjective',
    examples: ['happy', 'large', 'red', 'quiet', 'interesting'],
  },
  ADP: {
    description: 'Adposition, such as a preposition',
    examples: ['in', 'on', 'at', 'over', 'through'],
  },
  ADV: {
    description: 'Adverb',
    examples: ['very', 'quickly', 'soon', 'carefully', 'quietly'],
  },
  AUX: {
    description: 'Auxiliary verb',
    examples: ['is', 'am', 'are', 'do', 'should', 'must', 'will'],
  },
  CCONJ: {
    description: 'Coordinating conjunction',
    examples: ['and', 'or', 'but'],
  },
  DET: {
    description: 'Determiner',
    examples: ['the', 'a', 'an', 'this', 'that', 'my', 'some'],
  },
  INTJ: {
    description: 'Interjection',
    examples: ['wow', 'oh', 'hey', 'ouch', 'alas'],
  },
  NOUN: {
    description: 'Common noun',
    examples: ['house', 'table', 'dog', 'computer', 'book'],
  },
  NUM: {
    description: 'Numeral',
    examples: ['one', 'five', '20', '100', '3.14'],
  },
  PART: {
    description: 'Particle',
    examples: ['not', "n't", "'s"],
  },
  PRON: {
    description: 'Pronoun',
    examples: ['I', 'you', 'he', 'she', 'they', 'who', 'myself'],
  },
  PROPN: {
    description: 'Proper noun',
    examples: ['London', 'Chicago', 'Maria', 'Google', 'Monday'],
  },
  PUNCT: {
    description: 'Punctuation',
    examples: ['.', ',', '!', '?', ':', ';'],
  },
  SCONJ: {
    description: 'Subordinating conjunction',
    examples: ['because', 'if', 'while', 'since', 'although'],
  },
  SYM: {
    description: 'Symbol',
    examples: ['$', '+', '=', '%', '😝', '🌎'],
  },
  VERB: {
    description: 'Verb',
    examples: ['run', 'sing', 'develop', 'write', 'build'],
  },
  X: {
    description:
      'Other token that cannot be assigned a standard part-of-speech tag',
    examples: ['unknown token', 'foreign expression'],
  },
  SPACE: {
    description:
      'Whitespace such as a newline, tab, carriage return, or combination of whitespace characters',
    examples: ['\\n', '\\t', '\\r', '\\r\\n'],
  },
};
