import jwt from "jsonwebtoken";

import { httpClient, credentials } from "../utils/google-client.js";

export const createPassObject = async (request, response) => {
    console.log(`Inside createPassObject controller`);

    console.log({ request: request.body });

    const issuerId = request.body.issuerId || process.env.ISSUER_ID;
    const type = request?.body?.type?.toUpperCase();
    const objectSuffix = `${type}.${request?.body?.email.replace(
        /[^\w.-]/g,
        "_"
    )}`;

    console.log({ issuerId, type, objectSuffix });

    let objectResponse;

    try {
        // Comprobación de existencia de objeto a crear
        objectResponse = await httpClient.request({
            url: `${process.env.BASE_URL_WALLET}/genericObject/${issuerId}.${objectSuffix}`,
            method: "GET",
        });

        console.log({ firstResponse: objectResponse });

        console.log(
            `Object ${issuerId}.${objectSuffix} already exists. Is not possible to create an equal object pass!`
        );

        return `${issuerId}.${objectSuffix}`;
    } catch (error) {
        if (error.response && error.response.status !== 404) {
            // Algún error tiene que haber ocurrido
            console.log(`Está ocurriendo el siguiente error`, error);
            return `${issuerId}.${type}`;
        }
    }

    console.log(
        !objectResponse
            ? `Object ${issuerId}.${objectSuffix} not exists!`
            : "Ya existe perri"
    );

    let newObject = {
        id: `${issuerId}.${objectSuffix}`,
        classId: `${issuerId}.${process.env.CLASS_ID_SUFFIX}${type}`,
        state: "ACTIVE",
        heroImage: {
            sourceUri: {
                uri: "https://mir-s3-cdn-cf.behance.net/projects/404/d2b62b154466659.Y3JvcCwxNDM0LDExMjIsMjQxLDA.png",
            },
            contentDescription: {
                defaultValue: {
                    language: "en-US",
                    value: "Club La Nacion Banner",
                },
            },
        },
        textModulesData: [
            {
                header: "Card ID",
                body: request?.body?.cardID ? request?.body?.cardID : "N/A",
                id: "card_id",
            },
            {
                header: "State",
                body: "ACTIVE",
                id: "state",
            },
            {
                header: "Correo Electrónico",
                body: request.body?.email,
                id: "correo_electrónico",
            },
            {
                header: "Te asociaste el",
                body: request.body?.createdDate,
                id: "te_asociaste_el",
            },
            {
                header: "DNI",
                body: request.body?.dni,
                id: "dni",
            },
            {
                header: "Teléfono",
                body: request.body?.phoneNumber
                    ? request.body?.phoneNumber
                    : "N/A",
                id: "phone_number",
            },
        ],
        linksModuleData: {
            uris: [
                {
                    uri: "http://club.lanacion.com.ar/",
                    description: "Club La Nación Official Website",
                    id: "club_website",
                },
            ],
        },
        // imageModulesData: [
        //     {
        //         mainImage: {
        //             sourceUri: {
        //                 uri: "http://farm4.staticflickr.com/3738/12440799783_3dc3c20606_b.jpg",
        //             },
        //             contentDescription: {
        //                 defaultValue: {
        //                     language: "en-US",
        //                     value: "Image module description",
        //                 },
        //             },
        //         },
        //         id: "IMAGE_MODULE_ID",
        //     },
        // ],
        appLogoImage: {
            webAppLinkInfo: {
                title: "title for web app link",
                appTarget: "http://club.lanacion.com.ar/",
            },
        },
        cardTitle: {
            defaultValue: {
                language: "en-US",
                value: `${type} CREDENTIAL`,
                alternateText: "¡Valida esta tarjeta!",
            },
        },
        header: {
            defaultValue: {
                language: "en-US",
                value: request?.body?.name ? request?.body?.name : "N/A",
            },
        },
        subheader: {
            defaultValue: {
                language: "en-US",
                value: "Titular",
            },
        },
        hexBackgroundColor: "#4285f4",
        logo: {
            sourceUri: {
                uri: "https://club.movistar.com.ar/system/coupons/3351_original.jpg?1672410646",
            },
            contentDescription: {
                defaultValue: {
                    language: "en-US",
                    value: "Club La Nación Logo",
                },
            },
        },
    };

    newObject.barcode = {
        type: "QR_CODE",
        value: newObject.id,
        showCodeText: {
            defaultValue: {
                language: "en-US",
                value: "Toca para mostrar el código QR",
            },
        },
    };

    objectResponse = await httpClient.request({
        url: `${process.env.BASE_URL_WALLET}/genericObject/`,
        method: "POST",
        data: newObject,
    });

    console.log("After request", { objectResponse });

    console.log({ credentials });

    const claims = {
        iss: credentials.client_email,
        aud: "google",
        origins: ["https://club.lanacion.com.ar/"],
        typ: "savetowallet",
        payload: {
            genericObjects: [newObject],
        },
    };

    const token = jwt.sign(claims, credentials.private_key, {
        algorithm: "RS256",
    });
    console.log({ claims, token });

    const linkToSave = `https://pay.google.com/gp/v/save/${token}`;

    console.log("Add to Google Wallet this link: ", linkToSave);

    response.send({
        message: `New object pass created below name: ${newObject.id}`,
        objectResponse,
        linkToSave,
    });
};

