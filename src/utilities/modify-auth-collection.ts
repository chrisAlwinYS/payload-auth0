import { AuthStrategy, type CollectionConfig } from "payload";
import { createAuthStrategy } from "./Auth0Strategy";
// import { createAuthorizeEndpoint } from "./authorize-endpoint";

import { PluginTypes } from "../types";
// import { createAuth0Endpoints } from "./Auth0/authorize-endpoint";
// import { createCallbackEndpoint } from "./Auth0/callback-endpoint";

export const modifyAuthCollection = (
  pluginOptions: PluginTypes,
  existingCollectionConfig: CollectionConfig,
  subFieldName: string,
): CollectionConfig => {
  // /////////////////////////////////////
  // modify fields
  // /////////////////////////////////////

  // add sub fields
  const fields = existingCollectionConfig.fields || [];
  const existingSubField = fields.find(
    (field) => "name" in field && field.name === subFieldName,
  );
  if (!existingSubField) {
    fields.push({
      name: subFieldName,
      type: "text",
      index: true,
      access: {
        read: () => true,
        create: () => true,
        update: () => false,
      },
    });
  }

  // add email field if disableLocalStrategy is set
  // and we don't have an email field
  if (
    typeof existingCollectionConfig.auth !== "boolean" &&
    existingCollectionConfig.auth !== undefined &&
    existingCollectionConfig.auth.disableLocalStrategy === true &&
    pluginOptions.useEmailAsIdentity === true &&
    fields.every((field: any) => field.name !== "email")
  ) {
    const existingEmailField = fields.find(
      (field) => "name" in field && field.name === "email",
    );
    if (!existingEmailField) {
      fields.push({
        name: "email",
        type: "email",
        required: true,
        unique: true,
        index: true,
      });
    }
  }

  // /////////////////////////////////////
  // modify strategies
  // /////////////////////////////////////

  const authStrategy = createAuthStrategy(pluginOptions, subFieldName);
  let strategies: AuthStrategy[] = [];
  if (
    typeof existingCollectionConfig.auth === "boolean" ||
    existingCollectionConfig.auth === undefined
  ) {
    strategies = [];
  } else if (Array.isArray(existingCollectionConfig.auth.strategies)) {
    strategies = existingCollectionConfig.auth.strategies || [];
  }
  strategies.push(authStrategy);

  // // /////////////////////////////////////
  // // modify endpoints
  // // /////////////////////////////////////

  // Don't need this as middleware is set

  // const endpoints = existingCollectionConfig.endpoints || [];
  // endpoints.push(createAuthorizeEndpoint(pluginOptions));
  // endpoints.push(createCallbackEndpoint(pluginOptions));

  // endpoints.push(createAuth0Endpoints(pluginOptions));
  // endpoints.push(createCallbackEndpoint(pluginOptions));

  // console.log("endpoints", endpoints);


  return {
    ...existingCollectionConfig,
    fields,
    // endpoints,
    auth: {
      ...(typeof existingCollectionConfig.auth === "object" &&
      existingCollectionConfig.auth !== null
        ? existingCollectionConfig.auth
        : {}),
      strategies,
    },
  };
};