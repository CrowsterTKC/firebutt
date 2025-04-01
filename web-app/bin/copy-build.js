/* global console */
/* eslint-disable @typescript-eslint/no-require-imports, no-undef */
import fs from 'fs';
import { join, resolve } from 'path';

(() => {
  const distAssetsFolderPath = resolve('./dist/assets');
  const distAssetsFolderFiles = fs.readdirSync(distAssetsFolderPath);
  const distAssetsJavaScriptFile = distAssetsFolderFiles.find((file) =>
    file.endsWith('.js')
  );
  const distAssetsCssFile = distAssetsFolderFiles.find((file) =>
    file.endsWith('.css')
  );
  const publicStaticFilesFolderPath = resolve('./public/static');

  fs.copyFileSync(
    join(distAssetsFolderPath, distAssetsJavaScriptFile),
    join(publicStaticFilesFolderPath, 'bundle.js')
  );
  fs.copyFileSync(
    join(distAssetsFolderPath, distAssetsCssFile),
    join(publicStaticFilesFolderPath, 'bundle.css')
  );
  console.log(`Successfully copied static assets files.`);
})();
