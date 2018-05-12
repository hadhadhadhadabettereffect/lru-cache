const defaultCapacity = 3;

var capacityValues = new WeakMap();

/**
 * Least-recently used cache object constructor
 * @param {number} [capacity] - max number of stored values
 */
module.exports = function LRUCache(capacity) {
    // keyed collection of CacheItem objects
    this.items = new Map();
    // first/last bookends for finding oldest/inserting newest
    this.rootNode = new CacheItem("root", 0);
    this.tailNode = new CacheItem("tail", 0);
    this.rootNode.next = this.tailNode;
    this.tailNode.prev = this.rootNode;

    capacityValues.set(this, defaultCapacity);
    this.capacity = capacity || defaultCapacity;
};

LRUCache.prototype.constructor = LRUCache;

/**
 * capacity property getter/setter
 */
Object.defineProperty(LRUCache.prototype, "capacity", {
    get: function () {
        return capacityValues.get(this);
    },
    /**lru-
     * @param {number} c - new max capacity
     */
    set: function (c) {
        // casting argument as int
        c >>>= 0;
        // ensure capacity is a positive number
        if (c < 1) c = 1;
        // if reducing capacity, remove cached items to match
        if (c < capacityValues.get(this)) {
            let items = this.items,
                rootNode = this.rootNode,
                oldest = rootNode.next;
            while (items.length > c) {
                items.delete(oldest.key);
                oldest = oldest.next;
                oldest.prev = rootNode;
                rootNode.next = oldest;
            }
        }
        capacityValues.set(this, c);
    }
});

/**
 * get stored value by its key, set key as most recently used
 * @param {string} key
 * @return {*} stored value if key exists, else returns null
 */
LRUCache.prototype.get = function (key) {
    if (this.items.has(key)) {
        // mark key as most recently used
        this.touch(key);
        return this.items.get(key).value;
    }
    return null;
};

/**
 * store cached value, set
 * @param {string} key
 * @param {*} value
 * @return null
 */
LRUCache.prototype.put = function (key, value) {
    let item;
    if (this.items.hasOwnProperty(key)) {
        item = this.items.get(key);
    } else {
        // reassign least-recently used new key
        // to avoid creating new objects unnecessarily
        // NOTE: if zero is allowed as a capacity size,
        // this should check to make sure rootNode.next != tailNode
        if (this.items.length === this.capacity) {
            item = this.rootNode.next;
            this.items.delete(item.key);
            item.key = key;
        } else {
            item = new CacheItem(key, value);
        }
        this.items.set(key, item);
    }
    item.value = value;
    this.touch(key);
    return null;
};

/**
 * set an item as most recently used
 * @param {string} key
 */
LRUCache.prototype.setMostRecent = function (key) {
    let item = this.items.get(key);
    // link item's prev and next to each other
    item.prev.next = item.next;
    item.next.prev = item.prev;
    // set item as last element
    item.prev = this.tailNode.prev;
    item.next = this.tailNode;
    this.tailNode.prev = item;
};

/**
 * constructor for cache value wrapper object
 * stores a value in addition to next/prev items for used history
 * @param {string} key
 * @param {*} value - stored value
 */
function CacheItem(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
}