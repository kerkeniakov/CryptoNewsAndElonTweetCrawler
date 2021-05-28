var fs = require("fs");
var fetch = require("node-fetch");
var lastArticle = fs.readFileSync("lastArticle").toString();
var lastTweet = fs.readFileSync("lastTweet").toString();
describe('Crawler', function () {
    it('1. Navigating to ' + siteurl, function () {
        browser.get(siteurl);
    });
    it('2. checking crypto news', function () {
        element(by.xpath('(//div[@class="textDiv"]//a)[4]')).getText().then(function (text) {
            element(by.xpath('(//div[@class="textDiv"]//a)[4]')).getAttribute('href').then(function(href){
                console.log(`Latest article published is "${text}"`)
                if (lastArticle !== text) {
                    fs.writeFile('lastArticle', text, function (err) {
                        if (err) throw err;
                        console.log('DETECTED NEW ARTICLE!!! Replacing article name in file!');
                    });
                    var articleText = "<!channel> NEW CRYPTO ARTICLE " + text+ "\n" +`${href}`
                    var body = { "text": `${articleText} ` };
                    fetch(process.env.slack, {
                        method: 'post',
                        body: JSON.stringify(body),
                        headers: { 'Content-Type': 'application/json' },
                    })
                    fetch(process.env.teams, {
                        method: 'post',
                        body: JSON.stringify(body),
                        headers: { 'Content-Type': 'application/json' },
                    })
                    
                }
            })
        });
    })
    it('3. Navigating to daddy elon', function () {
        browser.get(process.env.daddyTwitter)
        browser.wait(EC.visibilityOf(element(by.xpath('(//div[@lang="en"])[1]'))), 10000);
        element(by.xpath('(//div[@lang="en"])[1]')).getText().then(function (text) {
            console.log(`Daddy Elon's last tweet is "${text}"`);
            console.log('checking if elons tweet contains word doge : ' + /doge/.test(text));
            if (lastTweet !== text) {
                fs.writeFile('lastTweet', text, function (err) {
                    if (err) throw err;
                    console.log('DETECTED NEW TWEET!!! Replacing Elon\'s last tweet in file!');
                });
                var tweetText = "<!channel> NEW TWEET FROM DADDY ELON " + text 
                var body = { "text": `${tweetText} ` };
                fetch(process.env.slack, {
                    method: 'post',
                    body: JSON.stringify(body),
                    headers: { 'Content-Type': 'application/json' },
                })
                fetch(process.env.teams, {
                    method: 'post',
                    body: JSON.stringify(body),
                    headers: { 'Content-Type': 'application/json' },
                })
            }
            if (/doge/.test(text) === true) {
                // push to api?
            }
        })
    });
});
