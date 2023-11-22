import { httpClient } from "../utils/google-client.js";

export const createPassClass = async (request, response) => {
    const issuerId = request.body.issuerId || process.env.ISSUER_ID;
    const type = request.body.type.toUpperCase();

    let classResponse;

    try {
        // Comprobación de existencia de clase a crear
        classResponse = await httpClient.request({
            url: `${process.env.BASE_URL_WALLET}/genericClass/${issuerId}.${type}`,
            method: "GET",
        });
        console.log(`Class ${issuerId}.${type} already exists!`);
    } catch (error) {
        if (error.response && error.response.status !== 404) {
            // Algún error tiene que haber ocurrido
            console.log(`Está ocurriendo el siguiente error`, error);
            return `${issuerId}.${type}`;
        }
    }

    console.log({ classResponse });

    if (!classResponse) {
        console.log(`Class ${issuerId}.${type} not exists!`);
    }

    let newClass = {
        id: `${issuerId}.${process.env.CLASS_ID_SUFFIX}${type}`,
    };

    classResponse = await httpClient.request({
        url: `${process.env.BASE_URL_WALLET}/genericClass/`,
        method: "POST",
        data: newClass,
    });

    console.log("After request", { classResponse });

    response.send(`New class pass created below name: ${newClass.id}`);
};

// TODO: Develop this controller
// Currently is not working because need it a OAuth token
export const getListOfClasses = async (request, response) => {
    const list = await fetch(
        "https://walletobjects.googleapis.com/walletobjects/v1/genericClass",
        {
            issuerId: request.body.issuerId || Number(process.env.ISSUER_ID),
        }
    );
    response.send(list);
};

export const updatePassClass = async (request, response) => {
    const issuerId = request.body.issuerId || process.env.ISSUER_ID;
    const type = request?.body?.type.toUpperCase();

    let responseUpdateClass;

    // Check if class exists and return a message
    try {
        responseUpdateClass = await httpClient.request({
            url: `${process.env.BASE_URL_WALLET}/genericClass/${issuerId}.${process.env.CLASS_ID_SUFFIX}${type}`,
            method: "GET",
        });

        console.log(
            `La clase ${process.env.CLASS_ID_SUFFIX}.${type} existe y es actualizable!`
        );
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log(
                `La clase ${issuerId}.${type} no existe, por lo tanto, no se puede actualizar!`
            );
            return `${process.env.CLASS_ID_SUFFIX}.${type}`;
        } else {
            // Algún error tiene que haber ocurrido
            console.log(`Está ocurriendo el siguiente error`, error);
            return `${process.env.CLASS_ID_SUFFIX}.${type}`;
        }
    }

    // if class already exists, then update it
    console.log({ responseUpdateClass });

    const dataClassToUpdate = responseUpdateClass.data;

    // // This code allow update a class with a new link
    // let newLink = {
    //     uri: `https://lanacion.com.ar/`,
    //     description: "La Nación Official Website",
    // };

    // console.log(dataClassToUpdate["linksModuleData"]); // Should be undefined

    // if (!dataClassToUpdate["linksModuleData"]) console.log("No tiene links")

    //     if (!dataClassToUpdate["linksModuleData"]) {
    //         dataClassToUpdate["linksModuleData"] = {
    //             uris: [],
    //         }
    //     }

    // dataClassToUpdate["linksModuleData"]["uris"].push(newLink);

    // This code allow update a class with a new complete template
    let newTemplate = {
        id: `${issuerId}.${process.env.CLASS_ID_SUFFIX}${type}`,
        classTemplateInfo: {
            cardTemplateOverride: {
                cardRowTemplateInfos: [
                    {
                        twoItems: {
                            startItem: {
                                firstValue: {
                                    fields: [
                                        {
                                            fieldPath:
                                                "object.textModulesData['card_id']",
                                        },
                                    ],
                                },
                            },
                            endItem: {
                                firstValue: {
                                    fields: [
                                        {
                                            fieldPath:
                                                "object.textModulesData['state']",
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    {
                        twoItems: {
                            startItem: {
                                firstValue: {
                                    fields: [
                                        {
                                            fieldPath:
                                                "object.textModulesData['email']",
                                        },
                                    ],
                                },
                            },
                            endItem: {
                                firstValue: {
                                    fields: [
                                        {
                                            fieldPath:
                                                "object.textModulesData['te_asociaste_el']",
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    {
                        twoItems: {
                            startItem: {
                                firstValue: {
                                    fields: [
                                        {
                                            fieldPath:
                                                "object.textModulesData['dni']",
                                        },
                                    ],
                                },
                            },
                            endItem: {
                                firstValue: {
                                    fields: [
                                        {
                                            fieldPath:
                                                "object.textModulesData['telefono']",
                                        },
                                    ],
                                },
                            },
                        },
                    },
                ],
            },
        },
    };

    console.log("Flama para actualizar", { dataClassToUpdate });

    responseUpdateClass = await httpClient.request({
        url: `${process.env.BASE_URL_WALLET}/genericClass/${issuerId}.${process.env.CLASS_ID_SUFFIX}${type}`,
        method: "PUT",
        data: newTemplate,
    });

    console.log("Flama actualizado", { responseUpdateClass });

    response.send(
        `Class ${process.env.CLASS_ID_SUFFIX}.${type} already updated!`
    );
};

// Utilizar un patch permite la posibilidad de modificar solamente una parte de la clase a diferencia del PUT que modifica todo el objeto y sobreescribe lo que ya existía, cambiando la forma por completo del objeto.
export const patchPassClass = () => {
    // Build this controller.
};
