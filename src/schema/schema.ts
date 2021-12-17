import { gql } from "apollo-server";

const typeDefs = gql`

type Ingredient{
  _id: ID!
  name: String!
  recipes: [Recipe!]!
}

type Recipe{
  _id: ID!
  name: String!
  description: String!
  ingredients: [Ingredient!]!
  author: User!
}

type User{
  _id: ID!
  email: String!
  pwd: String!
  token: String
  recipes: [Recipe!]!
}
input IngredientInput{
  name: String!
}

input RecipeInput{
  name: String!
  description: String!
  ingredients: [String!] !
}

input UserInput{
  id: ID!
  email: String!

}
  type Query {
    getRecipe(id: ID!): Recipe
    getRecipes(author: String, ingredient: String): [Recipe]
    getUser(id: ID!): User
    getUsers: [User]
  }
  type Mutation {
    SignIn(email: String!, pwd:String!): String
    SignOut(email: String!, pwd:String!): String
    LogIn(email: String!, pwd:String!): String
    LogOut: String 

    AddIngredient(ingredient: IngredientInput!): String
    DeleteIngredient(id: ID!): String

    AddRecipe(recipe: RecipeInput!): String
    UpdateRecipe(id: ID!,recipe: RecipeInput!): String
    DeleteRecipe(id: ID!): String

  }
`;

export { typeDefs };

//(email: String!, pwd:String!, token: String!)