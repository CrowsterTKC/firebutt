import fs from 'fs';
import path from 'path';

export function getFirebotProfileDataFolderPath(): string {
  let appDataFolderPath: string;
  switch (process.platform) {
    case 'win32':
      appDataFolderPath = process.env.APPDATA as string;
      break;
    case 'darwin':
      appDataFolderPath = path.join(
        process.env.HOME as string,
        '/Library/Application Support'
      );
      break;
    case 'linux':
      appDataFolderPath = path.join(process.env.HOME as string, '/.config');
      break;
    default:
      throw new Error('Unsupported OS!');
  }

  const firebotDataFolderPath = path.join(appDataFolderPath, '/Firebot/v5/');
  const firebotGlobalSettings = JSON.parse(
    fs.readFileSync(
      path.join(firebotDataFolderPath, 'global-settings.json'),
      'utf8'
    )
  );

  if (
    firebotGlobalSettings == null ||
    firebotGlobalSettings.profiles == null ||
    firebotGlobalSettings.profiles.loggedInProfile == null
  ) {
    throw new Error('Unable to determine active profile');
  }

  const activeProfile = firebotGlobalSettings.profiles.loggedInProfile;

  const profileDataFolderPath = path.join(
    firebotDataFolderPath,
    `/profiles/${activeProfile}`
  );
  return profileDataFolderPath;
}
