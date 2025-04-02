import {
  Firebot,
  RunRequest,
} from '@crowbartools/firebot-custom-scripts-types';
import { EffectScope } from '@crowbartools/firebot-custom-scripts-types/types/effects';
import { Lexer, Tagger } from 'pos';

import { Firebutt } from './firebutt';
import { Params } from './params';
import { addPhrase, deletePhrase, getPhraseCache } from './phrase-manager';
import {
  AddRemoveEffectModel,
  UpdateResponseProbablityEffectModel,
} from './types/custom-effect';

export function registerFirebuttAddRemovePhraseEffectType(
  _: Firebutt,
  { modules: { effectManager } }: Omit<RunRequest<Params>, 'trigger'>
) {
  const firebuttEffectType: Firebot.EffectType<AddRemoveEffectModel> = {
    definition: {
      id: 'crowstertkc:firebutt-add-remove-phrase',
      name: 'Firebutt — Add/Remove Phrase',
      description: "Add/remove a phrase from Firebutt's dictionary.",
      icon: 'fad fa-book',
      categories: ['fun'],
      dependencies: [],
    },
    optionsTemplate: `
      <eos-container header="Action" pad-top="true">
        <div class="btn-group">
          <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span class="list-effect-type">{{effect.action ? effect.action : 'Pick one'}}</span> <span class="caret"></span>
          </button>
          <ul class="dropdown-menu celebrate-effect-dropdown">
            <li ng-click="effect.action = 'Add Phrase'">
              <a href>Add Phrase</a>
            </li>
            <li ng-click="effect.action = 'Remove Phrase'">
              <a href>Remove Phrase</a>
            </li>
          </ul>
        </div>
      </eos-container>
      <eos-container header="{{effect.action}}" pad-top="true" ng-show="effect.action != null">
        <div class="input-group" ng-show="effect.action == 'Add Phrase'">
          <span class="input-group-addon" id="delay-length-effect-type">Original Phrase</span>
          <input type="text" class="form-control" aria-describedby="basic-addon3" ng-model="effect.originalPhrase" placeholder="Enter phrase" replace-variables menu-position="below" />
        </div>
        <div class="input-group" style="margin-top:10px">
          <span class="input-group-addon" id="delay-length-effect-type">Replacement Phrase</span>
          <input type="text" class="form-control" aria-describedby="basic-addon3" ng-model="effect.replacementPhrase" placeholder="Enter phrase" replace-variables menu-position="below" />
        </div>
        <div class="input-group" style="margin-top:10px" ng-show="effect.action == 'Add Phrase'">
          <span class="input-group-addon" id="delay-length-effect-type">Expires in Days</span>
          <input type="text" class="form-control" aria-describedby="currency-units-type" ng-model="effect.expiresInDays" placeholder="Enter days until expiration or leave blank for permanent" type="text" replace-variables="number">
        </div>
      </eos-container>
    `,
    optionsValidator: (effect) => {
      const errors = [];
      if (!effect.action) {
        errors.push('Action is required');
      }
      if (!effect.replacementPhrase) {
        errors.push('Replacement phrase is required');
      }
      if (effect.expiresInDays && parseInt(effect.expiresInDays) <= 0) {
        errors.push('Expires in days must be greater than 0');
      }
      return errors;
    },
    onTriggerEvent: async (event) => {
      const { action, originalPhrase, replacementPhrase, expiresInDays } =
        event.effect;
      if (action === 'Add Phrase') {
        const lexer = new Lexer();
        const tagger = new Tagger();
        const taggedWords = tagger.tag(lexer.lex(originalPhrase));

        await addPhrase({
          originalPhrase:
            originalPhrase !== ''
              ? [originalPhrase]
              : [`__${replacementPhrase}__`],
          replacementPhrase,
          partOfSpeech: taggedWords.length === 1 ? taggedWords[0][1] : null,
          expiresAt: expiresInDays
            ? new Date(Date.now() + Number(expiresInDays) * 24 * 60 * 60 * 1000)
            : null,
          createdByUser: event.trigger.metadata.username,
        });
      } else {
        const phraseId = Object.values(getPhraseCache()).find((phrase) => {
          return phrase.replacementPhrase === replacementPhrase;
        })?.id;

        if (phraseId) {
          await deletePhrase({
            id: phraseId,
          });
        }
      }
    },
  };
  effectManager.registerEffect(firebuttEffectType);
}

export function registerFirebuttUpdateResponseProbablityEffectType(
  firebutt: Firebutt,
  { modules: { effectManager } }: Omit<RunRequest<Params>, 'trigger'>
) {
  const firebuttEffectType: Firebot.EffectType<UpdateResponseProbablityEffectModel> =
    {
      definition: {
        id: 'crowstertkc:firebutt-update-response-probability',
        name: 'Firebutt — Update Response Probability',
        description: "Update Firebutt's response probability.",
        icon: 'fad fa-comments',
        categories: ['fun'],
        dependencies: [],
      },
      optionsTemplate: `
        <eos-container header="Mode">
          <div class="controls-fb" style="padding-bottom: 5px;">
            <label class="control-fb control--radio">Increment <tooltip text="'Increment the response probably by the given value (value can be negative to decrement)'"></tooltip>
              <input type="radio" ng-model="effect.mode" value="increment"/>
              <div class="control__indicator"></div>
            </label>
            <label class="control-fb control--radio">Set <tooltip text="'Set the response probably to a new value.'"></tooltip>
              <input type="radio" ng-model="effect.mode" value="set"/>
              <div class="control__indicator"></div>
            </label>
          </div>
        </eos-container>

        <eos-container header="{{effect.mode == 'increment' ? 'Increment Amount' : 'New Value'}}" ng-show="effect.mode">
          <div class="input-group">
            <span class="input-group-addon" id="delay-length-effect-type">Value</span>
            <input ng-model="effect.value" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
          </div>
        </eos-container>
      `,
      optionsValidator: (effect) => {
        const errors = [];
        if (!effect.mode) {
          errors.push('Mode is required');
        }
        if (effect.value && isNaN(Number(effect.value))) {
          errors.push('Value must be a number');
        }
        if (
          effect.value &&
          Number(effect.value) < 0 &&
          Number(effect.mode) > 100
        ) {
          errors.push('Value must be between 0 and 100');
        }
        return errors;
      },
      optionsController: (
        $scope: EffectScope<UpdateResponseProbablityEffectModel>
      ) => {
        if ($scope.effect.value === undefined) {
          $scope.effect.value = '0';
        }
      },
      onTriggerEvent: async (event) => {
        const { mode, value } = event.effect;
        const { responseProbability } = firebutt.getParameters();
        const newResponseProbability =
          mode === 'increment'
            ? Number(responseProbability) + Number(value)
            : Number(value);
        await firebutt.updateParameters(
          {
            responseProbability: Math.min(
              Math.max(newResponseProbability, 0),
              100
            ),
          },
          true
        );
      },
    };
  effectManager.registerEffect(firebuttEffectType);
}
