const expect        = require('chai').expect;
const IPHistoryData = require('../settings/iphistory/iphistory.data.js').IPHistoryData;


describe('IPHistoryData.parseUserAgent', function() {
    // TODO: add more user agent test strings
    const parse = IPHistoryData.parseUserAgent;
    const common = [
        {
            ua     : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:48.0) Gecko/20100101 Firefox/48.0',
            name   : 'Firefox',
            version: '48.0',
        },
        {
            ua     : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/601.6.17 (KHTML, like Gecko) Version/9.1.1 Safari/601.6.17',
            name   : 'Safari',
            version: '9.1.1',
        },
        {
            ua     : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36',
            name   : 'Chrome',
            version: '51.0.2704.106',
        },
        {
            ua     : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
            name   : 'Edge',
            version: '12.246',
        },
        {
            ua     : 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko',
            name   : 'IE',
            version: '11.0',
        },
        {
            ua     : 'Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko',
            name   : 'IE',
            version: '11',
        },
        {
            ua     : 'Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16',
            name   : 'Opera',
            version: '9.80',
        },
        {
            ua     : 'Mozilla/5.0 (Windows NT 5.2; RW; rv:7.0a1) Gecko/20091211 SeaMonkey/9.23a1pre',
            name   : 'SeaMonkey',
            version: '9.23a1pre',
        },
    ];

    common.forEach(function(entry) {
        it('works for ' + entry.name, function() {
            const browser = IPHistoryData.parseUserAgent(entry.ua);
            expect(browser.name).to.equal(entry.name);
            expect(browser.version).to.equal(entry.version);
        });
    });

    it('returns null when userAgent is not parsable', function() {
        const ua = '--unparsable--';
        expect(parse(ua)).to.equal(null);
    });
});


describe('IPHistoryData.parse', function() {
    const parse = IPHistoryData.parse;

    it('parses activity objects correctly', function() {
        const activity = {
            environment: '12-Jul-16 06:38:09GMT IP=211.24.127.133 IP_COUNTRY=MY User_AGENT=Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:48.0) Gecko/20100101 Firefox/48.0 LANG=EN',
            time       : 1468305490,
            status     : 1,
            action     : 'login',
        };
        const res = parse(activity);
        expect(res).to.deep.equal({
            time   : 1468305490,
            success: true,
            action : 'login',
            ip_addr: '211.24.127.133',
            browser: {
                name   : 'Firefox',
                version: '48.0',
            },
        });
    });

    it('returns correct .success attribute', function() {
        const activity = {
            environment: '13-Jul-16 05:13:29GMT IP=211.24.127.133 IP_COUNTRY=MY User_AGENT=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/601.6.17 (KHTML, like Gecko) Version/9.1.1 Safari/601.6.17 LANG=EN',
            time       : 1468386810,
            status     : 0,
            action     : 'login',
        };
        const res = parse(activity);
        expect(res.success).to.equal(false);
    });
});


describe('IPHistoryData.calls', function() {
    it('calls the callback when .msg_type === "login_history"', function() {
        const response = {
            msg_type: 'login_history',
        };
        let called = false;
        const handler = IPHistoryData.calls(function(res) {
            called = true;
            expect(res).to.deep.equal(response);
        });
        handler({ data: JSON.stringify(response) });
        expect(called).to.equal(true);
    });

    it('does nothing otherwise', function() {
        [
            { msg_type: 'oauth' },
            { msg_type: null },
            null,
        ].forEach(function(response) {
            let called = false;
            const handler = IPHistoryData.calls(function() {
                called = true;
            });
            handler({ data: JSON.stringify(response) });
            expect(called).to.equal(false);
        });
    });
});
