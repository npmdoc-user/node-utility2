/*jslint
    bitwise: true,
    browser: true,
    maxerr: 8,
    maxlen: 96,
    node: true,
    nomen: true,
    regexp: true,
    stupid: true
*/
(function () {
    'use strict';
    var local;
    local = global.local;
    local.cronJob = function () {
        // cron every 1 minute
        if (local.cronTime.getUTCMinutes() % 2 === 0) {
            console.log('hello');
        }
    };
}());
