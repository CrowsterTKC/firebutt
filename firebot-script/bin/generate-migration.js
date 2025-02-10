/* eslint-disable @typescript-eslint/no-require-imports, no-undef */
const fs = require('fs');
const process = require('node:process');

const dateFnsTz = require('date-fns-tz');

(() => {
  const now = new Date();
  const fileTimestamp = dateFnsTz.format(
    dateFnsTz.toZonedTime(now, 'UTC'),
    'yyyyMMddHHmmss',
    { timeZone: 'UTC' }
  );
  const timestamp = dateFnsTz.toZonedTime(now, 'UTC').getTime();
  const migrationName = process.argv[2].replace(/-/g, '_');
  const className = migrationName
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const migrationTemplate = `import { MigrationInterface, QueryRunner } from 'typeorm';

export class ${className}${timestamp} implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {}

  async down(queryRunner: QueryRunner): Promise<void> {}
}
`;

  fs.writeFileSync(
    `src/migrations/${fileTimestamp}-${migrationName}.ts`,
    migrationTemplate
  );

  const importLookup = '// import statements above';
  const importTemplate = `import { ${className}${timestamp} } from './${fileTimestamp}-${migrationName}';`;
  const migrationLookup = '// migration scripts above';
  const migrationTemplateImport = `${className}${timestamp},`;

  const schemaMigrationsFile = fs
    .readFileSync('src/migrations/schema-migrations.ts', 'utf8')
    .replace(importLookup, `${importTemplate}\n${importLookup}`)
    .replace(
      migrationLookup,
      `${migrationTemplateImport}\n  ${migrationLookup}`
    );

  fs.writeFileSync('src/migrations/schema-migrations.ts', schemaMigrationsFile);

  console.log(`Created migration: ${fileTimestamp}-${migrationName}.ts`);
})();
