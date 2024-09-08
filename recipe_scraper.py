import requests
import csv
import os
from bs4 import BeautifulSoup
import re
import openai
from dotenv import load_dotenv

load_dotenv()

import re

# Use OpenAI to retrieve the recipe details from a URL and structure the response
def get_recipe_from_openai(url):
    openai_api_key = os.getenv('OPENAI_API_KEY')
    prompt = f"Extract the ingredients, quantities, instructions, and notes from the following recipe URL: {url}"

    headers = {
        'Authorization': f'Bearer {openai_api_key}',
        'Content-Type': 'application/json',
    }
    data = {
        'model': 'gpt-4',
        'messages': [
            {'role': 'system', 'content': 'You are a helpful assistant that extracts recipes.'},
            {'role': 'user', 'content': prompt}
        ],
        'max_tokens': 1000,  # Adjust token limit
    }

    response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=data)
    
    if response.status_code == 200:
        result = response.json()
        raw_text = result['choices'][0]['message']['content']
        print(f"OpenAI Recipe Response: {raw_text}")  # Debugging purpose

        # Parse the raw text into a structured format (dictionary)
        parsed_recipe = parse_recipe_from_text(raw_text)

        return parsed_recipe
    else:
        print(f"OpenAI API Error: {response.status_code}")
        return None

# Parse the raw OpenAI response into a structured dictionary
def parse_recipe_from_text(raw_text):
    # Define regular expressions to extract different parts
    ingredients_pattern = re.compile(r"Ingredients:(.*?)(Quantities:|Instructions:)", re.DOTALL)
    quantities_pattern = re.compile(r"Quantities:(.*?)(Instructions:)", re.DOTALL)
    instructions_pattern = re.compile(r"Instructions:(.*?)(Notes:|$)", re.DOTALL)
    notes_pattern = re.compile(r"Notes:(.*)", re.DOTALL)

    # Extract the different sections using regular expressions
    ingredients_match = ingredients_pattern.search(raw_text)
    quantities_match = quantities_pattern.search(raw_text)
    instructions_match = instructions_pattern.search(raw_text)
    notes_match = notes_pattern.search(raw_text)

    # Get the content or return empty if not found
    ingredients = ingredients_match.group(1).strip() if ingredients_match else ""
    quantities = quantities_match.group(1).strip() if quantities_match else ""
    instructions = instructions_match.group(1).strip() if instructions_match else ""
    notes = notes_match.group(1).strip() if notes_match else ""

    # Return a structured dictionary
    return {
        'name': 'Recipe from OpenAI',  # Use a generic name or extract it from the URL
        'ingredients': ingredients,
        'quantities': quantities,
        'instructions': instructions,
        'notes': notes,
        'url': '',  # You can add the URL here if needed
    }


# Function to fallback to BeautifulSoup for scraping if OpenAI fails
def get_recipe_from_beautifulsoup(url):
    print(f"Falling back to BeautifulSoup for URL: {url}")
    
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers)
        print(f"Webpage retrieval status code: {response.status_code}")

        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            ingredients, instructions = extract_recipe_sections(soup)

            # Clean up the extracted content
            cleaned_ingredients = clean_text(', '.join(ingredients))
            cleaned_instructions = clean_text(' '.join(instructions))

            return {
                'name': soup.title.string.strip() if soup.title else url.split('/')[-1].replace('-', ' ').title(),
                'ingredients': cleaned_ingredients,
                'quantities': 'N/A',  # Quantities can be handled separately
                'notes': 'N/A',
                'instructions': cleaned_instructions,
                'sub_recipes': '',
                'url': url
            }
        else:
            print(f"Error: Unable to retrieve the webpage. Status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error retrieving webpage content: {e}")
        return None

# Function to split ingredients into smaller chunks for OpenAI token limits
def split_ingredients(ingredients, chunk_size=3):
    ingredients_list = ingredients.split(', ')
    for i in range(0, len(ingredients_list), chunk_size):
        yield ', '.join(ingredients_list[i:i + chunk_size])

# Function to clean the text by removing excessive whitespace
def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    return text

