'''
'generate_password.py' creates a custom password for the user if they choose to generate one. 
LouisFitness website is a personal project with no info that would
compromise the security of the user, thus allowing for a fun-custom password generator
'''

import string
import random
import os

# Text file for random password generator
with open(os.path.abspath(os.path.dirname(__file__)) + '/random_words_for_password.txt', encoding="utf8") as f:
    lines = f.read().splitlines()

# Function to generate the password using the text file
def generate_password():
    numbers_list = "1234567890"
    symbols_list = string.punctuation

    min_length = 9
    max_length = 25

    # Generate random characters to add to password
    numbers_to_add = random.randint(1, 2)
    numbers_string = ""
    for _ in range(numbers_to_add):
        numbers_string += random.choice(numbers_list)

    symbols_to_add = random.randint(1, 2)
    symbols_string = ""
    for _ in range(symbols_to_add):
        symbols_string += random.choice(symbols_list)
        
    characters_added = numbers_to_add + symbols_to_add

    # Grab the random words until the length of the words, numbers, and symbols are between min length and max length (inclusive)
    words = []
    while True:
        random_word = random.choice(lines)
        if characters_added + len(random_word) <= max_length:
            words.append(random_word[0].upper() + random_word[1:]) # Put uppercase letter at beginning of each random word to remember password more easily
            characters_added += len(random_word)

        if characters_added >= min_length:
            break

    words_symbols_numbers = words # Now we need to add symbols and numbers to this

    # Add the numbers (as one string) and the symbols (as one string) to a random word:
    # either at the beginning of that word or at the end
    rand_numbers_word_idx = random.randint(0, len(words_symbols_numbers) - 1)
    rand_symbols_word_idx = random.randint(0, len(words_symbols_numbers) - 1)

    # 50% chance the numbers will be appended to the beginning of the random word
    if random.random() < .5:
        words_symbols_numbers[rand_numbers_word_idx] = numbers_string + words_symbols_numbers[rand_numbers_word_idx]
    # Same for the end
    else:
        words_symbols_numbers[rand_numbers_word_idx] = words_symbols_numbers[rand_numbers_word_idx] + numbers_string

    # Same goes for the symbols
    if random.random() < .5:
        words_symbols_numbers[rand_symbols_word_idx] = symbols_string + words_symbols_numbers[rand_symbols_word_idx]
    else:
        words_symbols_numbers[rand_symbols_word_idx] = words_symbols_numbers[rand_symbols_word_idx] + symbols_string

    # add the words, numbers, and symbols to the password
    generated_password = ""
    for next_str in words_symbols_numbers:
        generated_password += next_str

    return generated_password