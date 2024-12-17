import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation CreateUser($input: userInput!) {
    createUser(input: $input) {
      userName
      email
      password
      isDeleted
      id
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation SignIn($password: String!, $email: String!) {
    signIn(password: $password, email: $email) {
      token
      user {
        id
        userName
        email
        password
        isVerified
        isDeleted
      }
    }
  }
`;