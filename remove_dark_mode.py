import os
import re

directory = r'c:\Users\risha\Desktop\NSS Website\frontend\src'

def remove_dark_classes(text):
    # Matches dark:something
    return re.sub(r'\bdark:[\w\-/]+\b', '', text)

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = remove_dark_classes(content)
            
            # Remove any double spaces created by the regex
            new_content = re.sub(r' +', ' ', new_content)
            new_content = new_content.replace(' "', '"').replace('" ', '"')
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
