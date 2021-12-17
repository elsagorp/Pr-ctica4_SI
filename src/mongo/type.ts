export type UserMongo = {
    _id: string,
    email: string,
    token: string,
    recipe: string[]
}

export type IngredientMongo = {
    _id: string,
    name: string,
    author: string
}

export type RecipeMongo = {
    _id: string;
    name: string;
    description: string;
    ingredients: string[];
    author: string;
}