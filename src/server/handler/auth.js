import request from 'superagent';
import Hydra from '../service/hydra';
require('superagent-auth-bearer')(request);

const URL = 'https://127.0.0.1:8443/accounts/oauth2/authorize';
const PROVIDER = process.env.PROVIDER || 'hydra';

const NODE_TLS_REJECT_UNAUTHORIZED = '0';

const hydra = new Hydra({
    clientID: process.env.HYDRA_CLIENT_ID || 'admin', //admin',
    clientSecret: process.env.HYDRA_CLIENT_SECRET || 'demo-password', // 'demo-password',
    endpoint: process.env.HYDRA_URL || 'http://localhost:4444'
});

export default (app) => {

    app.post('/api/login', (r, w) => {
        const {id, password, challenge} = r.body.params;

        if (id === null) {
            w.status(401);
            w.send({ error: 'Invalid credentials.' });
            return;
        }
        if (challenge === null) {
            w.status(401);
            w.send({ error: 'Undefined challenge.' });
            return;
        }
        if (PROVIDER === 'hydra') {
            hydra.verifyConsentChallenge(challenge).then(({decodedChallenge}) => {
                // 'simulate' authentication network lag...
                setTimeout(function () {
                    w.send({ id, password, challenge, decodedChallenge });
                }, 1000);
            }).catch((error) => {
                w.status(500);
                console.log(error);
                w.send(error);
            });
        } else {
            w.send({ id, password });
        }
    });

    app.post('/api/consent', (r, w) => {
        const {authenticated_userid, challenge, decodedChallenge, scopes} = r.body.params;
        //console.log("Before calling hydra for consent: ", decodedChallenge);
        if (authenticated_userid === null) {
            w.status(401);
            w.send({ error: 'Invalid user' });
            return;
        }

        if (PROVIDER === 'hydra') {
            if (challenge === null || !challenge) {
                const errMsg = 'The challenge was not provided';
                console.log(errMsg);
                w.status(500);
                w.send({ error: errMsg });
            }
            hydra.generateConsentToken(authenticated_userid, scopes, challenge).then(({consent}) => {
                w.send({ code: consent });
            }).catch((error) => {
                console.log('An error occurred on consent: ', error);
                w.status(500);
                w.send({ error });
            });
        } else {
            // In order to simulate an error, remove the "send" part with the parameters
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
        }
    });

}
