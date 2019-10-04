'use strict';

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
        `Content-Type: multipart/mixed; boundary="${MIXED_BOUNDARY}"`
    );

    if (text && html) {
        raw.push(
            `\n--${MIXED_BOUNDARY}`,
            `Content-Type: multipart/alternative; boundary="${ALTERNATIVE_BOUNDARY}"`
        );
    }

    if (text) {
        raw.push(
            `\n--${BOUNDARY}`,
            `Content-Transfer-Encoding: base64`,
            `Content-Type: text/plain; charset=utf-8`,
            Buffer.from(Buffer.from(text, 'utf8'), 'base64')
        );
    }

    if (html) {
        raw.push(
            `\n--${BOUNDARY}`,
            `Content-Transfer-Encoding: base64`,
            `Content-Type: text/html; charset=utf-8`,
            Buffer.from(Buffer.from(html, 'utf8'), 'base64')
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
                `Content-Type: text/plain; name="${attachment.name}"`,
                `Content-Disposition: attachment; filename="${attachment.name}"`,
                Buffer.from(attachment.data, 'base64')
            );
        }
    }

    raw.push(`\n--${MIXED_BOUNDARY}--`);

    return raw.join('\n');
};
