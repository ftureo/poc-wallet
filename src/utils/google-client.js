import { GoogleAuth } from "google-auth-library";

import fileToRead from "../files/lanacion-92a91-84e26365bd39.json" assert { type: "json" };

const credentials = fileToRead

const httpClient = new GoogleAuth({
    credentials: credentials,
    scopes: "https://www.googleapis.com/auth/wallet_object.issuer",
});

export {
    httpClient,
    credentials
}