













































































































/*
example.js

this script will demo automated browser-tests with coverage (via electron and istanbul)

instruction
    1. save this script as example.js
    2. run the shell command:
        $ npm install electron-lite utility2 && \
            PATH="$(pwd)/node_modules/.bin:$PATH" \
            PORT=8081 \
            npm_config_mode_coverage=utility2 \
            node_modules/.bin/utility2 test example.js
    3. view test-report in ./tmp/build/test-report.html
    4. view coverage in ./tmp/build/coverage.html/index.html
*/



/* istanbul instrument in package utility2 */
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



    // run shared js-env code - pre-init
    (function () {
        // init local
        local = {};
        // init modeJs
        local.modeJs = (function () {
            try {
                return typeof navigator.userAgent === 'string' &&
                    typeof document.querySelector('body') === 'object' &&
                    typeof XMLHttpRequest.prototype.open === 'function' &&
                    'browser';
            } catch (errorCaughtBrowser) {
                return module.exports &&
                    typeof process.versions.node === 'string' &&
                    typeof require('http').createServer === 'function' &&
                    'node';
            }
        }());
        // init global
        local.global = local.modeJs === 'browser'
            ? window
            : global;
        // init utility2_rollup
        local = local.global.utility2_rollup || (local.modeJs === 'browser'
            ? window.utility2
            : global.utility2_moduleExports);
        // export local
        local.global.local = local;
        // run test-server
        local.testRunServer(local);
        // init assets
        local.assetsDict['/assets.hello'] = 'hello';
    }());
    switch (local.modeJs) {



    // run browser js-env code - function
    case 'browser':
        local.testCase_ajax_200 = function (options, onError) {
        /*
         * this function will test ajax's "200 ok" handling-behavior
         */
            options = {};
            // test ajax-path 'assets.hello'
            local.ajax({ url: 'assets.hello' }, function (error, xhr) {
                local.tryCatchOnError(function () {
                    // validate no error occurred
                    local.assert(!error, error);
                    // validate data
                    options.data = xhr.responseText;
                    local.assert(options.data === 'hello', options.data);
                    onError();
                }, onError);
            });
        };
        local.testCase_ajax_404 = function (options, onError) {
        /*
         * this function will test ajax's "404 not found" handling-behavior
         */
            options = {};
            // test ajax-path '/undefined'
            local.ajax({ url: '/undefined' }, function (error) {
                local.tryCatchOnError(function () {
                    // validate error occurred
                    local.assert(error, error);
                    options.statusCode = error.statusCode;
                    // validate 404 http statusCode
                    local.assert(options.statusCode === 404, options.statusCode);
                    onError();
                }, onError);
            });
        };
        break;



    // run node js-env code - function
    case 'node':
        local.testCase_webpage_default = function (options, onError) {
        /*
         * this function will test the webpage's default handling-behavior
         */
            options = { modeCoverageMerge: true, url: local.serverLocalHost + '?modeTest=1' };
            local.browserTest(options, onError);
        };
        break;
    }
    switch (local.modeJs) {



    // post-init
    /* istanbul ignore next */
    // run browser js-env code - post-init
    case 'browser':
        local.testRunBrowser = function (event) {
            switch (event.currentTarget.id) {
            case 'testRunButton1':
                // run tests
                local.modeTest = true;
                local.testRunDefault(local);
                break;
            default:
                if (location.href.indexOf("modeTest=") >= 0) {
                    return;
                }
                // reset stdout
                document.querySelector('#outputTextareaStdout1').value = '';
                if (!document.querySelector('#inputTextarea1')) {
                    return;
                }
                // try to JSON.stringify #inputTextarea1
                try {
                    document.querySelector('#outputPreJsonStringify1').textContent = '';
                    document.querySelector('#outputPreJsonStringify1').textContent =
                        local.jsonStringifyOrdered(
                            JSON.parse(document.querySelector('#inputTextarea1').value),
                            null,
                            4
                        );
                } catch (ignore) {
                }
                // jslint #inputTextarea1
                local.jslint.errorText = '';
                if (document.querySelector('#inputTextarea1').value.indexOf('/*jslint') >= 0) {
                    local.jslint.jslintAndPrint(
                        document.querySelector('#inputTextarea1').value,
                        'inputTextarea1.js'
                    );
                }
                document.querySelector('#outputPreJslint1').textContent =
                    local.jslint.errorText
                    .replace((/\u001b\[\d+m/g), '')
                    .trim();
                // try to cleanup __coverage__
                try {
                    delete local.global.__coverage__['/inputTextarea1.js'];
                } catch (ignore) {
                }
                // try to cover and eval input-code
                try {
                    /*jslint evil: true*/
                    document.querySelector('#outputTextareaIstanbul1').value = '';
                    document.querySelector('#outputTextareaIstanbul1').value =
                        local.istanbul.instrumentSync(
                            document.querySelector('#inputTextarea1').value,
                            '/inputTextarea1.js'
                        );
                    eval(document.querySelector('#outputTextareaIstanbul1').value);
                    document.querySelector('.istanbulCoverageDiv').innerHTML =
                        local.istanbul.coverageReportCreate({
                            coverage: window.__coverage__
                        });
                } catch (errorCaught) {
                    console.error(errorCaught.stack);
                }
                // scroll stdout to bottom
                document.querySelector('#outputTextareaStdout1').scrollTop =
                    document.querySelector('#outputTextareaStdout1').scrollHeight;
            }
        };
        // log stderr and stdout to #outputTextareaStdout1
        ['error', 'log'].forEach(function (key) {
            console['_' + key] = console[key];
            console[key] = function () {
                console['_' + key].apply(console, arguments);
                (document.querySelector('#outputTextareaStdout1') || { value: '' }).value +=
                    Array.from(arguments).map(function (arg) {
                        return typeof arg === 'string'
                            ? arg
                            : JSON.stringify(arg, null, 4);
                    }).join(' ') + '\n';
            };
        });
        // init event-handling
        ['change', 'click', 'keyup'].forEach(function (event) {
            Array.from(document.querySelectorAll('.on' + event)).forEach(function (element) {
                element.addEventListener(event, local.testRunBrowser);
            });
        });
        // run tests
        local.testRunBrowser({ currentTarget: { id: 'default' } });
        break;



    /* istanbul ignore next */
    // run node js-env code - post-init
    case 'node':
        // export local
        module.exports = local;
        // require modules
        local.fs = require('fs');
        local.http = require('http');
        local.url = require('url');
        // init assets
        local.assetsDict = local.assetsDict || {};
        /* jslint-ignore-begin */
        local.assetsDict['/assets.index.template.html'] = '\
<!doctype html>\n\
<html lang="en">\n\
<head>\n\
<meta charset="UTF-8">\n\
<meta name="viewport" content="width=device-width, initial-scale=1">\n\
<title>{{env.npm_package_nameAlias}} v{{env.npm_package_version}}</title>\n\
<style>\n\
/*csslint\n\
    box-sizing: false,\n\
    universal-selector: false\n\
*/\n\
* {\n\
    box-sizing: border-box;\n\
}\n\
body {\n\
    background: #dde;\n\
    font-family: Arial, Helvetica, sans-serif;\n\
    margin: 2rem;\n\
}\n\
body > * {\n\
    margin-bottom: 1rem;\n\
}\n\
</style>\n\
<style>\n\
/*csslint\n\
    ids: false,\n\
*/\n\
#outputPreJslint1 {\n\
    color: #d00;\n\
}\n\
textarea {\n\
    font-family: monospace;\n\
    height: 15rem;\n\
    width: 100%;\n\
}\n\
textarea[readonly] {\n\
    background: #ddd;\n\
}\n\
</style>\n\
</head>\n\
<body>\n\
\n\
    <div id="ajaxProgressDiv1" style="background: #d00; height: 2px; left: 0; margin: 0; padding: 0; position: fixed; top: 0; transition: background 0.5s, width 1.5s; width: 25%;"></div>\n\
\n\
    <h1>\n\
\n\
        <a\n\
            {{#if env.npm_package_homepage}}\n\
            href="{{env.npm_package_homepage}}"\n\
            {{/if env.npm_package_homepage}}\n\
            target="_blank"\n\
        >\n\
\n\
            {{env.npm_package_nameAlias}} v{{env.npm_package_version}}\n\
\n\
        </a>\n\
\n\
    </h1>\n\
    <h3>{{env.npm_package_description}}</h3>\n\
\n\
    <h4><a download href="assets.app.js">download standalone app</a></h4>\n\
\n\
\n\
    <label>edit or paste script below to cover and test</label>\n\
<textarea class="onkeyup" id="inputTextarea1">\n\
// remove comment below to disable jslint\n\
/*jslint\n\
    browser: true,\n\
    es6: true\n\
*/\n\
/*global window*/\n\
(function () {\n\
    "use strict";\n\
    var testCaseDict;\n\
    testCaseDict = {};\n\
    testCaseDict.modeTest = true;\n\
\n\
    // comment this testCase to disable the failed assertion demo\n\
    testCaseDict.testCase_failed_assertion_demo = function (\n\
        options,\n\
        onError\n\
    ) {\n\
    /*\n\
     * this function will demo a failed assertion test\n\
     */\n\
        // jslint-hack\n\
        window.utility2.nop(options);\n\
        window.utility2.assert(false, "this is a failed assertion demo");\n\
        onError();\n\
    };\n\
\n\
    testCaseDict.testCase_passed_ajax_demo = function (options, onError) {\n\
    /*\n\
     * this function will demo a passed ajax test\n\
     */\n\
        var data;\n\
        options = {url: "/"};\n\
        // test ajax request for main-page "/"\n\
        window.utility2.ajax(options, function (error, xhr) {\n\
            try {\n\
                // validate no error occurred\n\
                window.utility2.assert(!error, error);\n\
                // validate "200 ok" status\n\
                window.utility2.assert(xhr.statusCode === 200, xhr.statusCode);\n\
                // validate non-empty data\n\
                data = xhr.responseText;\n\
                window.utility2.assert(data && data.length > 0, data);\n\
                onError();\n\
            } catch (errorCaught) {\n\
                onError(errorCaught);\n\
            }\n\
        });\n\
    };\n\
\n\
    window.utility2.testRunDefault(testCaseDict);\n\
}());\n\
</textarea>\n\
    <pre id="outputPreJsonStringify1"></pre>\n\
    <pre id="outputPreJslint1"></pre>\n\
    <label>instrumented-code</label>\n\
    <textarea id="outputTextareaIstanbul1" readonly></textarea>\n\
    <label>stderr and stdout</label>\n\
    <textarea id="outputTextareaStdout1" readonly></textarea>\n\
    <button class="onclick" id="testRunButton1">run internal test</button><br>\n\
    <div id="testReportDiv1" style="display: none;"></div>\n\
    <h2>coverage-report</h2>\n\
    <div class="istanbulCoverageDiv"></div>\n\
\n\
    {{#if isRollup}}\n\
    <script src="assets.app.js"></script>\n\
    {{#unless isRollup}}\n\
\n\
    <script src="assets.utility2.lib.istanbul.js"></script>\n\
    <script src="assets.utility2.lib.jslint.js"></script>\n\
    <script src="assets.utility2.lib.db.js"></script>\n\
    <script src="assets.utility2.lib.sjcl.js"></script>\n\
    <script src="assets.utility2.lib.uglifyjs.js"></script>\n\
    <script src="assets.utility2.js"></script>\n\
    <script src="jsonp.utility2._stateInit?callback=window.utility2._stateInit"></script>\n\
    <script>window.utility2.onResetBefore.counter += 1;</script>\n\
    <script src="assets.example.js"></script>\n\
    <script src="assets.test.js"></script>\n\
    <script>window.utility2.onResetBefore();</script>\n\
\n\
    {{/if isRollup}}\n\
\n\
</body>\n\
</html>\n\
';
        /* jslint-ignore-end */
        if (local.templateRender) {
            local.assetsDict['/'] = local.templateRender(
                local.assetsDict['/assets.index.template.html'],
                {
                    env: local.objectSetDefault(local.env, {
                        npm_package_description: 'example module',
                        npm_package_nameAlias: 'example',
                        npm_package_version: '0.0.1'
                    })
                }
            );
        } else {
            local.assetsDict['/'] = local.assetsDict['/assets.index.template.html']
                .replace((/\{\{env\.(\w+?)\}\}/g), function (match0, match1) {
                    // jslint-hack
                    String(match0);
                    switch (match1) {
                    case 'npm_package_description':
                        return 'example module';
                    case 'npm_package_nameAlias':
                        return 'example';
                    case 'npm_package_version':
                        return '0.0.1';
                    }
                });
        }
        // run the cli
        if (local.global.utility2_rollup || module !== require.main) {
            break;
        }
        local.assetsDict['/assets.example.js'] = local.assetsDict['/assets.example.js'] ||
            local.fs.readFileSync(__filename, 'utf8');
        local.assetsDict['/assets.utility2.rollup.js'] =
            local.assetsDict['/assets.utility2.rollup.js'] || local.fs.readFileSync(
                local.utility2.__dirname + '/lib.utility2.js',
                'utf8'
            ).replace((/^#!/), '//');
        local.assetsDict['/favicon.ico'] = local.assetsDict['/favicon.ico'] || '';
        // if $npm_config_timeout_exit exists,
        // then exit this process after $npm_config_timeout_exit ms
        if (Number(process.env.npm_config_timeout_exit)) {
            setTimeout(process.exit, Number(process.env.npm_config_timeout_exit));
        }
        // start server
        if (local.global.utility2_serverHttp1) {
            break;
        }
        process.env.PORT = process.env.PORT || '8081';
        console.log('server starting on port ' + process.env.PORT);
        local.http.createServer(function (request, response) {
            request.urlParsed = local.url.parse(request.url);
            if (local.assetsDict[request.urlParsed.pathname] !== undefined) {
                response.end(local.assetsDict[request.urlParsed.pathname]);
                return;
            }
            response.statusCode = 404;
            response.end();
        }).listen(process.env.PORT);
        break;
    }
}());