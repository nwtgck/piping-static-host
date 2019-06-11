#!/usr/bin/env node
// (from: https://qiita.com/takayukioda/items/a149bc2907ef77121229)

import * as yargs from 'yargs';
import * as pipingStaticHost from "./piping-static-host";
import * as crypto from "crypto";

function generateRandomHostPrefix(len: number): string {
  const alphas  = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const chars   = [...alphas, ...numbers];

  // (from: https://qiita.com/fukasawah/items/db7f0405564bdc37820e)
  const str = chars.join('');
  return Array.from(crypto.randomFillSync(new Uint8Array(len))).map((n)=>str[n%str.length]).join('')
}

const parser = yargs
  .option('server-url', {
    describe: "Piping Server URL",
    type: 'string',
    default: 'https://ppng.ml'
  })
  .option('host-prefix', {
    describe: "Host prefix (default: random)",
    type: 'string',
  })
  .option('dir', {
    describe: "Public directory path",
    type: 'string',
    default: '.'
  })
  .option('index', {
    describe: "Index file path",
    type: 'string',
  });

const args = parser.parse(process.argv);

const serverUrl: string  = args["server-url"];
const hostPrefix: string = args["host-prefix"] || generateRandomHostPrefix(6);
const publicDirPath: string = args["dir"];
const indexPath: string | undefined = args["index"];

// Host
pipingStaticHost.host(serverUrl, hostPrefix, publicDirPath, indexPath);
