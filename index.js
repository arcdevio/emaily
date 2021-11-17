'use strict';

const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");
const { fromIni } = require("@aws-sdk/credential-provider-ini");
const TextLine = require('./template/text-line.js');
const HtmlLine = require('./template/html-line.js');
const Html = require('./template/html.js');
const Text = require('./template/text.js');
const Raw = require('./raw.js');

const SPLIT = /\s*,+\s*|\s+/;

module.exports = class Emaily {

    constructor (data) {
        data = data || {};

        data.region = data.region || 'us-west-2';
        data.apiVersion = data.apiVersion || '2019-09-27';

        if (data.accessKeyId && data.secretAccessKey) {
            data.credentials = { accessKeyId: data.accessKeyId, secretAccessKey: data.secretAccessKey };
            delete data.accessKeyId;
            delete data.secretAccessKey;
        } else if (data.profile) {
            data.credentials = fromIni({ profile: data.profile });
            delete data.profile;
        }

        this.client = new SESv2Client(data);
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
                const value = data[ name ];
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

    async send (options) {
        const data = { ...options };

        data.to = typeof data.to === 'string' ? data.to.split(SPLIT) : data.to;
        data.cc = typeof data.cc === 'string' ? data.cc.split(SPLIT) : data.cc;
        data.bcc = typeof data.bcc === 'string' ? data.bcc.split(SPLIT) : data.bcc;
        data.reply = typeof data.reply === 'string' ? data.reply.split(SPLIT) : data.reply;

        const raw = Raw(data);

        const command = new SendEmailCommand({
            Content: { Raw: { Data: Buffer.from(raw) } },
            Destination: {
                ToAddresses: data.to,
                CcAddresses: data.cc,
                BccAddresses: data.bcc,
            },
            FromEmailAddress: data.from,
            ReplyToAddresses: data.reply
        });

        return this.client.send(command);
    }

};
