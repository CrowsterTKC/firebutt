# Firebutt

A Firebot script replacement for the defunct buttsbot that repeats random chat messages and replaces random words from its phrase dictionary.

## Features

- Randomly replaces words in phrases with other words from the phrase dictionary via a pre-defined original phrase (optional) or part-of-speech based on response probability.
- Adds custom effects to allow adding/removing of phrases or updating the response probabiity via command, channel point redemption, etc.
- Allows for phrases to expire after a certain amount of time or remain indefintely.
- An intuitive GUI for managing phrases and their settings via a web browser.

## Installation

1. Download the `firebutt.js` and ` sql-wasm.wasm` files from the [latest release](https://github.com/CrowsterTKC/firebutt/releases/latest) page.
2. Launch Firebot and click on `File` > `Open Script Folder` (Windows) or `Firebot` > `Open Script Folder` (Mac).
3. Copy the `firebutt.js` and `sql-wasm.wasm` files into the script folder.
4. From the Firebot navigation sidebar, click on `Settings` > `Scripts`.
5. Enable custom scripts (if not already enabled).
6. Click on the `Manage Startup Scripts` button and `Add New Script`.
7. In the `Select script` dropdown, select `firebutt.js`.
8. Configure the script settings as desired.
9. Click `Save` to save the script settings.
10. Close the `Manage Startup Scripts` dialog.
11. Restart Firebot.

## Phrase Management
To manage phrases, open Firebot and navigate a browser to [http://localhost:7472/integrations/firebutt/management](http://localhost:7472/integrations/firebutt/management).