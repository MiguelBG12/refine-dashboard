import graphqlDataProvider, { GraphQLClient, liveProvider as graphqlLiveProvider } from "@refinedev/nestjs-query";
import { createClient } from "graphql-ws";
import { fetchWrapper } from "./fetch-wrapper";

export const API_BASE_URL = "https://api.crm.define.dev";
export const API_URL = "https://api.crm.refine.dev";
export const WS_URL = "wws://api.crm.refine.dev/graphql";

// A GraphQLClient instance is created
export const client = new GraphQLClient(API_URL, {
  // A custom fetch function and error handling are defined
  fetch: (url: string, options: RequestInit) => {
    try {
      return fetchWrapper(url, options);
    } catch (error) {
      return Promise.reject(error as Error);
    }
  },
});

// Create the WebSocket client only if you are in a browser environment
export const wsClient =
  typeof window !== "undefined"
    ? createClient({
        url: WS_URL,
        connectionParams: () => {
          const accessToken = localStorage.getItem("access_token");

          return {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      })
    : undefined;

export const dataProvider = graphqlDataProvider(client);
// Create the liveProvider with the WebSocket client
export const liveProvider = wsClient ? graphqlLiveProvider(wsClient) : undefined;