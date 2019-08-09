'use strict';

const Aws = require('aws-sdk');
const Text = require('./text.js');
const Html = require('./html.js');

const SPLIT = /\s+|,|\s+/;

module.exports = class Emaily {

    constructor (data) {
        data = data || {};

        data.region = data.region || 'us-west-2';
        data.apiVersion = data.apiVersion || '2010-12-01';

        if (data.credentials && data.credentials.constructor === Object) {
            data.credentials = new Aws.Credentials( data.credentials.id, data.credentials.secret);
        }

        this.instance = new Aws.SES(data);
    }

    async text (data) {
    	const pairs = [];

    	for (const name in data) {
    		if (name.charAt(0) !== '$') {
    			pairs.push(`${name.replace( /([A-Z])/g, ' $1' ).toUpperCase()}: ${data[name]}`);
    		}
    	}

    	return Text(data);

    }

    async html (data) {
    	const pairs = [];

    	for (const name in data) {
    		if (name.charAt(0) !== '$') {
    			pairs.push(`
    				<tr>
    					<td style="font-family: sans-serif; font-size: 15px; vertical-align: top; text-align: left; font-weight: bold; text-transform: capitalize;">${name}</td>
    					<td style="font-family: sans-serif; font-size: 15px; vertical-align: top; text-align: left;">${data[name]}</td>
    				</tr>
    			`);
    		}
    	}

    	return Html(data);
    }

    async send (data) {
        const option = Object.assign(data);

        if (typeof option.$to === 'string') {
            option.$to = option.$to.split(SPLIT);
        }

        if (typeof option.$cc === 'string') {
            option.$cc = option.$cc.split(SPLIT);
        }

        if (typeof option.$bcc === 'string') {
            option.$bcc = option.$bcc.split(SPLIT);
        }

        const [ text, html ] = await Promise.all([ this.text(option), this.html(option) ]);

    	return this.instance.sendEmail({
    		Source: option.$from,
    		ReplyToAddresses: [ option.$reply || option.$from ],
    		Destination: {
    			ToAddresses: option.$to,
    			CcAddresses: option.$cc,
    			BccAddresses: option.$bcc
    		},
    		Message: {
    			Body: {
    				Html: {
    					Charset: 'UTF-8',
    					Data: html
    				},
    				Text: {
    					Charset: 'UTF-8',
    					Data: text
    				}
    			},
    			Subject: {
    				Charset: 'UTF-8',
    				Data: option.$subject
    			}
    		}
    	}).promise();
    }

}
