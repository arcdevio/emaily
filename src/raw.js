'use strict';

const MaxLine = function (data) {
    let c = 0, result = '';

    for (let i = 0, l = data.length; i < l; i++) {
        result += data[i];

        if (c === 74) {
            result += '\n';
            c = 0;
        } else {
            c++;
        }

    }

    return result;
};

module.exports = function (data) {
    const { cc, bcc, to, from, text, html, reply, subject, attachments } = data || {};

    const MIXED_BOUNDARY = 'MIXED_BOUNDARY';
    const ALTERNATIVE_BOUNDARY = 'ALTERNATIVE_BOUNDARY';
    const BOUNDARY = text && html ? ALTERNATIVE_BOUNDARY : MIXED_BOUNDARY;

    const raw = [
        `From: ${from}`,
        `To: ${to}`
    ];

    if (reply) {
        raw.push(`Reply-To: ${reply}`);
    }

    if (cc) {
        raw.push(`CC: ${cc}`);
    }

    if (bcc) {
        raw.push(`BCC: ${bcc}`);
    }

    raw.push(
        `Subject: ${subject}`,
        `Content-Type: multipart/mixed;`,
        `\tboundary="${MIXED_BOUNDARY}"`
    );

    if (text && html) {
        raw.push(
            `\n--${MIXED_BOUNDARY}`,
            `Content-Type: multipart/alternative;`,
            `\tboundary="${ALTERNATIVE_BOUNDARY}"`
        );
    }

    if (text) {
        raw.push(
            `\n--${BOUNDARY}`,
            `Content-Transfer-Encoding: base64`,
            `Content-Type: text/plain; charset=utf-8\n`,
            MaxLine(Buffer.from(text).toString('base64'))
        );
    }

    if (html) {
        raw.push(
            `\n--${BOUNDARY}`,
            `Content-Transfer-Encoding: base64`,
            `Content-Type: text/html; charset=utf-8\n`,
            MaxLine(Buffer.from(html).toString('base64'))
        );
    }

    if (text && html) {
        raw.push(`\n--${BOUNDARY}--`);
    }

    if (attachments) {
        for (const attachment of attachments) {
            raw.push(
                `\n--${MIXED_BOUNDARY}`,
                `Content-Transfer-Encoding: base64`,
                `Content-Description: ${attachment.name}`,
                `Content-Disposition: attachment; filename="${attachment.name}"`,
                `Content-Type: text/plain; charset=${attachment.encoding || 'utf-8'}; name="${attachment.name}"\n`,
                MaxLine(Buffer.from(attachment.data, attachment.encoding || 'utf8').toString('base64'))
            );
        }
    }

    raw.push(`\n--${MIXED_BOUNDARY}--`);

    return raw.join('\n');
};