# Function to extract the ingredients and instructions from HTML using BeautifulSoup
def extract_recipe_sections(soup):
    ingredients = []
    instructions = []

    ingredients_section = soup.find(['h3', 'h2'], string=re.compile(r'Ingredients', re.IGNORECASE))
    if not ingredients_section:
        ingredients_section = soup.find(string=re.compile(r'Ingredients', re.IGNORECASE))

    if ingredients_section:
        for sibling in ingredients_section.find_next_siblings():
            if sibling.name in ['ul', 'ol', 'li', 'div']:
                for li in sibling.find_all('li'):
                    text = li.get_text(strip=True)
                    if re.search(r'Preheat|Instructions|Bake|Mix|Add', text, re.IGNORECASE):
                        break
                    ingredients.append(text)

    instructions_section = soup.find(['h3', 'h2'], string=re.compile(r'Instructions', re.IGNORECASE))
    if not instructions_section:
        instructions_section = soup.find(string=re.compile(r'Instructions', re.IGNORECASE))

    if instructions_section:
        for sibling in instructions_section.find_next_siblings():
            if sibling.name in ['ol', 'ul', 'li', 'p', 'div']:
                for step in sibling.find_all(['li', 'p']):
                    text = step.get_text(strip=True)
                    instructions.append(text)
    return ingredients, instructions

# Function to append the recipe to CSV after confirmation
def append_recipe_to_csv(recipe, filename='recipes.csv', directory='.'):
    file_exists = os.path.isfile(os.path.join(directory, filename))

    with open(os.path.join(directory, filename), 'a', newline='') as csvfile:
        fieldnames = ['Name', 'Ingredients', 'Quantities', 'Notes', 'Instructions', 'Sub-recipes', 'URL']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        if not file_exists:
            writer.writeheader()

        writer.writerow(recipe)

# Function to preview the recipe before appending
def preview_recipe(recipe):
    print("\n---- Recipe Preview ----")
    print(f"Name: {recipe['name']}")
    print(f"Ingredients: {recipe['ingredients']}")
    print(f"Quantities: {recipe['quantities']}")
    print(f"Instructions: {recipe['instructions']}")
    print(f"Notes: {recipe['notes']}")
    print(f"URL: {recipe['url']}")
    print("------------------------\n")

# Function to ask the user if they want to append the recipe to the CSV
def ask_to_append_recipe():
    choice = input("Do you want to append this recipe to the CSV? (yes/no): ").strip().lower()
    return choice == 'yes'

# Bing search function (already defined)
def bing_search(query, count=5):
    base_url = "https://api.bing.microsoft.com/v7.0/search"
    headers = {
        "Ocp-Apim-Subscription-Key": os.getenv('BING_SUBSCRIPTION_KEY'),
    }
    params = {
        'q': query,
        'count': count,
        'responseFilter': 'Webpages'
    }

    response = requests.get(base_url, headers=headers, params=params)
    if response.status_code == 200:
        results = response.json().get('webPages', {}).get('value', [])
        return [{'name': result['name'], 'url': result['url']} for result in results]
    else:
        print(f"Bing Search Error: {response.status_code}")
        return []

# Main function to run the recipe retrieval and appending logic
def save_multiple_recipes_with_fallback():
    # Debug statement to check if this section is running
    print("Ready to prompt for ingredients...")

    # Prompt the user for ingredients
    ingredients = input("Enter the ingredients for the recipe search (comma separated): ")
    print(f"Ingredients entered: {ingredients}")
    print("Searching for recipes...")

    # Step 1: Search for recipes using the Bing API based on the user input
    recipes = bing_search(ingredients)

    if not recipes:
        print("No recipes found.")
        return


    # Step 2: Display the found recipes and allow the user to select multiple ones
    print("\nRecipes found:")
    for idx, recipe in enumerate(recipes, 1):
        print(f"{idx}. {recipe['name']} - {recipe['url']}")

    selected_indexes = input("Select the recipe numbers you want to save (comma separated): ")
    selected_indexes = [int(i) - 1 for i in selected_indexes.split(',')]

    selected_recipes = [recipes[i] for i in selected_indexes if 0 <= i < len(recipes)]

    # Step 3: Fetch details for each selected recipe
    for selected_recipe in selected_recipes:
        print(f"\nFetching details for {selected_recipe['name']}...")
        recipe_details = get_recipe_from_openai(selected_recipe['url'])

        # Fallback to BeautifulSoup if OpenAI fails
        if not recipe_details:
            recipe_details = get_recipe_from_beautifulsoup(selected_recipe['url'])

        if recipe_details:
            preview_recipe(recipe_details)  # Show the recipe preview to the user
            if ask_to_append_recipe():  # Ask if the user wants to append the recipe
                append_recipe_to_csv(recipe_details)
                print(f"Recipe '{recipe_details['name']}' saved to CSV.")
            else:
                print(f"Skipped saving the recipe '{recipe_details['name']}'.")
        else:
            print(f"Failed to retrieve details for {selected_recipe['name']}.")

def test_input():
    user_input = input("Please enter some text: ")
    print(f"You entered: {user_input}")


if __name__ == "__main__":
    save_multiple_recipes_with_fallback()
