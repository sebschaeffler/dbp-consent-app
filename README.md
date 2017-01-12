This project is intended to draft a consent app for the digital business platform.

It is currently based on Kong, the API gateway from mashape: https://github.com/Mashape/kong

and Hydra, an authorization framework based on oauth2 and Open ID Connect, from ory-am: https://github.com/ory-am/hydra

# Install and run the project:

`$ npm i`

`$ npm run dev`

The node server runs on port 3003, export a new env variable to change the default setting.

e.g. on MacOs or Linux:

`$ export PORT 9000`

![Alt text](./screenshots/login.png?raw=true "Login screen")

# Set up the authorization server

Hydra is the default authorization server, to change it and switch to Kong, the following environment variable needs to be exported:

`export PROVIDER=kong`

To switch back to Hydra, either delete the environment variable or change it to:

`export PROVIDER=hydra`

# Step by step guide for HYDRA:

##Install hydra containers (i.e. hydra server, postgres database and consent application):

`SYSTEM_SECRET=whateverlongpasswordshouldbefinehere CONSENT_URL=http://localhost:3003 docker-compose up --build`

##Enter hydra container:

`docker exec -e TZ=Europe/Paris -it 2df87a2f6611 /bin/bash`

If this does not work then run the following command from within the container:

`echo "Europe/Paris" > /etc/timezone`

Then: `docker-compose stop`

AND: `docker-compose start`

## Then connect at least once to hydra to create the yaml file:

`hydra connect`

then press enter to leave the default settings:

cluster_url: http://localhost:4444

client_id: admin

client_secret: demo-password

## Generate a URL to get a challenge:

`hydra token user`

Copy the URL and paste it into the browser.

The URL should look like this:

`http://localhost:4444/oauth2/auth?client_id=admin&redirect_uri=http%3A%2F%2Flocalhost%3A4445%2Fcallback&response_type=code&scope=hydra+offline+openid&state=adopzymkowxidumwpngrinpf&nonce=xqxfrwwquabnzpkxwxkjfext`

In the consent app, enter any email and password, then press authorise to get a consent token.

# Step by step guide for KONG:

## Run container with postgres:

`docker run -d --name kong-database -p 5432:5432 -e "POSTGRES_USER=kong" -e "POSTGRES_DB=kong" postgres:9.4`

## Run Kong:

`docker run -d --name kong --link kong-database:kong-database -e "KONG_DATABASE=postgres" -e "KONG_POSTGRES_CONTACT_POINTS=kong-database" -e "KONG_PG_HOST=kong-database" -p 8000:8000 -p 8443:8443 -p 8001:8001 -p 7946:7946 -p 7946:7946/udp kong`

## Install httpie:

`brew install httpie`

Check installation:

http http://localhost:8001

## Create new api:

`http POST http://localhost:8001/apis/  name=accounts upstream_url=https://dbpgo.herokuapp.com request_path=/accounts`

or

http POST http://localhost:8001/apis/  name=accounts upstream_url=https://dbpgo.herokuapp.com request_host=dbpgo.herokuapp.com

Output:

HTTP/1.1 201 Created
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Type: application/json; charset=utf-8
Date: Thu, 08 Dec 2016 09:40:29 GMT
Server: kong/0.9.5
Transfer-Encoding: chunked

{
    "created_at": 1481190030000,
    "id": "095eda07-302e-4fb3-8069-9042fa49c17c",
    "name": "accounts",
    "preserve_host": false,
    "request_path": "/accounts",
    "strip_request_path": false,
    "upstream_url": "https://dbpgo.herokuapp.com"
}

## Create consumer:

`http POST http://localhost:8001/consumers username=seb`

Output:

HTTP/1.1 201 Created
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Type: application/json; charset=utf-8
Date: Thu, 08 Dec 2016 09:42:26 GMT
Server: kong/0.9.5
Transfer-Encoding: chunked

{
    "created_at": 1481190147000,
    "id": "5578665d-0db0-4c84-a4d8-5f2e3dbbb905",
    "username": "seb"
}

## Enable oauth2 on api, it will generate a provision key

`http POST http://localhost:8001/apis/accounts/plugins name=oauth2 config.enable_authorization_code=true config.scopes=xact config.mandatory_scope=true`

Output:

HTTP/1.1 201 Created
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Type: application/json; charset=utf-8
Date: Thu, 08 Dec 2016 09:45:53 GMT
Server: kong/0.9.5
Transfer-Encoding: chunked

{
    "api_id": "095eda07-302e-4fb3-8069-9042fa49c17c",
    "config": {
        "accept_http_if_already_terminated": false,
        "enable_authorization_code": true,
        "enable_client_credentials": false,
        "enable_implicit_grant": false,
        "enable_password_grant": false,
        "hide_credentials": false,
        "mandatory_scope": true,
        "provision_key": "f51d99d7e5514819890a1ef312d36c87",
        "scopes": [
            "xact"
        ],
        "token_expiration": 7200
    },
    "created_at": 1481190354000,
    "enabled": true,
    "id": "9175b558-c2c9-454d-bcb5-56b88a9a2bdf",
    "name": "oauth2"
}

## Create application (for a specific customer), it will generate an id and secret

`http POST http://127.0.0.1:8001/consumers/seb/oauth2/ name=XactMobile redirect_uri=https://dbpgo.herokuapp.com`

Output:

HTTP/1.1 201 Created
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Type: application/json; charset=utf-8
Date: Thu, 08 Dec 2016 09:48:12 GMT
Server: kong/0.9.5
Transfer-Encoding: chunked

{
    "client_id": "4e53cd16a3e04fe2bd572eb94937517c",
    "client_secret": "1eba41920f66423da3df4efe6a533e72",
    "consumer_id": "5578665d-0db0-4c84-a4d8-5f2e3dbbb905",
    "created_at": 1481190492000,
    "id": "1f3bc2e4-6d05-4226-b462-5c3d85f95ed8",
    "name": "XactMobile",
    "redirect_uri": [
        "https://dbpgo.herokuapp.com"
    ]
}

# Consent App

Install and deploy CONSENT app as written above (beginning of README file)

Run the consent app by launching a browser and type:

`http://localhost:<port>`

where port is by default 3000

The consent app will only provide an access code.

It is then up to the client application to request a token.

# Generate an access token:

`http https://127.0.0.1:8443/accounts/oauth2/token \
     grant_type=authorization_code \
     client_id=4e53cd16a3e04fe2bd572eb94937517c \
     client_secret=1eba41920f66423da3df4efe6a533e72 \
     redirect_uri=https://dbpgo.herokuapp.com \
     code=e2dbaaa0912c4e04a6df2b9d56bd48e5 --verify=NO`

or

curl https://127.0.0.1:8443/accounts/oauth2/token \
      -d "grant_type=authorization_code" \
      -d "client_id=4e53cd16a3e04fe2bd572eb94937517c" \
      -d "client_secret=1eba41920f66423da3df4efe6a533e72" \
      -d "redirect_uri=https://dbpgo.herokuapp.com" \
      -d "code=e2dbaaa0912c4e04a6df2b9d56bd48e5" --insecure

Output:

{
  "refresh_token":"b8ebca94b1d54824ac02edf8dd7e48c8",
  "token_type":"bearer",
  "access_token":"fa11f165785844d5b05234262f8525a0",
  "expires_in":7200
}

## To access the API:

`http http://localhost:8000/accounts Authorization:"Bearer fa11f165785844d5b05234262f8525a0"`
