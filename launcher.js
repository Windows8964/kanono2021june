let server = require("./server/main.js");
let config = require("./server/config.json");
if (config.openClient) {
    const open = require("open");
    open("http://localhost:" + config.port);
};