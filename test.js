
const Emaily = require('./src/index.js');

// .replace(/([^\0]{76})/g, '$1\n')

(async function () {

    const emaily = new Emaily();

    const { text, html } = await emaily.template({
        firstName: 'joe',
        lastName: 'shmoe',
        $name: 'Foo Bar', // required
        $byName: 'Arc IO', // required
        $domain: 'https://foobar.com/', // required
        $byDomain: 'https://arcdev.io/', // required
    });

    console.log(text);
    console.log(html);

    // const text: = 'Hello World Text';
    // const html = '<html><head></head><body><h1>Hello World HTML</h1></body></html>';

    const result = await emaily.send({
        text, html,
        subject: 'Test Subject',
        to: [ 'alex.steven.elias@gmail.com' ],
        from: '"No Reply" <noreply@arcdev.io>',
        attachments: [
            {
                name: 'a.txt',
                data: 'SUQsRmlyc3ROYW1lLExhc3ROYW1lLENvdW50cnkKMzQ4LEpvaG4sU3RpbGVzLENhbmFkYQo5MjM4OSxKaWUsTGl1LENoaW5hCjczNCxTaGlybGV5LFJvZHJpZ3VleixVbml0ZWQgU3RhdGVzCjI4OTMsQW5heWEsSXllbmdhcixJbmRpYQ=='
            }
        ]
    });

    console.log(result);

}()).catch(console.error);
