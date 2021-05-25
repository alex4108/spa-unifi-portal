# spa-unifi-portal

This was a request by a client to have their Unifi Captive Portal capture emails & submit them to the newsletter service.  You may wish to adapt this project to your own needs.

There are two components of this project detailed below.

# site

This is the bread and butter.  It's an in-browser application to:

1. Display the captive portal page
1. Validate the email
1. Submit to the newsletter API
1. Tell Unifi to authenticate this client

The first two lines of `app.js` should be configured based on your needs.
You may also wish to modify `submitToListServ()` as needed.  Hopefully your JS is better than mine ;)

## Running the site locally

You can `bash start_dev.sh` to run a python SimpleHTTPServer to serve the page.

## Installing to Unifi Controller

You can build the tarball to deploy to your unifi controller by reading over `deploy.sh` and extracting the necessary components.
For speed, the deploy script will deploy to the container running on your machine.  
Hopefully you don't run the client's Unifi portal in an ephemeral container :) 

After deployment to the Unifi controller, you should be able to view the site here: `http://localhost:8880/guest/s/default/#/`
You should validate the Unifi Guest Control has these settings enabled for valid testing:

* Enable Guest Portal `checked`
* Authentication: `Hotspot`
* Template Engine: `AngularJS`
* Override Default Templates: `checked`
* Enable API-based authentication: `checked`
* Pre-Authorization Access: The host for `LIST_SERV_URL` as defined in app.js

`site` was originally forked from [cobookman](https://github.com/cobookman/unifi-captive-portal)

# api

This is a really simple Flask app to capture the POST data submitted by `site`, to verify that `fetch()` is working as expected.

```
virtualenv venv
. ./venv/bin/activate
pip3 install -r requirements.txt
```