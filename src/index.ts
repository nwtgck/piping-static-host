export function hoge(str: string): number {
  return str.length;
}

import * as stream from 'stream';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';
import thenRequest, {ResponsePromise} from 'then-request';
import * as glob from 'glob';

const REALOAD_WAIT_SEC = 10;

// (from: https://stackoverflow.com/a/20100521/2885946)
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

function sleep(millis: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, millis));
}

function pipingSend(serverUrl: string, deployId: string, filePath: string, body: stream.Readable): ResponsePromise {
  const u = url.resolve(serverUrl, path.join(deployId, filePath));
  console.log(`URL: ${u}`);
  return thenRequest('POST', u, {
    body: body,
  });
}

async function deployLoop(serverUrl: string, deployId: string, bodyFilePath: string, reqFilePath: string): Promise<void> {
  if (!fs.statSync(bodyFilePath).isFile()) {
    return;
  }
  while (true) {
    console.log(`Loading ${bodyFilePath} as ${reqFilePath}...`);
    try {
      const body = fs.createReadStream(bodyFilePath);
      const res = await pipingSend(serverUrl, deployId, reqFilePath, body);
      if (res.statusCode === 200) {
        console.log(`send status: ${res.statusCode}`);
      } else {
        await sleep(REALOAD_WAIT_SEC * 1000);
      }
    } catch (err) {
      console.error(err);
      await sleep(REALOAD_WAIT_SEC * 1000);
    }
  }
}

function pipingDeploy(serverUrl: string, deployId: string, publicDirPath: string, indexPath?: string): void {
  if (indexPath !== undefined) {
    deployLoop(serverUrl, deployId, indexPath, "");
    deployLoop(serverUrl, deployId, indexPath, "/");
  }

  // Backup pwd
  const backupCwd = process.cwd();
  // Move to public directory path
  process.chdir(publicDirPath);
  // Get file paths in the directory
  glob('**/*', (err, filePaths) => {
    if(err !== null) {
      console.error(err);
      return;
    }
    // Move pwd back
    process.chdir(backupCwd);
    for (const filePath of filePaths) {
      // Join the path
      const joinedFPath = path.join(publicDirPath, filePath);
      // Deploy
      deployLoop(serverUrl, deployId, joinedFPath, filePath);
    }
  });
}


const serverUrl      = "https://ppng.ml";
const deployId       = "mydeployid";


pipingDeploy(serverUrl, deployId, './dist', 'dist/test/index.test.js');
