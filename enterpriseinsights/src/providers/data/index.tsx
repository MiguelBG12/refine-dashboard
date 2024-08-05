import { GraphQLClient } from "@refinedev/nestjs-query";
import { fetchWrapper } from "./fetch-wrapper";

export const API_URL = "https://api.crm.refine.dev";

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
