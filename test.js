// Compatibility shim to work both in browers and node.js
// Based on on https://gist.github.com/rpflorence/1198466

var getGRVCounter;
var resetGRVCounter;
var consoleLog;
var consoleError;

if (typeof module !== "undefined" && module.exports) { // Node.js
  var crypto = require("crypto");
  randomInt = require("./randomInt.js");

  crypto.randomBytes = function() {
    var originalRandomBytes = crypto.randomBytes.bind(window.crypto);
    var counter_ = 0;
    var getRandomValues = function(arr) { counter_ += 1; return originalRandomBytes(arr); }
    getRandomValues.resetCounter = function() {counter_ = 0; }
    getRandomValues.getCounter = function() { return counter_; }
    return getRandomValues;
  }();

  getGRVCounter = crypto.randomBytes.getCounter;
  resetGRVCounter = crypto.randomBytes.resetCounter;
  consoleLog = console.log.bind(console);
  consoleError = console.error.bind(console);

} else { // Browser

  window.crypto.getRandomValues = function() {
    var originalGetRandomValues = window.crypto.getRandomValues.bind(window.crypto);
    var counter_ = 0;
    var getRandomValues = function(arr) { counter_ += 1; return originalGetRandomValues(arr); }
    getRandomValues.resetCounter = function() {counter_ = 0; }
    getRandomValues.getCounter = function() { return counter_; }
    return getRandomValues;
  }();

  getGRVCounter = window.crypto.getRandomValues.getCounter;
  resetGRVCounter = window.crypto.getRandomValues.resetCounter;
  consoleLog = function() {
    var div = document.createElement("div");
    div.classList.add("console", "log");
    console.log(arguments);
    div.textContent = [].slice.call(arguments).join(" ");
    document.body.appendChild(div);
  };
  consoleError = function() {
    var div = document.createElement("div");
    div.classList.add("console", "error");
    console.log(arguments);
    div.textContent = [].slice.call(arguments).join(" ");
    document.body.appendChild(div);
  };
}

// Testing definitions

MAX_JS_PRECISE_INT = 9007199254740992;


function check(testName, condition, passMessage, errorMessage) {
  if (condition) {
    consoleLog("PASSED", testName, "(" + passMessage + ")");
  } else {
    consoleError("FAILED", testName, "(" + errorMessage + ")");
  }
}


/// Tests

var val = randomInt.below(1000);
check(
  "Generates number in requested range",
  (0 <= val) && (val < 1000),
  "(0 <= " + val + ") && (" + val + " < 1000)",
  "Value outside of range: " + val
);

var val = randomInt.below(1000000000);
check(
  "Generates values over 256",
  (val > 256),
  val + " > 256",
  "Value under 256: " + val
);

var val1 = randomInt.below(1000000000);
var val2 = randomInt.below(1000000000);
check(
  "Nondeterministic",
  (val1 != val2),
  "(" + val1 + " != " + val2 + ")",
  "Generates the same value twice: " + val1 + ", " + val2
);


resetGRVCounter();
var total = 0;
for (var i = 0; i < 1000; i++) {
  total += randomInt.below(2);
}
check(
  "Coin toss total",
  (400 <= total) && (total < 600),
  "(400 <= " + total + ") && (" + total + " < 600)",
  "Outside expected range: " + total + ". This only has a chance 0.000000023% chance of happening."
);
// Technically checks an implementation detail, but it's good sanity check.
check(
  "Recursion frequency, uniform range is 1/1",
  getGRVCounter() === 1000,
  "" + getGRVCounter() + " === 1000",
  "Called this often instead: " + getGRVCounter()
);


resetGRVCounter();
for (var i = 0; i < 1000; i++) {
  randomInt.below(MAX_JS_PRECISE_INT / 2 + 1);
}
check(
  "Recursion frequency, uniform range is 1/2",
  (1800 <= getGRVCounter()) && (getGRVCounter() < 2200),
  "(1800 <= " + getGRVCounter() + ") && (" + getGRVCounter() + " < 2200)",
  "Called this often instead: " + getGRVCounter()
);


resetGRVCounter();
for (var i = 0; i < 1000; i++) {
  randomInt.below(MAX_JS_PRECISE_INT * 2 / 3);
}
check(
  "Recursion frequency, uniform range is 2/3",
  (1300 <= getGRVCounter()) && (getGRVCounter() < 1700),
  "(1300 <= " + getGRVCounter() + ") && (" + getGRVCounter() + " < 1700)",
  "Called this often instead: " + getGRVCounter()
);

resetGRVCounter();
for (var i = 0; i < 1000; i++) {
  randomInt.below(MAX_JS_PRECISE_INT * 3 / 8);
}
check(
  "Recursion frequency, uniform range is 3/4",
  (1233 <= getGRVCounter()) && (getGRVCounter() < 1433),
  "(1233 <= " + getGRVCounter() + ") && (" + getGRVCounter() + " < 1433)",
  "Called this often instead: " + getGRVCounter()
);


/*
 * TODO:
 * Trigger all warning/error messages.
 */
