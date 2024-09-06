import json
import re
import os

def convert_to_earliest_year(date_str):
    if not date_str:
        return None
    
    date_str = re.sub(r'ca\.?|circa\s*', '', date_str, flags=re.IGNORECASE).strip()

    range_match = re.match(r'(\d{4})-(\d{4})', date_str)
    if range_match:
        return int(range_match.group(1))

    year_match = re.match(r'(\d{4})', date_str)
    if year_match:
        return int(year_match.group(1))

    century_match = re.match(r'(\d{1,2})(st|nd|rd|th) century', date_str)
    if century_match:
        century = int(century_match.group(1))
        return (century - 1) * 100

    period_match = re.match(r'late (\d{1,2})(st|nd|rd|th) century', date_str)
    if period_match:
        century = int(period_match.group(1))
        return (century - 1) * 100 + 50
    
    return None

def preprocess_json(input_file, output_file):
    with open(input_file, 'r') as f:
        data = json.load(f)
    
    for record in data['records']:
        date_str = record.get('_primaryDate', '')
        earliest_year = convert_to_earliest_year(date_str)
        record['_primaryDate'] = earliest_year
    
    os.makedirs(os.path.dirname(output_file), exist_ok=True)  # Ensure output directory exists
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=4)

# Use raw strings or forward slashes for file paths
input_file = r'static\data\vam_data (1).json'  # raw string to avoid escape sequence issues
output_file = r'static\data\vam_data_cleaned.json'

# Preprocess the JSON file
preprocess_json(input_file, output_file)

print(f"Processed data saved to {output_file}")
