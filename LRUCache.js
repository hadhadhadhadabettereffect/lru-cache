"use strict";

var capacityValues = new WeakMap();

/**
 * Least-recently used cache object constructor
 * @param {number} [capacity] - max number of stored values
 */
function LRUCache(capacity) {
    // keyed collection of CacheItem objects
    this.items = new Map();
    // first/last bookends for finding oldest/inserting newest
    this.rootNode = new CacheItem("root", 0);
    this.tailNode = new CacheItem("tail", 0);
    this.rootNode.next = this.tailNode;
    this.tailNode.prev = this.rootNode;

    capacityValues.set(this, this.defaultCapacity);
    this.capacity = capacity || this.defaultCapacity;
};

LRUCache.prototype = {
    defaultCapacity: 3
};

LRUCache.prototype.constructor = LRUCache;

/**
 * capacity property getter/setter
 */
Object.defineProperty(LRUCache.prototype, "capacity", {
    get: function () {
        return capacityValues.get(this);
    },
    /**
     * @param {number} c - new max capacity
     */
    set: function (c) {
        // casting argument as int
        c >>>= 0;
        // ensure capacity is a positive number
        if (c < 1) c = 1;
        // if reducing capacity, remove cached items to match
        if (c < capacityValues.get(this)) {
            var items = this.items;
            while (items.size > c) {
                this.removeLeastRecent();
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
        this.setMostRecent(key);
        return this.items.get(key).value;
    }
    return null;
};

/**
 * store cached value
 * @param {string} key
 * @param {*} value
 */
LRUCache.prototype.put = function (key, value) {
    if (this.items.hasOwnProperty(key)) {
        this.items.get(key).value = value;
        this.setMostRecent(key);
    } else {
        if (this.items.size === this.capacity)
            this.removeLeastRecent();
        createNewItem.call(this, key, value);
    }
};

LRUCache.prototype.removeLeastRecent = function () {
    let item = this.rootNode.next;
    this.rootNode.next = item.next;
    item.next.prev = this.rootNode;
    this.items.delete(item.key);
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
 * create a new cache value item and append set it as most recently used
 * @param {string} key
 * @param {*} value
 */
function createNewItem(key, value) {
    let item = new CacheItem(key, value);
    item.next = this.tailNode;
    item.prev = this.tailNode.prev;
    this.tailNode.prev.next = item;
    this.tailNode.prev = item;
    this.items.set(key, item);
}

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

module.exports = LRUCache;