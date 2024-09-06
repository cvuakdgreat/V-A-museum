#! /usr/bin/python3
"""
     Flask web server
"""

import json
import os
from flask import Flask, render_template, request, current_app

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/products")
def products():
    return render_template("products.html")



@app.route("/collections")
def collections():
    # Get the current page number from query parameters
    page = request.args.get('page', 1, type=int)
    per_page = 15  # Number of records per page

    # Load JSON data
    file_path = os.path.join(current_app.root_path, 'static', 'data', 'vam_data_cleaned.json')
    with open(file_path) as f:
        data = json.load(f)
    
    # Pagination
    start = (page - 1) * per_page
    end = start + per_page
    records = data['records'][start:end]
    
    # Total number of pages
    total_records = len(data['records'])
    total_pages = (total_records + per_page - 1) // per_page

    # Determine page range for pagination
    visible_pages = 5
    half_window = visible_pages // 2

    if total_pages <= visible_pages:
        page_range = range(1, total_pages + 1)
    else:
        start_page = max(1, page - half_window)
        end_page = min(total_pages, page + half_window)
        if end_page - start_page + 1 < visible_pages:
            start_page = max(1, end_page - visible_pages + 1)
        page_range = range(start_page, end_page + 1)
    
    return render_template(
        "collections.html",
        records=records,
        page=page,
        total_pages=total_pages,
        page_range=page_range
    )


@app.route("/product_details/<string:id>")
def product_details(id):
    # Construct the path dynamically
    file_path = os.path.join(current_app.root_path, 'static', 'data', 'vam_data (1).json')
    
    # Load JSON data
    with open(file_path) as f:  
        data = json.load(f)
    
    # Find the record with the given ID
    record = next((item for item in data['records'] if item['systemNumber'] == id), None)
    
    if not record:
        return "Product not found", 404
    
    return render_template("product_details.html", record=record)


def extract_years_from_date(date_str):
    """Extracts all possible years from a date string."""
    years = set()
    if isinstance(date_str, str):  # Ensure date_str is a string
        parts = date_str.split('-')
        for part in parts:
            part = part.strip()
            if part.isdigit():
                years.add(int(part))
            elif 'century' in part:
                # Extract the century from phrases like 'late 19th century' or '19th century'
                try:
                    century = int(part.split(' ')[0])
                    if 'late' in part:
                        years.add(century + 100)
                    else:
                        years.add(century + 100)
                except ValueError:
                    continue
            elif part.startswith('ca.'):
                # Handle approximate years like 'ca. 1460'
                try:
                    year = int(part[3:].strip())
                    years.add(year)
                except ValueError:
                    continue
    return years


@app.route("/gallery")
def gallery():
    return render_template("gallery.html")




if __name__ == "__main__":
    app.run(debug=True)

