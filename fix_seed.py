import re

with open('backend/seed_db.py', 'r') as f:
    content = f.read()

cats_start = content.find('CATEGORIES_DATA = [')
cats_end = content.find(']', cats_start)

# We will use ast or simply split by '},'
cats_str = content[cats_start:cats_end+1]

import ast
try:
    cats_list = ast.literal_eval(cats_str.split('=', 1)[1].strip())
    
    seen_slugs = set()
    new_cats_list = []
    for c in cats_list:
        if c['slug'] not in seen_slugs:
            seen_slugs.add(c['slug'])
            new_cats_list.append(c)
            
    # Format back to string
    def format_dict(d):
        lines = ["  {"]
        for k, v in d.items():
            val = f'"{v}"' if isinstance(v, str) else ('None' if v is None else str(v))
            lines.append(f'    "{k}": {val},')
        lines.append("  }")
        return "\n".join(lines)
        
    new_cats_str = "CATEGORIES_DATA = [\n" + ",\n".join([format_dict(c) for c in new_cats_list]) + "\n]"
    
    content = content[:cats_start] + new_cats_str + content[cats_end+1:]
    
    with open('backend/seed_db.py', 'w') as f:
        f.write(content)
    print("Done fixing categories")
except Exception as e:
    print("Error:", e)
