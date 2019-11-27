
const Emaily = require('./index.js');

(async function () {

    const emaily = new Emaily({
        // credentials: { id: null, secret: null }
    });

    const { text, html, csv } = await emaily.template({
        firstName: 'joe',
        lastName: 'shmoe',
        $name: 'Foo Bar', // required
        $byName: 'Arc IO', // required
        $domain: 'https://foobar.com/', // required
        $byDomain: 'https://arcdev.io/', // required
    });

    // const text = 'Hello World Text';
    // const html = '<html><head></head><body><h1>Hello World HTML</h1></body></html>';

    const result = await emaily.send({
        text,
        html,
        subject: 'Test Subject',
        // cc: [
        //     'alex.steven.elias@gmail.com',
        // ],
        // to: [
        //     'jon@arcdev.io',
        //     'jonburns10@gmail.com',
        // ],
        to: [ 'tnwf@live.com' ],
        from: '"No Reply" <noreply@arcdev.io>',
        attachments: [ { name: 'customer.csv', data: csv } ]
    });

    console.log(result);

}()).catch(console.error);
