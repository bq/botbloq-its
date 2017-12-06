# Botbloq-its
Intelligent tutoring system for Botbloq


## Installing

First install npm and node.js. Then:

```bash
$ npm install
```
Second install and run mongodb with this guide:
<https://docs.mongodb.com/manual/installation/>

Create base config.json file in app/res/config/config.json:
```bash
{
    "env": "local",

    "port": 8000,

    "mongo": {
        "uri": "mongodb://127.0.0.1:27017/bitbloq",
        "options": {
            "db": {
                "safe": true
            }
        }
    },
   "host": "http://127.0.0.1:8000/botbloq/v1/its",


    "myNumber": 2
}
```

## Stability

The current stable branch is **master**.


## Run

```bash
$ npm start
```
or
```bash
$ node index.js
```
Note: while using npm start the application refresh itself (using node library supervisor), so you don't need to stop the server in order to see the changes you've made to the code.
