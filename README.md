MDNote
===

A simple cloud notepad, nothing else...

[Let's make a note!](https://mdnote.int64ago.org)

## How to run

### Node
 - `npm i`
 - `MONGODB_URI=<MONGODB_URI> node app.js`

### Docker
```bash
docker run -d -e MONGODB_URI=<MONGODB_URI> \
-p 80:3000 \
int64ago/mdnote
```
