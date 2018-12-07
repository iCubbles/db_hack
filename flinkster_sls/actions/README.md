
## Create Action
```
wsk action create hello-cubbles hello.js
```

## Update Action

```
wsk action update  hello-cubbles hello.js
```

## Package Action
### create
```sh
$ npm install
$ 7z a -r action.zip
$ wsk action create packagedFunction --kind nodejs:6 action.zip
```

### update
```sh
$ 7z a -r action.zip && wsk action update packagedFunction --kind nodejs:6 action.zip
```
