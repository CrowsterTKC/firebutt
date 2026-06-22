import { RunRequest } from '@crowbartools/firebot-custom-scripts-types';
import { Request, Response } from 'express';

import { Firebutt } from '../firebutt';
import { Params } from '../params';
import {
  addPhrase,
  deletePhrase,
  getCategory,
  getPhrase,
  getPhraseRepository,
  updatePhrase,
} from '../phrase-manager';

export function crudPhrases(
  _: Firebutt,
  { modules }: Omit<RunRequest<Params>, 'trigger' | 'scriptDataDir'>
) {
  const { httpServer } = modules;

  httpServer.registerCustomRoute(
    'firebutt',
    '/management/api/phrases',
    'GET',
    async (req: Request, res: Response) => {
      const { id, categoryId } = req.query as {
        id?: string;
        categoryId?: string;
      };

      const phrasesBase = getPhraseRepository()
        .createQueryBuilder('phrase')
        .leftJoinAndSelect('phrase.category', 'category')
        .select([
          'phrase.id',
          'phrase.originalPhrase',
          'phrase.replacementPhrase',
          'phrase.partOfSpeech',
          'phrase.expiresAt',
          'phrase.createdByUser',
          'phrase.usageCount',
          'phrase.metadata',
          'category.id',
          'category.name',
          'category.isEnabled',
          'category.order',
        ])
        .where(id ? 'phrase.id = :id' : '', { id })
        .andWhere(
          categoryId !== '00000000-0000-0000-0000-000000000000'
            ? 'category.id = :categoryId'
            : 'category.id IS NULL',
          {
            categoryId,
          }
        );

      const phrases =
        req.query['includeDeleted'] === 'true' || id
          ? await phrasesBase.withDeleted().getMany()
          : await phrasesBase.getMany();

      res.setHeader('Content-Type', 'application/json');
      res.send(
        JSON.stringify({
          phrases,
        })
      );
    }
  );

  httpServer.registerCustomRoute(
    'firebutt',
    '/management/api/phrases',
    'POST',
    async (req: Request, res: Response) => {
      const {
        originalPhrase,
        replacementPhrase,
        partOfSpeech,
        expiresAt,
        createdByUser,
        categoryId,
      } = req.body;

      const newPhrase = await addPhrase({
        originalPhrase,
        replacementPhrase,
        partOfSpeech,
        expiresAt,
        createdByUser,
        category:
          categoryId && categoryId !== '00000000-0000-0000-0000-000000000000'
            ? await getCategory({ id: categoryId })
            : null,
      });

      res.setHeader('Content-Type', 'application/json');
      res.send(
        JSON.stringify({
          phrase: newPhrase,
        })
      );
    }
  );

  httpServer.registerCustomRoute(
    'firebutt',
    '/management/api/phrases',
    'PUT',
    async (req: Request, res: Response) => {
      const { id } = req.query as { id: string };
      const {
        originalPhrase,
        replacementPhrase,
        partOfSpeech,
        expiresAt,
        createdByUser,
        categoryId,
      } = req.body;

      const phrase = await getPhrase({ id });

      if (phrase) {
        const category =
          categoryId && categoryId !== '00000000-0000-0000-0000-000000000000'
            ? await getCategory({ id: categoryId })
            : null;

        const updatedPhrase = await updatePhrase(phrase, {
          originalPhrase,
          replacementPhrase,
          partOfSpeech,
          expiresAt,
          createdByUser,
          category,
        });

        res.setHeader('Content-Type', 'application/json');
        res.send(
          JSON.stringify({
            phrase: updatedPhrase,
          })
        );
      } else {
        res.status(404).send('Phrase not found');
        return;
      }
    }
  );

  httpServer.registerCustomRoute(
    'firebutt',
    '/management/api/phrases',
    'DELETE',
    async (req: Request, res: Response) => {
      const { id } = req.query as { id: string };

      const deleted = await deletePhrase({ id });

      res.setHeader('Content-Type', 'application/json');
      res.send(
        JSON.stringify({
          deleted,
        })
      );
    }
  );
}
