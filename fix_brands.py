with open('backend/seed_db.py', 'r') as f:
    lines = f.readlines()

brands_start = -1
for i, line in enumerate(lines):
    if line.startswith("BRANDS_DATA = ["):
        brands_start = i
        break

brands_end = -1
for i in range(brands_start, len(lines)):
    if lines[i].startswith("]"):
        brands_end = i
        break

import json
import re

brands_str = "".join(lines[brands_start:brands_end+1])

seen_names = set()
new_lines = []
skip = False
for line in brands_str.split('\n'):
    if skip:
        if '},' in line or '}' in line:
            skip = False
        continue
    
    name_match = re.search(r'"name": "([^"]+)"', line)
    if name_match:
        name = name_match.group(1).lower()
        if name in seen_names:
            while len(new_lines) > 0 and '{' not in new_lines[-1]:
                new_lines.pop()
            if len(new_lines) > 0:
                new_lines.pop()
            skip = True
            continue
        else:
            seen_names.add(name)
    new_lines.append(line)

new_brands_str = "\n".join(new_lines)
with open('backend/seed_db.py', 'w') as f:
    f.write("".join(lines[:brands_start]) + new_brands_str + "\n" + "".join(lines[brands_end+1:]))
print("Done fixing brands")
