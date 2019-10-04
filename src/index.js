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
        data.apiVersion = data.apiVersion || '2010-12-01';

        if (data.credentials && data.credentials.constructor === Object) {
            data.credentials = new Aws.Credentials(data.credentials.id, data.credentials.secret);
        }

        this.ses = new Aws.SES(data);
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
        const options = { RawMessage: { Data: Buffer.from(raw) } };
    	const result = this.ses.sendRawEmail(options).promise();
        return result;
    }

}
