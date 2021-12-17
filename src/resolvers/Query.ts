import { Db, ObjectId } from "mongodb";
import { ApolloError} from "apollo-server";

  import { IContext } from "../types";
  import { RecipeMongo, UserMongo, IngredientMongo } from "../mongo/type";
  
  interface IGetRecipe {
    id: string;
  }
  
  interface IGetUser {
    id: string;
  }

  
  
  interface IGetRecipes {
    author?: String,
    ingredient?: String
  }

  

  
  const Query = {
    getRecipe: async (
      parent: any,
      args: IGetRecipe,
      ctx: IContext
    )=> {

        const db: Db = ctx.db;
        const recipes = db.collection<RecipeMongo>("Recetas");
        const recipe = await recipes.findOne({ "_id": new ObjectId(args.id) }) as RecipeMongo;
  
        //let da: string;
        if (recipe) {
          //da = recipe.toString();
          return (recipe);
        }
        throw new ApolloError("Out of bonds", "404");
        
 
    },
  
    getRecipes: async (parent: any, args: IGetRecipes, ctx: IContext) => {

        const db: Db = ctx.db;
        const recipesCollection = db.collection("Recetas");

        
        if(args.author){
          const recip = recipesCollection.find({author: args.author}).toArray();
          
          return recip;

        }else if(args.ingredient){
          const recip = recipesCollection.find({ingredients:  args.ingredient}).toArray();
          
          return recip;

        }else {
          const recipes = await recipesCollection.find().toArray() ;
          
           if(recipes){ 
             const result = recipes.map(recip =>{
               
                return {
                ...recip,
                    
                  }
            });
            console.log(result);
            return result;
          }else  throw new ApolloError("No recipes", "404");
        }
        
        
    },
  
    getUser: async (
      parent: any,
      args: IGetUser,
      ctx: IContext
    ) => {
      
        const db: Db = ctx.db;
        const users = db.collection("Usuarios");
        const user = await users.findOne({ "_id": new ObjectId(args.id) });
        
        if (user) {
          
          return{
            ...user,
            id: user["_id"].toString()
          }
        }else{
          throw new ApolloError("Out of bonds", "404");
        }
     
    },
  
    getUsers: async (parent: any, args: any, ctx: IContext) => {
    
        const db: Db = ctx.db;
        const usersCollection = db.collection("Usuarios");
        const users = await usersCollection.find().toArray();
       if(users){
        const result = users.map((t) => {
          return {
            ...t,
            User: {
              t,
              id: t["_id"] ,
            },
          };
        });
        return result;
      }else{
        throw new ApolloError("Out of bonds", "404");
      }
      
    },
  };

       
  
  export {Query}
 export const Recipe = {
    ingredients: async(parent: {ingredients: string[]}, args: any,ctx: IContext) =>{
      const ingre =  ctx.db.collection("Ingredientes").find( {name: {$in: parent.ingredients}}).toArray();
      return ingre;

    },
    author:async(parent: {author: string}, args: any,ctx: IContext) =>{
      const auth = await ctx.db.collection("Usuarios").findOne({email: parent.author});
      return auth;


    }
  }

  export const Ingredient = {
    recipes: async(parent: {name: string}, args: any,ctx: IContext) =>{
      const recipess = await ctx.db.collection("Recetas").find({ingredients:  parent.name}).toArray();
      return recipess.map(r => ({
        ...r,
        _id: r._id.toString()
      }));
    }
  } 

  
  export const User = {
   recipes: async(parent:  {email: string}, args: any, ctx: IContext) =>{
     const recipess = await ctx.db.collection("Recetas").find({author: parent.email}).toArray();

     return recipess;

      
    }
  }