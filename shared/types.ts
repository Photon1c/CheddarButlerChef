export interface Recipe {
  name: string;
  ingredients?: string;
  steps?: string;
  url?: string;
  tags?: string[];
  savedAt?: string;
}

export interface GenerateRecipesRequest {
  ingredients: string;
}

export interface GenerateRecipesResponse {
  recipes: Recipe[];
  error?: string;
}