# piping-static-http-deploy
Deploy static files to [piping server](https://github.com/nwtgck/piping-server)

## Deploy

1. Create files in # piping-static-http-deploy`./public_html`
2. `ruby main.rb`

Then, you can access https://piping.ml/mydeployid/index.html.


## Customize 

You can modify some variables in `main.rb` to change
* Piping server URL
* Deploy ID for security
* Path of public_html
* Index path
