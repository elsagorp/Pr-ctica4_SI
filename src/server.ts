

import { ApolloServer, ApolloError } from "apollo-server";

import { typeDefs } from "./schema/schema"
import { Query, Recipe, User, Ingredient } from "./resolvers/Query"; 
import { Mutation } from "./resolvers/Mutation";
import { connectDB } from "./mongo/mongo";

import config from "./config";


const resolvers = {
  Query,
  Mutation,
  Recipe, 
  User, 
  Ingredient
}

const run = async() => {
 

  const db = await connectDB();


  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async({req, res}) => {
      const valid = [ "AddRecipe","UpdateRecipe", "DeleteRecipe","SignOut", "LogOut", "AddIngredient", "DeleteIngredient"];
      const header = req.headers['token'];
      if(valid.some(i =>  req.body.query.includes(i))){
        if(header != null){
          const user = await db.collection("Usuarios").findOne({token: header});
          if(user){
            return {
              db, 
              user
            };
          
          }else{
            throw new ApolloError("Authentication Error", "404");
          }
        }
      }else{
        return {
          db
        };
    }
    },
  });

  await server.listen(config.PORT,() =>{
    console.log(`Server start at http://localhost:${config.PORT}`);
  });

} ;

try {
  run();
} catch (e) {
  console.error(e);
}