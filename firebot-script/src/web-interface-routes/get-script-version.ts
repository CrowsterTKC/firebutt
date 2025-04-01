import { RunRequest } from '@crowbartools/firebot-custom-scripts-types';
import { Request, Response } from 'express';

import { version } from '../../package.json';
import { Firebutt } from '../firebutt';
import { Params } from '../params';

export function getScriptVersion(
  _: Firebutt,
  { modules }: Omit<RunRequest<Params>, 'trigger'>
) {
  const { httpServer } = modules;

  httpServer.registerCustomRoute(
    'firebutt',
    '/management/api/get-script-version',
    'GET',
    async (_: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(
        JSON.stringify({
          scriptVersion: version,
        })
      );
    }
  );
}
