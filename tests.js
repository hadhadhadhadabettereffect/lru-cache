const test = require("tape");
const tapSpec = require("tap-spec");
const LRUCache = require("./LRUCache");

test.createStream()
    .pipe(tapSpec())
    .pipe(process.stdout);

test("capacity property value", function (t) {
    t.plan(9);
    var cache = new LRUCache();

    t.equal(cache.capacity, cache.defaultCapacity,
        "if no arguments passed to constructor, capicity = defaultCapacity");

    cache.capacity = 5;
    t.equal(cache.capacity, 5,
        "cache.capacity property can be updated");

    cache.capacity = 0;
    t.equal(cache.capacity, 1,
        "minimum capacity is 1");

    cache.capacity = "17";
    t.equal(cache.capacity, 17,
        "if capacity is set with a string, it will be parsed as an int");

    cache.capacity = 3.6;
    t.equal(cache.capacity, 3,
        "if capacity is set with a float, it will get floored");

    cache.capacity = null;
    t.equal(cache.capacity, 1,
        "if capacity is set with a non-number, it will be set to 1");

    cache.capacity = Infinity;
    t.equal(cache.capacity, 1,
        "if capacity is set with an invalid number, it will be set to 1");

    cache.capacity = 5;
    for (let i = 0; i < 10; cache.put("k"+i, i++));
    t.equal(cache.items.size, 5,
        "lruCache objects will not store values beyond their capacities");

    cache.capacity = 2;
    t.equal(cache.items.size, 2,
        "the number of stored values reduced when capacity is lowered");
});