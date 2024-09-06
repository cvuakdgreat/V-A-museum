
# V&A Museum Object Explorer

This project is a web-based application that allows users to explore various objects from the V&A Museum's collection. It features a gallery of objects, which users can filter based on the year of creation and object type. Users can also view detailed information about each object.

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Acknowledgements](#acknowledgements)

## Project Overview
This project is a Flask-based web application that displays a collection of objects from the V&A Museum. The data is presented as a gallery of items that can be filtered by year and object type. Users can click on an object to view more detailed information on a product details page.

## Technologies Used
- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Data**: JSON format
- **Deployment**:  Render
  
## Features
- Allows users to filter the collection by a range of years.
- Enables filtering by object types.
- Provides detailed information about individual objects.
  
## Installation

To run this project locally, follow the instructions below:

### Prerequisites
- Python 3.x
- Flask
- Virtualenv (optional, but recommended)

### Steps
1. **Clone the repository**:
    ```bash
    git clone https://github.com/cvuakdgreat/your-repo.git
    cd your-repo
    ```

2. **Create a virtual environment** (optional, but recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Run the Flask app**:
    ```bash
    flask run
    ```
    The app will be accessible at `http://127.0.0.1:5000/`.

## Usage

1. **Home Page**:
   - The home page displays links at nav bar and to gallery


2. **Gallery Page**:
	- The home page displays a gallery of 50 randomly selected objects.
	- Use the year slider to filter objects by creation year.
	- Select object types to further narrow down the displayed items.


3. **Product Details**:
   - Click on any object to view detailed information about it, such as its image, description, and additional metadata.



## Acknowledgements

This project uses data from the V&A Museum. Special thanks to the contributors of open-source libraries such as Flask, Bootstrap, and others used in this project.

---