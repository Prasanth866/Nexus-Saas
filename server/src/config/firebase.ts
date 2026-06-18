
import {initializeApp, cert, type ServiceAccount} from 'firebase-admin';
import serviceAccount from './firebase-service-account.json' with {type: "json"};

initializeApp({
    credential: cert(
        serviceAccount as ServiceAccount
    ),
});

import * as adminNamespace from 'firebase-admin';
export default adminNamespace;
