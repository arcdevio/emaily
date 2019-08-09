'use strict';

const Aws = require('aws-sdk');

let SES;
const SPLIT = /\s+|,|\s+/;

const Text = function (data) {
	const pairs = [];

	for (const name in data) {
		if (name.charAt(0) !== '$') {
			pairs.push(`${name.replace( /([A-Z])/g, ' $1' ).toUpperCase()}: ${data[name]}`);
		}
	}

	return `
		Hello,

		You have recieved a ${data.$name} submission from ${data.$domain}.

		${pairs.join('\n')}

		Powered By ${data.$byName}
	`;

};

const Html = function (data) {
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

	return `
	<!DOCTYPE html>
	<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		<title>Email Submission From ${data.$domain}</title>
		<style>
			@media only screen and (max-width: 620px) {
				table[class=body] h1 {
					font-size: 28px !important;
					margin-bottom: 10px !important;
				}
				table[class=body] p,
				table[class=body] ul,
				table[class=body] ol,
				table[class=body] td,
				table[class=body] span,
				table[class=body] a {
					font-size: 16px !important;
				}
				table[class=body] .wrapper,
					table[class=body] .article {
					padding: 10px !important;
				}
				table[class=body] .content {
					padding: 0 !important;
				}
				table[class=body] .container {
					padding: 0 !important;
					width: 100% !important;
				}
				table[class=body] .main {
					border-left-width: 0 !important;
					border-radius: 0 !important;
					border-right-width: 0 !important;
				}
			}
			@media all {
				.ExternalClass {
					width: 100%;
				}
				.ExternalClass,
				.ExternalClass p,
				.ExternalClass span,
				.ExternalClass font,
				.ExternalClass td,
				.ExternalClass div {
					line-height: 100%;
				}
			}
		</style>
	</head>
	<body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 15px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
		<table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
			<tr>
				<td style="font-family: sans-serif; font-size: 15px; vertical-align: top;">&nbsp;</td>

				<td class="container" style="font-family: sans-serif; font-size: 15px; vertical-align: top; display: block; Margin: 0 auto; max-width: 600px; padding: 10px; width: 600px;">
					<div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 600px; padding: 10px;">

						<span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Email Submission From ${data.$domain}.</span>

						<!-- START MAIN CONTENT AREA -->
						<table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">
							<tr>
								<td class="wrapper" style="font-family: sans-serif; font-size: 15px; vertical-align: top; box-sizing: border-box; padding: 20px;">
									<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
										<tr>
											<td style="font-family: sans-serif; font-size: 15px; vertical-align: top;">
												<p style="font-family: sans-serif; font-size: 15px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello,</p>
												<p style="font-family: sans-serif; font-size: 15px; font-weight: normal; margin: 0; Margin-bottom: 15px;">You have recieved a ${data.$name} submission from <a href="${data.$domain}" target="_blank" style="display: inline-block; box-sizing: border-box; cursor: pointer; font-size: 15px;">${data.$domain}</a>.</p>
												<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
													<tbody>
														<tr>
															<td align="left" style="font-family: sans-serif; font-size: 15px; vertical-align: top; padding-bottom: 15px;">
																<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; margin: auto; width: 90%;">
																	<tbody>
																		${pairs.join('\n')}
																	</tbody>
																</table>
															</td>
														</tr>
													</tbody>
												</table>
											</td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
						<!-- END MAIN CONTENT AREA -->

						<!-- START FOOTER -->
						<div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
							<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
								<tr>
									<td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
										<span>Powered By <a href="${data.$byDomain}" style="color: #999999; font-size: 12px; text-align: center; text-decoration: none;">${data.$byName}</a></span>
									</td>
								</tr>
							</table>
						</div>
						<!-- END FOOTER -->

					</div>
				</td>
				<td style="font-family: sans-serif; font-size: 15px; vertical-align: top;">&nbsp;</td>
			</tr>
		</table>
	</body>
	</html>
	`;
};

module.exports.setup = async function (data) {
    data = data || {};

    data.region = data.region || 'us-west-2';
    data.apiVersion = data.apiVersion || '2010-12-01';

    if (data.credentials && data.credentials.constructor === Object) {
        data.credentials = new Aws.Credentials( data.credentials.id, data.credentials.secret);
    }

    SES = new Aws.SES(data);
};

module.exports.send = async function (data) {
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

    const [ text, html ] = await Promise.all([ Text(option), Html(option) ]);

	return SES.sendEmail({
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
};
