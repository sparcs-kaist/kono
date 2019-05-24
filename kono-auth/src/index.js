import Express from 'express';

const app = Express();

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(8080, () => {
    console.log('kono-auth server listening at port 8080');
});