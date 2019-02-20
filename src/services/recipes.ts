import { Recipe } from "../models/recipe";
import { Ingredient } from "../models/ingredient";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth";
import 'rxjs/Rx';

@Injectable()
export class RecipesService {
    private recipes: Recipe[] = [];

    constructor(private http: HttpClient, private authService: AuthService){}

    addRecipe(title: string, description: string, difficulty: string, ingredients: Ingredient[]){
        this.recipes.push(new Recipe(title, description, difficulty, ingredients));
        console.log(this.recipes);
    }

    getRecipes(){
        return this.recipes.slice();
    }

    updateRecipe(index: number,
        title: string,
        description: string,
        difficulty: string,
        ingredients: Ingredient[]){

        this.recipes[index] = new Recipe(title, description, difficulty, ingredients);
    }

    removeRecipe(index: number){
        this.recipes.splice(index, 1);
    }

    storeList(token: string){
        const userId = this.authService.getActiveUser().uid;
        return this.http.put('https://ionic-recipebook-7ccb2.firebaseio.com/' + userId + '/recipes.json?auth=' + token, this.recipes);
    }

    fetchList(token: string){
        const userId = this.authService.getActiveUser().uid;
        return this.http.get('https://ionic-recipebook-7ccb2.firebaseio.com/' + userId + '/recipes.json?auth=' + token)
        .map((response: Response) => {
            const recipes: Recipe[] = response ? response : [];
            for(let item of recipes){
                if(!item.hasOwnProperty('ingredients')){
                    item.ingredients = []
                }
            }

            return recipes
        })
        .do((recipes: Recipe[]) => {
            if( recipes ){
                this.recipes = recipes;
            } else {
                this.recipes = [];
            }
        });
    }
}