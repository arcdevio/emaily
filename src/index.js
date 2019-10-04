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

    	for (const name in data) {
    		if (name.charAt(0) !== '$') {
    			htmlLines.push(HtmlLine(name, data[name]));
    			textLines.push(TextLine(name, data[name]));
    		}
    	}

        const text = Text(data, textLines);
        const html = Html(data, htmlLines);

        return { text, html };
    }

    async send (data) {
        // const { cc, bcc, to, from, text, html, reply, subject, attachments } = data || {};
        const raw = Raw(data);
        const options = { RawMessage: { Data: Buffer.from(raw) } };
    	const result = this.ses.sendRawEmail(options).promise();
        return result;
    }

}
