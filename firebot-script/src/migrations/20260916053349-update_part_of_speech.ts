import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePartOfSpeech1789562029310 implements MigrationInterface {
  get name() {
    return 'UpdatePartOfSpeech1789562029310';
  }

  async up(queryRunner: QueryRunner): Promise<void> {
    const posJsToWinkPos: Record<string, string> = {
      // Coordinating conjunction
      CC: 'CCONJ',

      // Cardinal number
      CD: 'NUM',

      // Determiners
      DT: 'DET',
      PDT: 'DET',
      WDT: 'DET',

      // Existential there
      EX: 'PRON',

      // Foreign word
      FW: 'X',

      // Preposition / subordinating conjunction
      IN: 'ADP',

      // Adjectives
      JJ: 'ADJ',
      JJR: 'ADJ',
      JJS: 'ADJ',

      // List item marker
      LS: 'X',

      // Modal
      MD: 'AUX',

      // Nouns
      NN: 'NOUN',
      NNS: 'NOUN',

      // Proper nouns
      NNP: 'PROPN',
      NNPS: 'PROPN',

      // Predeterminer / possessive ending
      POS: 'PART',

      // Pronouns
      PRP: 'PRON',
      PRP$: 'PRON',
      WP: 'PRON',
      WP$: 'PRON',

      // Adverbs
      RB: 'ADV',
      RBR: 'ADV',
      RBS: 'ADV',
      WRB: 'ADV',

      // Particle
      RP: 'PART',

      // Symbol
      SYM: 'SYM',

      // "to"
      TO: 'PART',

      // Interjection
      UH: 'INTJ',

      // Verbs
      VB: 'VERB',
      VBD: 'VERB',
      VBG: 'VERB',
      VBN: 'VERB',
      VBP: 'VERB',
      VBZ: 'VERB',

      // Punctuation
      '.': 'PUNCT',
      ',': 'PUNCT',
      ':': 'PUNCT',
      '(': 'PUNCT',
      ')': 'PUNCT',
      '``': 'PUNCT',
      "''": 'PUNCT',
      '#': 'SYM',
      $: 'SYM',
    };

    const entries = Object.entries(posJsToWinkPos);

    const caseStatements = entries.map(() => 'WHEN ? THEN ?').join('\n');

    const parameters = entries.flatMap(([jsPos, winkPos]) => [jsPos, winkPos]);

    await queryRunner.query(
      `
      UPDATE phrases
      SET
        metadata = json_set(
          COALESCE(metadata, '{}'),
          '$.original_part_of_speech',
          part_of_speech
        ),
        part_of_speech = CASE part_of_speech
          ${caseStatements}
          ELSE part_of_speech
        END
      `,
      parameters
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE phrases
      SET
        part_of_speech = json_extract(
          metadata,
          '$.original_part_of_speech'
        ),
        metadata = json_remove(
          metadata,
          '$.original_part_of_speech'
        )
      WHERE json_type(
        metadata,
        '$.original_part_of_speech'
      ) IS NOT NULL
    `);
  }
}
