var test = require("tape");
var tapSpec = require("tap-spec");
var LRUCache = require("./LRUCache");

test.createStream()
    .pipe(tapSpec())
    .pipe(process.stdout);

test("LRUCache tests", function (t) {
    t.plan(3);
    t.test("capacity property value", capacityTests);
    t.test("history tests", historyTests);
    t.test("value storage tests", valueTests);
});

function capacityTests(t) {
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
    for (var i = 0; i < 10; cache.put("k" + i, i++));
    t.equal(cache.items.size, 5,
        "lruCache objects will not store values beyond their capacities");

    cache.capacity = 2;
    t.equal(cache.items.size, 2,
        "the number of stored values reduced when capacity is lowered");
}

function historyTests(t) {
    t.plan(7);
    var cap = 4;
    var cache = new LRUCache(cap);

    for (var i = 0; i < cap; cache.put(`${i}`, i++));
    t.equal(cache.rootNode.next.key, "0",
        "item closest to root node should be least recently used");

    cache.put(`${cap}`, cap);
    t.false(cache.items.has("0"),
        "least recently used item will be removed when capacity exceeded");
    t.equal(cache.rootNode.next.key, "1",
        "the item after the previous lru will become the lru after removal");
    t.equal(cache.tailNode.prev.key, `${cap}`,
        "newly added items are set as most recent");

    cache.get("1");
    t.equal(cache.tailNode.prev.key, "1",
        "cache.get(key) sets key as most recent");
    t.equal(cache.rootNode.next.key, "2",
        "if an item is moved to be most recent, items once after it shift down");

    cache.put("3", 0);
    t.equal(cache.tailNode.prev.key, "3",
        "cache.put(key) sets key as most recent");
}

function valueTests(t) {
    t.plan(4);
    var cache = new LRUCache(5);
    var obj = { x: 0 };
    var arr = [];

    cache.put("obj", obj);
    cache.put("arr", arr);

    obj.x = 9;
    arr.push(9);

    t.equal(cache.get("arr").length, 0,
        "if cache.freezeValues, cached arrays are copied");
    t.equal(cache.get("obj").x, 0,
        "if cache.freezeValues, cached objects are copied");

    cache.freezeValues = false;
    cache.put("obj", obj);
    cache.put("arr", arr);

    obj.x = 22;
    arr.push(22);

    t.equal(cache.get("arr").length, 2,
        "if !cache.freezeValues, cached arrays are refs");
    t.equal(cache.get("obj").x, 22,
        "if !cache.freezeValues, cached objects are refs");
}