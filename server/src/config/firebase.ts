
import {initializeApp, cert, getApps, type ServiceAccount} from 'firebase-admin/app';
import { getAuth } from "firebase-admin/auth";
import serviceAccount from './firebase-service-account.json' with {type: "json"};

const app = getApps()[0] ?? initializeApp({
    credential: cert(
        serviceAccount as ServiceAccount,
    ),
});

export const auth = getAuth(app);
