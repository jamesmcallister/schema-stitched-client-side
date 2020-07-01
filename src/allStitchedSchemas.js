import { print } from "graphql";
import {
  introspectSchema,
  wrapSchema,
  makeRemoteExecutableSchema,
} from "@graphql-tools/wrap";
import { stitchSchemas } from "@graphql-tools/stitch";

const executor = (urlGraphalEndPoint) => async ({ document, variables }) => {
  const query = print(document);
  const fetchResult = await fetch(urlGraphalEndPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  return fetchResult.json();
};

const getNewRemoteSchema = async (url) => {
  return makeRemoteExecutableSchema({
    schema: wrapSchema({
      schema: await introspectSchema(executor(url)),
      executor: executor(url),
    }),
    executor: executor(url),
  });
};

export const allStitchedSchemas = async (urls) => {
  const unMergedSchemas = urls.map(async (url) => ({
    schema: await getNewRemoteSchema(url),
  }));

  const mergedSchemas = await Promise.all(unMergedSchemas);

  return stitchSchemas({
    subschemas: mergedSchemas,
  });
};
