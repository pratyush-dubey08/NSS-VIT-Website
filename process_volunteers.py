import json

def process():
    volunteers = []
    with open('volunteers_raw.txt', 'r', encoding='utf-8') as f:
        lines = f.readlines()
        for line in lines:
            line = line.strip()
            if not line:
                continue
            parts = line.split('\t')
            if len(parts) >= 2:
                name = parts[0].strip().title()
                reg = parts[1].strip().upper()
                batch_str = reg[:2]
                batch = "20" + batch_str
                volunteers.append({
                    "name": name,
                    "registrationNumber": reg,
                    "batch": batch
                })
    
    # Sort by batch (descending) and then name
    volunteers.sort(key=lambda x: (-int(x["batch"]), x["name"]))

    with open('frontend/src/data/volunteers.ts', 'w', encoding='utf-8') as f:
        f.write("export const staticVolunteers = ")
        f.write(json.dumps(volunteers, indent=2))
        f.write(";\n")

if __name__ == "__main__":
    process()
