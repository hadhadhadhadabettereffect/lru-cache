# LRU Cache
LRU Cache object constructor

## usage
```javascript
var capacity = 10;
var cacheObj = new LRUCache(capacity);
cacheObj.put("keyA", 33);
var a = cacheObj.get("keyA");
console.log(a); // 33
```

## running tests
* using [tape](https://github.com/substack/tape) for tests
* `$ npm install` to install dependencies
* `$ npm test` to run tests