export const signObjectToAssociate = async (request, response) => {
    // Empiezo consultando si el objeto existe
    // Si existe, lo traigo y luego, me fijo si ya está asociado a través de la clave hasUsers
    // Si no está asociado, lo asocio y lo devuelvo como un link de Google Pay con el token firmado
    // Si está asociado, devuelvo un mensaje de error y retorno

    console.log(`Inside signObjectToAssociate controller`);

    console.log({ request: request.body });

    const issuerId = request.body.issuerId || process.env.ISSUER_ID;
    const type = request?.body?.type?.toUpperCase();
    const objectSuffix = `${type}.${request?.body?.email.replace(
        /[^\w.-]/g,
        "_"
    )}`;

    console.log({ issuerId, type, objectSuffix });

    let objectResponse;

    try {
        // Comprobación de existencia de objeto a firmar
        objectResponse = await httpClient.request({
            url: `${process.env.BASE_URL_WALLET}/genericObject/${issuerId}.${objectSuffix}`,
            method: "GET",
        });

        console.log({ firstResponse: objectResponse });

        console.log(`Object ${issuerId}.${objectSuffix} already exists!`);

        // Si existe, lo traigo y luego, me fijo si ya está asociado a través de la clave hasUsers

        const objectToSign = objectResponse.data;

        console.log({ objectToSign });

        if (objectToSign.hasUsers) {
            // Si ya está asociado, devuelvo un mensaje de error y retorno
            return response.send({
                message: `Object ${issuerId}.${objectSuffix} already associated!`,
                objectResponse,
            });
        }  else {
            return response.send({
                message: `Object ${issuerId}.${objectSuffix} could be associated!`,
                objectResponse,
            });
        }
    } catch (error) {}

    //     // Si no está asociado, lo asocio y lo devuelvo como un link de Google Pay con el token firmado

    //     const claims = {
    //         iss: credentials.client_email,
    //         aud: "google",
    //         origins: ["https://club.lanacion.com.ar/"],
    //         typ: "savetowallet",
    //         payload: {
    //             genericObjects: [objectToSign],
    //         },
    //     };

    //     const token = jwt.sign(claims, credentials.private_key, {
    //         algorithm: "RS256",
    //     });
    //     console.log({ claims, token });

    //     const linkToSave = `https://pay.google.com/gp/v/save/${token}`;

    //     response.send({
    //         message: `Object ${issuerId}.${objectSuffix} could be associated!`,
    //         linkToSave,
    //         objectResponse
    //     })

    // } catch (error) {
    //     error.response && error.response.status === 404 && response.send({
    //         message: `Object ${issuerId}.${objectSuffix} not exists. Is not possible associate!`,
    //     }) 

    //     console.log(`Está ocurriendo el siguiente error`, error);
    // }


}


