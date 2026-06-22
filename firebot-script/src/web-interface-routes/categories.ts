import { RunRequest } from '@crowbartools/firebot-custom-scripts-types';
import { Request, Response } from 'express';

import { Firebutt } from '../firebutt';
import { Params } from '../params';
import {
  addCategory,
  deleteCategory,
  getCategory,
  getCategoryRepository,
  updateCategory,
} from '../phrase-manager';

export function crudCategories(
  _: Firebutt,
  { modules }: Omit<RunRequest<Params>, 'trigger' | 'scriptDataDir'>
) {
  const { httpServer } = modules;

  httpServer.registerCustomRoute(
    'firebutt',
    '/management/api/categories',
    'GET',
    async (req: Request, res: Response) => {
      const { id } = req.query as { id?: string };

      const categoriesBase = getCategoryRepository()
        .createQueryBuilder('category')
        .select([
          'category.id',
          'category.name',
          'category.isEnabled',
          'category.order',
        ])
        .where(id ? 'category.id = :id' : '', { id })
        .orderBy('category.order', 'ASC');

      const categories =
        req.query['includeDeleted'] === 'true' || id
          ? await categoriesBase.withDeleted().getMany()
          : await categoriesBase.getMany();

      res.setHeader('Content-Type', 'application/json');
      res.send(
        JSON.stringify({
          categories,
        })
      );
    }
  );

  httpServer.registerCustomRoute(
    'firebutt',
    '/management/api/categories',
    'POST',
    async (req: Request, res: Response) => {
      const { name, isEnabled } = req.body as {
        name: string;
        isEnabled?: boolean;
      };

      const newCategory = await addCategory(name, isEnabled);

      res.setHeader('Content-Type', 'application/json');
      res.send(
        JSON.stringify({
          category: newCategory,
        })
      );
    }
  );

  httpServer.registerCustomRoute(
    'firebutt',
    '/management/api/categories',
    'PUT',
    async (req: Request, res: Response) => {
      const { id, name, isEnabled, order } = req.body as {
        id: string;
        name: string;
        isEnabled: boolean;
        order: number;
      };

      const category = await getCategory({ id });

      if (category) {
        const updatedCategory = await updateCategory(category, {
          name,
          isEnabled,
          order,
        });

        res.setHeader('Content-Type', 'application/json');
        res.send(
          JSON.stringify({
            category: updatedCategory,
          })
        );
      } else {
        res.status(404).send('Category not found');
      }
    }
  );

  httpServer.registerCustomRoute(
    'firebutt',
    '/management/api/categories',
    'DELETE',
    async (req: Request, res: Response) => {
      const { id } = req.query as { id: string };

      const deleted = await deleteCategory({ id });

      res.setHeader('Content-Type', 'application/json');
      res.send(
        JSON.stringify({
          deleted,
        })
      );
    }
  );

  httpServer.registerCustomRoute(
    'firebutt',
    '/management/api/categories/reorder',
    'PUT',
    async (req: Request, res: Response) => {
      const { categories } = req.body as {
        categories: { id: string; order: number }[];
      };

      const updatedCategories = await Promise.all(
        categories.map(async (category) => {
          const existingCategory = await getCategory({ id: category.id });
          if (existingCategory) {
            return updateCategory(existingCategory, {
              order: category.order,
            });
          }
          return null;
        })
      );

      res.setHeader('Content-Type', 'application/json');
      res.send(
        JSON.stringify({
          categories: updatedCategories,
        })
      );
    }
  );
}
