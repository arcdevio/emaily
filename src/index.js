'use strict';

const TextLine = require('./template/text-line.js');
const HtmlLine = require('./template/html-line.js');
const Html = require('./template/html.js');
const Text = require('./template/text.js');
const Raw = require('./raw.js');
const Aws = require('aws-sdk');

const SPLIT = /\s+|,|\s+/;

module.exports = class Emaily {

    constructor (data) {
        data = data || {};

        data.region = data.region || 'us-west-2';
        data.apiVersion = data.apiVersion || '2019-09-27';

        if (data.credentials instanceof Object) {
            data.credentials = new Aws.Credentials(data.credentials.id, data.credentials.secret);
        }

        this.ses = new Aws.SESV2(data);
    }

    async template (data) {
        data = data || {};

        if (!data.$name) throw new Error('Emaily.template - requires $name');
        if (!data.$byName) throw new Error('Emaily.template - requires $byName');
        if (!data.$domain) throw new Error('Emaily.template - requires $domain');
        if (!data.$byDomain) throw new Error('Emaily.template - requires $byDomain');

        const textLines = [];
        const htmlLines = [];

        const csvHead = [];
        const csvLine = [];

    	for (const name in data) {
    		if (name.charAt(0) !== '$') {
                const value = data[name];
    			htmlLines.push(HtmlLine(name, value));
    			textLines.push(TextLine(name, value));
                csvHead.push(name);
                csvLine.push(value);
    		}
    	}

        const text = Text(data, textLines);
        const html = Html(data, htmlLines);
        const csv = `${csvHead.join(',')}\n"${csvLine.join('","')}"`;

        return { text, html, csv };
    }

    async send (data) {
        const raw = Raw(data);

        const options = {
            Content: { Raw: { Data: Buffer.from(raw) } },
            Destination: {
                ToAddresses: typeof data.to === 'string' ? [data.to] : data.to,
                CcAddresses: typeof data.cc === 'string' ? [data.cc] : data.cc,
                BccAddresses: typeof data.bcc === 'string' ? [data.bcc] : data.bcc,
            },
            FromEmailAddress: data.from,
            ReplyToAddresses: typeof data.reply === 'string' ? [data.reply] : data.reply
        };

    	const result = this.ses.sendEmail(options).promise();
        return result;
    }

}
