# piping-static-host
Host static files to [Piping Server](https://github.com/nwtgck/piping-server)

## Deploy

1. Create files in `./public_html`
2. `ruby main.rb`

Then, you can access https://piping.ml/mydeployid/index.html.


## Customize 

You can modify some variables in `main.rb` to change
* Piping server URL
* Deploy ID for security
* Path of public_html
* Index path
