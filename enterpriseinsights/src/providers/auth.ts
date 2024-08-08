import { AuthBindings } from "@refinedev/core";

import { API_URL, dataProvider } from "./data";

// For demo purposes and to make it easier to test the app, you can use the following credentials
export const authCredentials = {
  email: "mbautista.g12@gmail.com",
  password: "123demo",
};

export const authProvider: AuthBindings = {
  login: async ({ email }) => {
    try {
      // call the login mutation
      // dataProvider.custom is used to make a custom request to the GraphQL API
      // this will call dataProvider which will go through the fetchWrapper function
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email },
          // pass the email to see if the user exists and if so, return the accessToken
          rawQuery: `
            mutation Login($email: String!) {
              login(loginInput: { email: $email }) {
                accessToken
              }
            }
          `,
        },
      });

      // save the accessToken in localStorage
      localStorage.setItem("access_token", data.login.accessToken);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (e) {
      const error = e as Error;

      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Login failed",
          name: "name" in error ? error.name : "Invalid email or password",
        },
      };
    }
  },

  // simply remove the accessToken from localStorage for the logout
  logout: async () => {
    localStorage.removeItem("access_token");

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  onError: async (error) => {
    // a check to see if the error is an authentication error
    // if so, set logout to true
    if (error.statusCode === "UNAUTHENTICATED") {
      return {
        logout: true,
        ...error,
      };
    }

    return { error };
  },

};