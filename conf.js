/**
 * Created by Gencho on 07.07.2020 ..
 */
var AllureReporter = require('jasmine-allure-reporter');
const shell = require('shelljs');
require('dotenv').config({ path: './.env' });
let SpecReporter = require('jasmine-spec-reporter').SpecReporter;
let DisplayProcessor = require('jasmine-spec-reporter').DisplayProcessor;
let HtmlReporter = require('protractor-beautiful-reporter');

time = function (flag) {
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).substr(-2);
    var day = ("0" + date.getDate()).substr(-2);
    var hour = ("0" + date.getHours()).substr(-2);
    var minutes = ("0" + date.getMinutes()).substr(-2);
    var seconds = ("0" + date.getSeconds()).substr(-2);
    if (flag === false) {
        return year + "-" + month + "-" + day + "--" + hour + "h" + minutes + "m" + seconds + "s";
    }
    return '' + "\x1b[33m" + year + "-" + month + "-" + day + "--" + hour + "h" + minutes + "m" + seconds + "s" + "\x1b[0m";
};
function getTime() {
    return "\x1b[35m" + time(flag = false) + "\x1b[0m";
}

function TimeProcessor(configuration) {
}
TimeProcessor.prototype = new DisplayProcessor();

TimeProcessor.prototype.displaySuite = function (suite, log) {
    return getTime() + ' - ' + log;
};

TimeProcessor.prototype.displaySuccessfulSpec = function (spec, log) {
    return getTime() + ' - ' + log;
};

TimeProcessor.prototype.displayFailedSpec = function (spec, log) {
    return getTime() + ' - ' + log;
};

TimeProcessor.prototype.displayPendingSpec = function (spec, log) {
    return getTime() + ' - ' + log;
};
var init = function (config) {
    var specs;
    for (var i = 3; i < process.argv.length; i++) {
        var match = process.argv[i].match(/^--params\.([^=]+)=(.*)$/);
        if (match)
            switch (match[1]) {
                case 'specs':
                    specs = match[2];
                    break;
                case 'browser':
                    config.capabilities.browserName = match[2];
                    if (match[2].toLowerCase() === 'firefox') {
                        config.capabilities.shardTestFiles = true;
                        config.capabilities.maxInstances = 1;
                        config.capabilities.browserName = 'firefox';
                        config.capabilities.trustAllSSLCertificates = true;
                        config.capabilities.acceptInsecureCerts = true;
                        config.capabilities.ACCEPT_SSL_CERTS = true;
                        config.capabilities.marionette = true;
                    }
                    if (match[2].toLowerCase() === 'chrome') {
                        config.capabilities.browserName = 'chrome';
                        config.capabilities.enableVideo = true;
                        config.capabilities.enableVNC = true;
                        config.capabilities.name = "Scraper Tests";
                        config.capabilities.enableLog = true;
                        config.capabilities.shardTestFiles = true;
                        config.capabilities.maxInstances = 1;
                        config.capabilities.chromeOptions = {
                            args:
                            ["--headless"]
                        };
                    }
                    if (match[2].toLowerCase() === 'ie') {
                        config.capabilities.browserName = 'internet explorer';
                        config.capabilities.shardTestFiles = true;
                        config.capabilities.maxInstances = 1;
                        config.capabilities.version = 11;
                        config.capabilities.acceptSslCerts = true;
                    }
            }

    }
    return config;
};
exports.config = (function () {
    return init({
        framework: 'jasmine2',
        seleniumAddress: process.env.seleniumAddress,
        specs: ['.TestCases/Login.js'],
        getPageTimeout: 10000,
        params: {},
        capabilities: {},
        suites: {
            crawler: './crawl.js',

        },
        jasmineNodeOpts: {
            print: function () {
            },
            showColors: true,
            includeStackTrace: true,
            defaultTimeoutInterval: 1244000

        },
        onPrepare: function () {
            browser.ignoreSynchronization = true;
            let cliBrowser;
            browser.getCapabilities().then((c) => {
                cliBrowser = c.get('browserName')
            });

            function getCLIBrowser() {
                if (cliBrowser == undefined)
                    setTimeout(1, 100);

                else {
                    return cliBrowser;
                }
            }
            if (browser.params.report === 'full') {
                console.log(time() + '\n' + 'Saving ' + '\x1b[32m' + 'FULL mode' + '\x1b[0m' + ' HTML report (all test cases will be saved in /CombinedReport folder)');
            }
            if (browser.params.report === 'split') {
                console.log(time() + '\n' + 'Saving ' + '\x1b[32m' + 'SPLIT mode' + '\x1b[0m' + ' HTML report (each test will generate its own angular report folder)');

            } else if (browser.params.report === null) {
                throw "No report parameter provided.Please provide --params.instance={@param} {@params=['stage','live','accept'] } ";
            }
            if (browser.params.instance === 'stage') {
                console.log(time() + '\n' + 'Loading ' + '\x1b[32m' + 'Stage' + '\x1b[0m' + ' Instance configurations!');
                browser.params.siteurl = process.env.stageUrl;
            } else if (browser.params.instance === 'accept') {
                console.log(time() + '\n' + 'Loading ' + '\x1b[32m' + 'Accept' + '\x1b[0m' + ' Instance configurations!');
                browser.params.siteurl = process.env.acceptUrl;
            } else if (browser.params.instance === 'live') {
                console.log(time() + '\n' + 'Loading ' + '\x1b[32m' + 'Live' + '\x1b[0m' + ' Instance configurations!');
                browser.params.siteurl = process.env.liveUrl;
                EC = protractor.ExpectedConditions;
            } else if (browser.params.instance == null) {
                throw "No instance parameter provided.Please provide --params.instance={@param} {@params=['stage','live','accept'] } ";
            } else if (browser.params.instance != 'accept' && browser.params.instance != 'stage' && browser.params.instance != 'live' && browser.params.instance != null) {
                throw "Unrecognised parameter. Valid parameters are stage/accept/live"
            }
            return global.browser.getProcessedConfig().then(function (config) {
                if (getCLIBrowser() == 'firefox') {
                    browser.params.browserNameCli = 'firefox';
                }
                if (getCLIBrowser() == 'internet explorer') {
                    browser.params.browserNameCli = 'internet explorer';
                }
                if (getCLIBrowser() == 'chrome') {
                    browser.params.browserNameCli = 'chrome';
                }
                browser.driver.manage().window().maximize();
                global.siteurl = browser.params.siteurl
            });
        },
        onComplete: () => {
            browser.close();
        },
    });
})();