export const updatePassObject = async (request, response) => {
    console.log(`Inside updatePassObject controller`, {
        request: request.body,
    });

    // Check if object exists

    const issuerId = request.body?.issuerId || process.env.ISSUER_ID;
    const type = request.body?.type?.toUpperCase();
    const objectSuffix = `${type}.${request.body?.email.replace(
        /[^\w.-]/g,
        "_"
    )}`;

    let objectToUpdate;

    try {
        objectToUpdate = await httpClient.request({
            url: `${process.env.BASE_URL_WALLET}/genericObject/${issuerId}.${objectSuffix}`,
            method: "GET",
        });

        console.log({ firstResponse: objectToUpdate });

        console.log(
            `Object ${issuerId}.${objectSuffix} already exists. Is possible to update object pass!`
        );
    } catch (error) {
        if (error.response && error.response.status === 404) {
            response.send(
                `Object ${issuerId}.${objectSuffix} not exists then is not possible to update object pass!`
            );
        } else {
            console.log(`Está ocurriendo el siguiente error`, error);
            response.send(
                `Error inesperado. Comuníquese con el equipo de desarrollo.`
            );
        }
    }

    
    const toUpdate = objectToUpdate.data;
    console.log({ objectToUpdate, toUpdate });

    const newBackground = request.body?.background;

    if (newBackground) {
        toUpdate["hexBackgroundColor"] = newBackground;
    }

    const newTitular = request.body?.titular;
    if(newTitular) {
        toUpdate["header"]["defaultValue"]["value"] = newTitular;
    }

    objectToUpdate = await httpClient.request({
        url: `${process.env.BASE_URL_WALLET}/genericObject/${issuerId}.${objectSuffix}`,
        method: "PUT",
        data: toUpdate,
    });

    console.log({ objectToUpdate });

    response.send({
        message: `Object ${issuerId}.${objectSuffix} updated successfully!`,
        afterUpdate: objectToUpdate,
    });
};

export const patchPassObject = async (request, response) => {
    console.log(`Inside patchPassObject controller`, {
        request: request.body,
    });

    // Check if object exists

    const issuerId = request.body?.issuerId || process.env.ISSUER_ID;
    const type = request.body?.type?.toUpperCase();
    const objectSuffix = `${type}.${request.body?.email.replace(
        /[^\w.-]/g,
        "_"
    )}`;

    let objectToPatch;

    try {
        objectToPatch = await httpClient.request({
            url: `${process.env.BASE_URL_WALLET}/genericObject/${issuerId}.${objectSuffix}`,
            method: "GET",
        });

        console.log({ firstResponse: objectToPatch });

        console.log(
            `Object ${issuerId}.${objectSuffix} already exists. Is possible to patch this object pass!`
        );
    } catch (error) {
        if (error.response && error.response.status === 404) {
            response.send(
                `Object ${issuerId}.${objectSuffix} not exists then is not possible to patch this object pass!`
            );
        } else {
            console.log(`Está ocurriendo el siguiente error`, error);
            response.send(
                `Error inesperado. Comuníquese con el equipo de desarrollo.`
            );
        }
    }

    console.log({ objectToPatch });

    const toPatch = {
        state: request.body?.state,
        hexBackgroundColor: "#aa11aa",
    };

    console.log({ objectToPatch, toPatch });
    objectToPatch = await httpClient.request({
        url: `${process.env.BASE_URL_WALLET}/genericObject/${issuerId}.${objectSuffix}`,
        method: "PATCH",
        data: toPatch,
    });

    console.log({ objectToPatch });
    let patchedObject = objectToPatch.data;

    if (patchedObject) {
        const newTextModules = objectToPatch.data.textModulesData.map(
            (textModule) => {
                if (textModule.header === "State") {
                    textModule.body = request.body?.state;
                }
                return textModule;
            }
        );

        patchedObject["textModulesData"] = newTextModules;
    }

    const finishPatch = await httpClient.request({
        url: `${process.env.BASE_URL_WALLET}/genericObject/${issuerId}.${objectSuffix}`,
        method: "PUT",
        data: patchedObject,
    });

    response.send({
        message: `Object ${issuerId}.${objectSuffix} patched successfully!`,
        afterPatch: objectToPatch,
        finishPatch,
    });
};
