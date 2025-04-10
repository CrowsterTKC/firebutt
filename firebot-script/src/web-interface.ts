import { RunRequest } from '@crowbartools/firebot-custom-scripts-types';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

import { Firebutt } from './firebutt';
import { Params } from './params';
import { getScriptVersion } from './web-interface-routes/get-script-version';
import { crudPhrases } from './web-interface-routes/phrases';
import { rqUsageStatistics } from './web-interface-routes/usage-statistics';

const appJavaScriptUrl =
  'https://raw.githubusercontent.com/CrowsterTKC/firebutt/refs/heads/main/web-app/public/static/bundle.js';
const appCSSUrl =
  'https://raw.githubusercontent.com/CrowsterTKC/firebutt/refs/heads/main/web-app/public/static/bundle.css';

const singlePageAppHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <link
      rel="shortcut icon"
      href="data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMjggMTI4IiB2aWV3Qm94PSIwIDAgMTI4IDEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGxpbmVhckdyYWRpZW50IGlkPSJhIj48c3RvcCBvZmZzZXQ9Ii4xMjM1IiBzdG9wLWNvbG9yPSIjNjg5ZjM4Ii8+PHN0b3Agb2Zmc2V0PSIuMzIxNyIgc3RvcC1jb2xvcj0iIzczYTc0MyIvPjxzdG9wIG9mZnNldD0iLjY2ODUiIHN0b3AtY29sb3I9IiM4ZWJkNjAiLz48c3RvcCBvZmZzZXQ9Ii45OTI3IiBzdG9wLWNvbG9yPSIjYWVkNTgxIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImIiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLjk3NjUgLS4yMTU2IC4yMTU2IC45NzY1IC00LjU4MTQgMTAuMzkzKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIyMS41MDciIHgyPSI2NC44NDEiIHhsaW5rOmhyZWY9IiNhIiB5MT0iMjEuNDU0IiB5Mj0iMjEuNDU0Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJjIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0uOTkwNCAtLjEzODMgLS4xMzgzIC45OTA0IDE1Mi4yNyA3LjAzMzYpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjQxLjU5NiIgeDI9Ijg2LjEwMyIgeGxpbms6aHJlZj0iI2EiIHkxPSIyNS4zMzQiIHkyPSIyNS4zMzQiLz48cmFkaWFsR3JhZGllbnQgaWQ9ImQiIGN4PSI5MC4yOTMiIGN5PSI0My42OTciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiByPSI1NC41ODEiPjxzdG9wIG9mZnNldD0iLjE2MzMiIHN0b3AtY29sb3I9IiNmN2QzYTgiLz48c3RvcCBvZmZzZXQ9Ii4zMzYyIiBzdG9wLWNvbG9yPSIjZmJjZWFhIi8+PHN0b3Agb2Zmc2V0PSIuNDQyMiIgc3RvcC1jb2xvcj0iI2ZmYzdhZCIvPjxzdG9wIG9mZnNldD0iLjUxNCIgc3RvcC1jb2xvcj0iI2ZmYjhhMSIvPjxzdG9wIG9mZnNldD0iLjY1MTYiIHN0b3AtY29sb3I9IiNmZjkyODIiLz48c3RvcCBvZmZzZXQ9Ii44MzkzIiBzdG9wLWNvbG9yPSIjZmY1NDUwIi8+PHN0b3Agb2Zmc2V0PSIuODkyNCIgc3RvcC1jb2xvcj0iI2ZmNDE0MSIvPjxzdG9wIG9mZnNldD0iLjkyODYiIHN0b3AtY29sb3I9IiNmYTQyNDIiLz48c3RvcCBvZmZzZXQ9Ii45NzExIiBzdG9wLWNvbG9yPSIjZWM0NDQ0Ii8+PHN0b3Agb2Zmc2V0PSIuOTg0MSIgc3RvcC1jb2xvcj0iI2U2NDU0NSIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJlIiBjeD0iNDMuOTAxIiBjeT0iNTEuNDA2IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC4zMTE2IC45NTAyIC0xLjAxMDMgLjMzMTMgODIuMTYyIC03LjMzODcpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcj0iNjEuNTg3Ij48c3RvcCBvZmZzZXQ9Ii4xNjMzIiBzdG9wLWNvbG9yPSIjZjdkM2E4Ii8+PHN0b3Agb2Zmc2V0PSIuMzM2MiIgc3RvcC1jb2xvcj0iI2ZiY2VhYSIvPjxzdG9wIG9mZnNldD0iLjQ0MjIiIHN0b3AtY29sb3I9IiNmZmM3YWQiLz48c3RvcCBvZmZzZXQ9Ii41MTM0IiBzdG9wLWNvbG9yPSIjZmZiOGExIi8+PHN0b3Agb2Zmc2V0PSIuNjQ5OCIgc3RvcC1jb2xvcj0iI2ZmOTI4MiIvPjxzdG9wIG9mZnNldD0iLjgzNTgiIHN0b3AtY29sb3I9IiNmZjU0NTAiLz48c3RvcCBvZmZzZXQ9Ii44ODg0IiBzdG9wLWNvbG9yPSIjZmY0MTQxIi8+PHN0b3Agb2Zmc2V0PSIuOTI0MiIgc3RvcC1jb2xvcj0iI2ZhNDI0MiIvPjxzdG9wIG9mZnNldD0iLjkzMjMiIHN0b3AtY29sb3I9IiNmODQyNDIiLz48c3RvcCBvZmZzZXQ9Ii45ODQxIiBzdG9wLWNvbG9yPSIjZTY0NTQ1Ii8+PC9yYWRpYWxHcmFkaWVudD48cGF0aCBkPSJtMTYuNSA2LjEzczEwLjI1IDMzLjk1IDMyLjcgMzUuMjVjMjIuNDYgMS4zIDIxLjY2LTI5LjkxLTQuNDItMzMuODYtMjUuMzEtMy44My0yOC4yOC0xLjM5LTI4LjI4LTEuMzl6IiBmaWxsPSJ1cmwoI2IpIi8+PHBhdGggZD0ibTIyLjcgOC4zNmM1LjA1IDAgMTIuMzMuNzIgMjEuNjQgMi4xMyAxMi40OSAxLjg5IDE4LjQ1IDEwLjU5IDE3Ljg4IDE4LjItLjU0IDcuMTgtNi4zOCA5Ljc0LTExLjY2IDkuNzQtLjM4IDAtLjc4LS4wMS0xLjE3LS4wMy0xNi4yNy0uOTQtMjUuOC0yMS44Ny0yOC44OS0yOS45Ny41OS0uMDUgMS4zMi0uMDcgMi4yLS4wN20wLTNjLTUuMjcgMC02LjIuNzctNi4yLjc3czEwLjI1IDMzLjk1IDMyLjcgMzUuMjVjLjQ2LjAzLjkxLjA0IDEuMzUuMDQgMjEuMDcgMCAxOS43OC0zMC4wMy01Ljc3LTMzLjktMTEuMTMtMS42OS0xNy45NC0yLjE2LTIyLjA4LTIuMTZ6IiBmaWxsPSIjNDI0MjQyIiBvcGFjaXR5PSIuMiIvPjxwYXRoIGQ9Im0xMTAuNTYgNC45NHMtNy43NSAzNS41OS0zMC42NCAzOC43My0yNC41OS0yOC44OCAxLjc5LTM1LjAyYzI1LjYyLTUuOTcgMjguODUtMy43MSAyOC44NS0zLjcxeiIgZmlsbD0idXJsKCNjKSIvPjxwYXRoIGQ9Im0xMDYuNzcgNy41MmMtMi40OCA4LjQ4LTEwLjU3IDMwLjg4LTI3LjI2IDMzLjE4LS45MS4xMy0xLjgxLjE5LTIuNjUuMTktNC45OSAwLTEwLjYxLTIuNTQtMTEuNDMtOS42Ni0uNDQtMy44MS43OC03Ljk2IDMuMzQtMTEuMzcgMy4wNC00LjA1IDcuNzUtNi45MiAxMy42Mi04LjI5IDEzLjc2LTMuMjEgMjAuODItMy45OSAyNC4zOC00LjA1bS40Ni0zYy0zLjYxIDAtMTAuOTQuNzMtMjUuNTEgNC4xMy0yNS4xNSA1Ljg2LTI0Ljc4IDM1LjI0LTQuODUgMzUuMjQuOTcgMCAyLS4wNyAzLjA2LS4yMiAyMi44OS0zLjE1IDMwLjY0LTM4LjczIDMwLjY0LTM4Ljczcy0uNjEtLjQyLTMuMzQtLjQyeiIgZmlsbD0iIzQyNDI0MiIgb3BhY2l0eT0iLjIiLz48cGF0aCBkPSJtNjcuNTEgMTkuMzdjLTE2LjM0IDUuODctMjYuMzEgMjUuMDctMjguMTEgNDEuNTEtMS4zMiAxMi4xIDEuMTYgMjEuNDMgNS43MyAzMS4xMyAxNC44NSAzMS41MSAyMS42NyAzMS45MSAyMS42NyAzMS45MXMyOS44OC04LjU0IDQ2LjQtMzIuMjJjMTEuOTgtMTcuMTcgMTMuNzMtMzkuMDIgNS40Mi01NC4xNi05LjI5LTE2LjktMzMuMDctMjQuNjUtNTEuMTEtMTguMTd6IiBmaWxsPSJ1cmwoI2QpIi8+PHBhdGggZD0ibTE3LjkgMzIuMjVjLTguMTQgMTAuNy0xMC4yOCAyNS43LTYuNzYgNDAuMDEgMy41MSAxNC4yNSAxMS44OCAyNS41MiAyMy45NCAzMy43NiAyOC43NSAxOS42NiAzMS4wNyAxNy44OSAzMS4wNyAxNy44OXMyMy4yNC0yMC4xIDIzLjk4LTUyLjA1Yy40OC0yMC45My03LjQ1LTM4Ljg4LTIyLjI4LTQ3LjczLTEzLjcyLTguMTgtMjcuNzEtNS43MS0yOS4wOC01LjM2LTkuMTEgMi4zLTE2LjA0IDcuMTMtMjAuODcgMTMuNDh6IiBmaWxsPSIjNjY2IiBvcGFjaXR5PSIuNCIvPjxwYXRoIGQ9Im0xNC42IDMyLjI1Yy04LjE0IDEwLjctMTIuNDEgMjUuNjctOC44OSAzOS45OCAzLjUxIDE0LjI1IDExLjU2IDI2LjQzIDI0LjY5IDM1LjI1IDI5LjA1IDE5LjUyIDM2Ljg1IDE2LjI1IDM2Ljg1IDE2LjI1czE4Ljg0LTE5LjkyIDE5LjU4LTUxLjg3Yy40OC0yMC45My02LjI0LTQwLjAzLTIxLjA3LTQ4Ljg4LTEzLjcyLTguMTgtMjguOTItNC41NS0zMC4zLTQuMjEtOS4xMSAyLjMtMTYuMDQgNy4xMy0yMC44NiAxMy40OHoiIGZpbGw9InVybCgjZSkiLz48cGF0aCBkPSJtODAuODEgMTkuOGMxNC43MyAwIDI4Ljg3IDcuNzEgMzUuMTcgMTkuMTggOCAxNC41NSA1Ljg5IDM1LjA0LTUuMjUgNTAuOTktMTUuMTMgMjEuNjctNDIuNSAzMC4zNi00NC43MiAzMS4wMy0uMDQgMC0uMTEuMDEtLjIuMDEtLjk1IDAtMy44OC0uMjctMTAuNS0yLjc3LTQuODktMS44NS0xMS42NC01LjctMjMuMjktMTMuMjgtMTEuOTEtNy43Ni0xOS43OS0xOS4xMy0yMy40LTMzLjgtMy4wNC0xMi4zNi4wOC0yNi4yMyA4LjM2LTM3LjExIDQuNzItNi4yMSAxMS4xOC0xMC4zOCAxOS4yLTEyLjQuNjctLjE3IDQuMjQtMSA5LjIzLTEgNS45NyAwIDExLjQ0IDEuMTcgMTYuMjggMy40OS40MS4yLjg1LjI5IDEuMjkuMjkuNSAwIDEtLjEyIDEuNDUtLjM3LjQ0LS4yNC44OC0uNSAxLjMyLS43Ni45Ny0uNTcgMS44OS0xLjEyIDIuNzctMS40MyAzLjgtMS4zOCA3LjkzLTIuMDcgMTIuMjktMi4wN20tMTQuOTUgMTAxLjIzczAgLjAxLS4wNC4wM2MtLjAzIDAgLjAzLS4wMy4wNC0uMDNtMTQuOTUtMTA0LjIzYy00LjU3IDAtOS4wOS43Mi0xMy4yOSAyLjIzLTEuNi41Ny0zLjA2IDEuNTgtNC41MyAyLjM5LTYuMjItMi45Ny0xMi41NS0zLjc4LTE3LjU3LTMuNzgtNS40IDAtOS4zLjkzLTkuOTYgMS4xLTkuMTEgMi4yOS0xNi4wNCA3LjE1LTIwLjg2IDEzLjQ5LTguMTQgMTAuNy0xMi40IDI1LjM0LTguODggMzkuNjUgMy41MSAxNC4yNSAxMS4xNSAyNi43OSAyNC42OSAzNS42IDEwLjc5IDcuMDIgMTguMzMgMTEuNDggMjMuODcgMTMuNTcgNi43OSAyLjU3IDEwLjE0IDIuOTYgMTEuNTYgMi45Ni42MyAwIC44OC0uMDguODgtLjA4czI5Ljk3LTguNTcgNDYuNDktMzIuMjRjMTEuOTgtMTcuMTYgMTMuNzMtMzkuMDMgNS40Mi01NC4xNi03LjE0LTEyLjk1LTIyLjc4LTIwLjczLTM3LjgyLTIwLjczeiIgZmlsbD0iIzQyNDI0MiIgb3BhY2l0eT0iLjIiLz48L3N2Zz4="
    />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Firebutt — Phrase Management</title>
    <script type="module" crossorigin src="/integrations/firebutt/management/static/bundle.js?${uuid()}"></script>
    <link rel="stylesheet" crossorigin href="/integrations/firebutt/management/static/bundle.css?${uuid()}">
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`;

export function register(
  _: Firebutt,
  { firebot, modules, parameters }: Omit<RunRequest<Params>, 'trigger'>
) {
  const { httpServer } = modules;

  httpServer.registerCustomRoute(
    'firebutt',
    '/management',
    'GET',
    async (_: Request, res: Response) => {
      res.send(singlePageAppHtml);
    }
  );

  httpServer.registerCustomRoute(
    'firebutt',
    '/management/static/bundle.js',
    'GET',
    async (_: Request, res: Response) => {
      const response = await fetch(appJavaScriptUrl);
      const js = await response.text();

      res.setHeader('Cache-Control', 'no-store');
      res.contentType('application/javascript');
      res.send(js);
    }
  );

  httpServer.registerCustomRoute(
    'firebutt',
    '/management/static/bundle.css',
    'GET',
    async (_: Request, res: Response) => {
      const response = await fetch(appCSSUrl);
      const css = await response.text();

      res.setHeader('Cache-Control', 'no-store');
      res.contentType('text/css');
      res.send(css);
    }
  );

  getScriptVersion(_, { firebot, modules, parameters });
  crudPhrases(_, { firebot, modules, parameters });
  rqUsageStatistics(_, { firebot, modules, parameters });
}
