
## typescript環境構築

```zsh
yarn init
yarn add ts-node --dev
yarn add typescript --dev
yarn add @types/node --dev
./node_modules/.bin/tsc --init
vi package.json

"scripts": {
"tsc": "tsc",
"ts-node": "ts-node"
}

touch index.ts

const hello = (name: string): void => console.log('Hello',name)
hello('Tarou')

yarn ts-node index.ts
```
