import request from 'superagent';
require('superagent-auth-bearer')(request);

const URL = 'https://127.0.0.1:8443/accounts/oauth2/authorize';

export default (app) => {

    app.post('/api/login', (r, w) => {
        const {id, password} = r.body.params;

        if (id === null) {
            w.status(401);
            w.send({ error: 'Invalid credentials.' });
            return;
        }

        w.send({ id, password });
    });

    app.post('/api/consent', (r, w) => {
        const {authenticated_userid} = r.body.params;
        console.log('Consent for user: ', authenticated_userid);
        if (authenticated_userid === null) {
            w.status(401);
            w.send({ error: 'Invalid user' });
            return;
        }

        // In order to simulate an error, remove the send part with the parameters
        request.post(URL).send(r.body.params).end((err, resp) => {
            if (err) {
                w.status(err.status);
                w.send({ error: err.text });
                return;
            }
            if (resp.body.redirect_uri) {
                w.send({ code: resp.body.redirect_uri });
                return;
            }

            console.log('Error: ', resp);
        });
    });
}
