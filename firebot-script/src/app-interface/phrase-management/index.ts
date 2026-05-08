/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RunRequest } from '@crowbartools/firebot-custom-scripts-types';
import { AngularJsFactory } from '@crowbartools/firebot-custom-scripts-types/types/modules/ui-extension-manager';

import template from './template.page';
import { Phrase } from '../../entities/phrase';
import { Firebutt } from '../../firebutt';
import { Params } from '../../params';

type FirebuttService = {
  getPartOfSpeechText: (tag: string | null) => string;
  isLoading: boolean;
  phrases: Phrase[];
  setSelectedTab: (tabId: string) => void;
  tabIsSelected: (tabId: string) => boolean;
};

type FirebotTableHeader = {
  name: string;
  icon: string;
  dataField: string;
  sortable: boolean;
  cellTemplate: string;
  cellController: ($scope?: any) => void;
};

type PhraseManagementScope = {
  backendCommunicator: BackendCommunicator;
  firebuttService: FirebuttService;
  getPartOfSpeechText: (tag: string | null) => string;
  headers: FirebotTableHeader[];
  isLoading: boolean;
  phrases: Phrase[];
};

interface PartOfSpeech {
  [tag: string]: {
    description: string;
    examples: string[];
  };
}

export function register(
  firebutt: Firebutt,
  { modules }: Omit<RunRequest<Params>, 'trigger' | 'scriptDataDir'>
) {
  const { uiExtensionManager } = modules;

  if (uiExtensionManager) {
    uiExtensionManager.registerUIExtension({
      id: 'phrase-management-ui',
      pages: [
        {
          id: 'phrase-management-page',
          name: 'Phrase Management',
          type: 'angularjs',
          icon: 'fa-solid fa-fire',
          fullPage: true,
          template,
          controller: (
            $scope: PhraseManagementScope,
            backendCommunicator: BackendCommunicator,
            firebuttService: FirebuttService
          ) => {
            phraseManagementController(
              $scope,
              backendCommunicator,
              firebuttService
            );
          },
        },
      ],
      providers: {
        factories: [firebuttService],
      },
    });
  }
}

function firebuttServiceFunction(backendCommunicator: BackendCommunicator) {
  const service: FirebuttService = {
    getPartOfSpeechText: (_: string | null) => '',
    isLoading: true,
    phrases: [] as Phrase[],
    setSelectedTab: (_: string) => {},
    tabIsSelected: (_: string) => false,
  };

  function getPartOfSpeechText(tag: string | null) {
    const partOfSpeech: PartOfSpeech = {
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

    const tagParsed = tag ?? 'undefined';
    const { description } = partOfSpeech
      ? partOfSpeech[tagParsed]
      : { description: 'Undefined' };
    return `${description} (${tagParsed})`;
  }
  service.getPartOfSpeechText = getPartOfSpeechText;

  function loadAllPhraseData(service: FirebuttService) {
    service.isLoading = true;
    backendCommunicator
      .fireEventAsync<IpcReturn<'phrases', Phrase[]>>('firebutt:get-phrases')
      .then(({ success, phrases, error }) => {
        if (!success) {
          console.error('Failed to load phrase data:', error);
          service.phrases = [];
          service.isLoading = false;
        } else {
          service.phrases = phrases ?? [];
          service.isLoading = false;
        }
      });
  }
  loadAllPhraseData(service);

  let selectedTab = 'generalphrases';
  service.setSelectedTab = (tabId: string) => {
    selectedTab = tabId;
  };

  service.tabIsSelected = (tabId: string) => selectedTab === tabId;

  return service;
}

const firebuttService: AngularJsFactory = {
  name: 'firebuttService',
  function: (backendCommunicator: BackendCommunicator) =>
    firebuttServiceFunction(backendCommunicator),
};

function phraseManagementController(
  $scope: PhraseManagementScope,
  backendCommunicator: BackendCommunicator,
  firebuttService: FirebuttService
) {
  $scope.backendCommunicator = backendCommunicator;
  $scope.firebuttService = firebuttService;
  $scope.isLoading = firebuttService.isLoading;
  $scope.phrases = firebuttService.phrases as Phrase[];

  $scope.headers = [
    {
      name: 'ORIGINAL PHRASE(S)',
      icon: 'fa-comment',
      dataField: 'originalPhrase',
      sortable: true,
      cellTemplate: `{{formatter(data.originalPhrase)}}`,
      cellController: ($scope: any) => {
        $scope.formatter = (value: string[]) =>
          value[0].startsWith('__') && value[0].endsWith('__')
            ? ''
            : value.join(', ');
      },
    },
    {
      name: 'REPLACEMENT PHRASE',
      icon: 'fa-exchange-alt',
      dataField: 'replacementPhrase',
      sortable: true,
      cellTemplate: `{{data.replacementPhrase}}`,
      cellController: () => {},
    },
    {
      name: 'PART OF SPEECH',
      icon: 'fa-bullhorn',
      dataField: 'partOfSpeech',
      sortable: true,
      cellTemplate: `{{getPartOfSpeechText(data.partOfSpeech)}}`,
      cellController: ($scope: any) => {
        $scope.getPartOfSpeechText = (tag: string | null) => {
          return firebuttService.getPartOfSpeechText(tag);
        };
      },
    },
  ];
}
