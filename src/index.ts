#!/usr/bin/env node
// (from: https://qiita.com/takayukioda/items/a149bc2907ef77121229)

import * as pipingStaticHost from "./piping-static-host";

const serverUrl      = "https://ppng.ml";
const hostId       = "myhostId";

pipingStaticHost.host(serverUrl, hostId, './dist', 'dist/test/index.test.js');
