# piping-static-host
Host static files to [Piping Server](https://github.com/nwtgck/piping-server)

## Install

Install via GitHub

```bash
npm i -g nwtgck/piping-static-host#master
```

## Usage

```bash
piping-static-host --dir=./mypublic --index=./mypublic/index.html
```

Then, you can access <https://piping.ml/ueM7kZ>.  
Note `ueM7kZ` is auto generated. You can specify the prefix by `--host-prefix` option.

Here are available options.
```bash
Options:
  --help         Show help                                             [boolean]
  --version      Show version number                                   [boolean]
  --server-url   Piping Server URL         [string] [default: "https://ppng.ml"]
  --host-prefix  Host prefix (default: random)                          [string]
  --dir          Public directory path                   [string] [default: "."]
  --index        Index file path                                        [string]
``` 
