import { Db, ObjectId } from "mongodb";
import { ApolloError} from "apollo-server";
import { IContext} from "../types";
import { RecipeMongo, UserMongo, IngredientMongo } from "../mongo/type";
import bcrypt from"bcrypt";
import { v4 } from "uuid";


interface IAddRecipeArgs {
 recipe:{
    name: string;
    description: string;
    ingredients: string[];

 }
}

interface IUpdateRecipeArgs {
  recipe:{
    name: string;
    description: string;
    ingredients: string[];
  },
  id: string
    

}

interface IDeleteRecipeArgs {
  id: string;
  
}

interface IAddIngredientArgs {
    name: string;


}


interface IDeleteIngredientArgs {
  id: string;

}


const salt = 10;
const Mutation = {

  AddRecipe: async (parent: any, args: IAddRecipeArgs, ctx: IContext ) => {
      const db: Db = ctx.db;
      const recipesCollection  = await db.collection("Recetas");
      const ingredientss = await db.collection("Ingredientes");

      const found = await recipesCollection.findOne({ name: args.recipe.name, author: ctx.user?.email });

      if (found) throw new ApolloError("Recipe already in DB", "403");
      if (args.recipe.ingredients){
        await args.recipe.ingredients.forEach(async (i: string) => {
          const ingred = await ingredientss.findOne({name: i,author: ctx.user?.email});
          
          if(!ingred)  await ingredientss.insertOne({name: i, author: ctx.user?.email});
          else  console.log(i);
        })

          const recip ={
            name: args.recipe.name,
            description: args.recipe.description,
            ingredients: args.recipe.ingredients,
            author: ctx.user?.email,
          };
          await recipesCollection.insertOne(recip);

            await db.collection("Usuarios").updateOne({email: ctx.user?.email},{$addToSet:{recipes:{$each:[ args.recipe.name]}}});
              return "Recipe added in DB";
        }else{
            throw new ApolloError("We couldn't add the recipe", "403");
         }
      

  },
  

  DeleteRecipe: async (parent: any, args: IDeleteRecipeArgs, ctx: IContext) => {
  
      const db: Db = ctx.db;
      const recipesCollection= db.collection("Recetas");
      if(ctx.user?.email){
        const recet = await recipesCollection.findOne({"_id": new ObjectId(args.id), author: ctx.user?.email});
        if(recet) {
          await recipesCollection.deleteOne(recet);
        return "Receta eliminada";
        }else {
          throw new ApolloError("you cannot delete a recipe that is not yours", "404");
        }
      }

  },

  UpdateRecipe: async (parent: any, args: IUpdateRecipeArgs, ctx: IContext) => {
    
      const db: Db = ctx.db;
      const recipesCollection = db.collection<RecipeMongo>("Recetas");

      const found = await recipesCollection.findOne({ "_id": new ObjectId(args.id)});
      if (!found) throw new ApolloError(`Recipe with id ${args.id} does not exist`, "403");
      else{
          if(found.author != ctx.user?.email)  throw new ApolloError("You did not create this recipe ", "403");
          else{
 
                //{ name: args.recipe?.name, description: args.recipe?.description, ingredients: args.recipe?.ingredients}
                await recipesCollection.updateOne({ "_id": new ObjectId(args.id)},  { $set:{ name: args.recipe?.name, description: args.recipe?.description, ingredients: args.recipe?.ingredients}});
                return "Recipe updated";
          }

    }
    

  },
  AddIngredient: async (
    parent: any,
    args: IAddIngredientArgs,
    ctx: IContext
  ) => {
    
    const db: Db = ctx.db;
    const ingredCollection  = db.collection("Recetas");
    

    const found = await ingredCollection.findOne({ name: args.name  });
    if (found) throw new ApolloError("Ingredient already in DB", "403");
    else{
      const ingred ={
        name: args.name,
        author: ctx.user?.email
      };
      ingredCollection.insertOne(ingred);
      return "Ingredient added in DB";;
    }

      
  
  },
  DeleteIngredient: async (   parent: any, args: IDeleteIngredientArgs, ctx: IContext)=> {
  
      const db: Db = ctx.db;
      const ingreCollection= db.collection<IngredientMongo>("Ingredientes");
      const ing = await ingreCollection.findOne({ "_id": new ObjectId(args.id)});
      if(ing){
        if(ing["author"] == ctx.user?.email ){
            await db.collection("Recetas").deleteMany({ingredients: ing.name});
          await ingreCollection.deleteOne({ "_id": new ObjectId(args.id) });
          return "Ingrediente eliminado";
        }else{
          throw new ApolloError("You cannot delete an ingredient that you did not create", "404");
        }
      }else{
        throw new ApolloError("That ingredient does not exist", "404");
      }
      
    
   
  },

  SignIn: async ( parent: any, args: { email: string; pwd: string },ctx: IContext) => {   
    const db: Db = ctx.db;
    const userColl = db.collection("Usuarios");
   const exists = await userColl.findOne({ email: args.email });
      if (exists) {
        throw new ApolloError("User email already exists");
        
      }else{
      
        const pwns = await bcrypt.hashSync(args.pwd,salt );
        await  userColl.insertOne({ email: args.email, pwd: pwns, token: null });
        
        return "User registered in DB";;
      }
   
  },

  LogIn: async (parent: any,args: { email: string; pwd: string },ctx: IContext)=> {  
    const users = await ctx.db
    .collection("Usuarios");
    const user = await users.findOne({ email: args.email });
    const salt = 10; //await bcrypt.genSalt(10);
     if(user){
        const auth = await bcrypt.compare(args.pwd,user['pwd']);
        if(auth){
          const token = v4();
          await users.updateOne({ email: args.email }, { $set: { token: token } });
        /* setTimeout(() => {
            users
              .updateOne({ email: args.email }, { $set: { token: "" } });
          }, 60 * 60 * 1000);*/
          return token;
        } else {
          throw new ApolloError("User and/or password do not match", "404");
        }
      }else throw new ApolloError("User and/or password do not match", "404");
  
  },

  LogOut: async (parent: any, args: any, ctx: IContext) => {
    
      const exists = await ctx.db
        .collection("Usuarios")
        .findOne({ email: ctx.user?.email, token: ctx.user?.token });
      if (exists) {
        await ctx.db
          .collection("Usuarios")
          .updateOne({ email: ctx.user?.email }, { $set: { token: null } });
        return "LogOut";
      } else {
        throw new ApolloError("Unexpected error");
      }
 
  },

  SignOut: async (parent: any, args: any, ctx: IContext) => {
    
      const exists = await ctx.db
        .collection("Usuarios")
        .findOne({ email: ctx.user?.email});
      if (exists) {
        await ctx.db
          .collection("Usuarios")
          .deleteOne(exists);
        await ctx.db
          .collection("Recetas")
          .deleteMany({ author:  ctx.user?.email});
        return "SignOut";
      } else {
        throw new ApolloError("Unexpected error");
      }
   
  },
};

export {Mutation }
