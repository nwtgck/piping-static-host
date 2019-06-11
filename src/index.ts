export function hoge(str: string): number {
  return str.length;
}

import * as stream from 'stream';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';
import * as request from 'request';
import * as glob from 'glob';

const REHOST_WAIT_SEC = 10;

function sleep(millis: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, millis));
}

function pipingSend(serverUrl: string, hostId: string, filePath: string, body: stream.Readable): Promise<request.Response> {
  const u = url.resolve(serverUrl, path.join(hostId, filePath));
  console.log(`URL: ${u}`);

  return new Promise((resolve, reject) => {
    request.post(u, {
      body: body,
      // (from: https://stackoverflow.com/a/11042814/2885946)
      rejectUnauthorized: false,
    }, (err, res) => {
      if (err !== null) reject(err);
      resolve(res);
    });
  });
}

async function hostLoop(serverUrl: string, hostId: string, bodyFilePath: string, reqFilePath: string): Promise<void> {
  if (!fs.statSync(bodyFilePath).isFile()) {
    return;
  }
  while (true) {
    console.log(`Loading ${bodyFilePath} as ${reqFilePath}...`);
    try {
      const body = fs.createReadStream(bodyFilePath);
      const res = await pipingSend(serverUrl, hostId, reqFilePath, body);
      if (res.statusCode === 200) {
        console.log(`send status: ${res.statusCode}`);
      } else {
        await sleep(REHOST_WAIT_SEC * 1000);
      }
    } catch (err) {
      console.error(err);
      await sleep(REHOST_WAIT_SEC * 1000);
    }
  }
}

function host(serverUrl: string, hostId: string, publicDirPath: string, indexPath?: string): void {
  if (indexPath !== undefined) {
    // Host index paths
    hostLoop(serverUrl, hostId, indexPath, "");
    hostLoop(serverUrl, hostId, indexPath, "/");
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
      // Host
      hostLoop(serverUrl, hostId, joinedFPath, filePath);
    }
  });
}


const serverUrl      = "https://ppng.ml";
const hostId       = "myhostId";

host(serverUrl, hostId, './dist', 'dist/test/index.test.js');
