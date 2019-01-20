Install nvm and node v11.6 if not installed
```
nvm --version # to check if nvm is not installed
# if nvm is not installed run this else skip
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

nvm install 11.6
nvm use
npm i -g yarn
yarn install
```


To run the typescript and server in watch node <br>
Both are continuous command will need to be run in different terminal
```
npm run watch-ts
npm run watch-node
```

To compile typescript code once
```
npm run tsc
```

To run server once the build is done manually or automatically
```
npm run serve
```