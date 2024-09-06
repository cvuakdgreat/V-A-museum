// scripts.js

// Function to fetch JSON data
async function fetchJSON() {
    try {
        const response = await fetch('/static/data/vam_data_cleaned.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Fetched data:', data);  // Debugging line
        return data;
    } catch (error) {
        console.error('Error fetching JSON data:', error);
        document.body.innerHTML += '<div id="error">Error loading data. Please try again later.</div>';
        return { records: [] };
    }
}

// Function to extract unique years from the JSON data
function extractYears(records) {
    const yearsSet = new Set(
        records
            .filter(record => typeof record._primaryDate === 'number')  // Ensure _primaryDate is a number
            .map(record => record._primaryDate)
    );

    return Array.from(yearsSet).sort((a, b) => a - b);
}

// Function to extract unique object types from the JSON data
function extractObjectTypes(records, year, yearRangeEnd) {
    const objectTypesSet = new Set(
        records
            .filter(record => typeof record._primaryDate === 'number' && record._primaryDate >= year && record._primaryDate < yearRangeEnd)
            .map(record => record.objectType || 'Unknown Object')
    );

    return Array.from(objectTypesSet).sort();
}

// Function to update visible items based on the year range and object type
function updateVisibleItems(year, yearRangeEnd, selectedObjectType) {
    const items = document.querySelectorAll('.scroll-item');
    items.forEach(item => {
        const itemYear = parseInt(item.getAttribute('data-year'));
        const itemObjectType = item.getAttribute('data-object-type');
        const isYearInRange = itemYear >= year && itemYear < yearRangeEnd;
        const isObjectTypeMatch = selectedObjectType === 'all' || itemObjectType === selectedObjectType;

        item.style.display = isYearInRange && isObjectTypeMatch ? 'block' : 'none';
    });
}

// Function to initialize the year range slider based on JSON data
function initializeYearRange(years) {
    const yearRange = document.getElementById('yearRange');
    const yearLabel = document.getElementById('yearLabel');

    const minYear = years[0];
    const maxYear = years[years.length - 1];

    yearRange.min = minYear;
    yearRange.max = maxYear;
    yearRange.value = minYear;
    yearLabel.textContent = `Year: ${minYear}-${minYear + 20}`;

    yearRange.addEventListener('input', debounce(function() {
        const year = parseInt(this.value);
        const yearRangeEnd = year + 20;
        yearLabel.textContent = `Year: ${year}-${yearRangeEnd}`;

        // Update the object type buttons based on the new year range
        const records = JSON.parse(this.dataset.records);
        updateObjectTypeButtons(records, year, yearRangeEnd);
        updateVisibleItems(year, yearRangeEnd, document.querySelector('.object-type-button.active')?.getAttribute('data-type') || 'all');
    }, 300));

    // Initial update
    updateVisibleItems(minYear, minYear + 20, 'all');
}

// Function to create and update object type buttons
function updateObjectTypeButtons(records, year, yearRangeEnd) {
    const objectTypeButtonsContainer = document.getElementById('objectTypeButtons');
    const objectTypes = extractObjectTypes(records, year, yearRangeEnd);

    // Clear and repopulate the object type buttons
    objectTypeButtonsContainer.innerHTML = '';

    // Create an "All" button
    const allButton = document.createElement('button');
    allButton.className = 'object-type-button active';
    allButton.setAttribute('data-type', 'all');
    allButton.textContent = 'All';
    objectTypeButtonsContainer.appendChild(allButton);

    objectTypes.forEach(type => {
        const button = document.createElement('button');
        button.className = 'object-type-button';
        button.setAttribute('data-type', type);
        button.textContent = type;
        objectTypeButtonsContainer.appendChild(button);
    });

    // Add event listeners to the buttons
    const buttons = document.querySelectorAll('.object-type-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            document.querySelector('.object-type-button.active').classList.remove('active');
            this.classList.add('active');

            updateVisibleItems(parseInt(document.getElementById('yearRange').value), parseInt(document.getElementById('yearRange').value) + 50, this.getAttribute('data-type'));
        });
    });
}

// Function to create scroll items dynamically based on JSON data
function createScrollItems(records) {
    const scrollContainer = document.getElementById('scrollContainer');
    scrollContainer.innerHTML = '';  // Clear any existing items

    records
        .filter(record => typeof record._primaryDate === 'number')  // Ensure _primaryDate is a number
        .forEach(record => {
            const year = record._primaryDate;
            const objectType = record.objectType || 'Unknown Object';
            const systemNumber = record.systemNumber || 'unknown';  // Use systemNumber as a unique identifier
            const imageUrl = record._images._primary_thumbnail || '/static/images/coming_soon.png';  // Image URL from JSON
            const displayName = record._primary_name || 'Unnamed Artefact';  // Use display name or _primary_name

            const scrollItem = document.createElement('div');
            scrollItem.className = 'scroll-item';
            scrollItem.setAttribute('data-year', year);
            scrollItem.setAttribute('data-object-type', objectType);
            scrollItem.setAttribute('title', displayName);  // Add the title attribute for hover effect

            // Add content to scroll item, e.g., an image
            scrollItem.innerHTML = `<img src="${imageUrl}" alt="Coming Soon" class="scroll-item-image" />`;

            const link = document.createElement('a');
            link.href = `/product_details/${systemNumber}`;  // Link to the product details page
            link.appendChild(scrollItem);

            scrollContainer.appendChild(link);
        });
}



// Debounce function to limit rate of event handling
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Initialize the app
async function initializeApp() {
    document.body.innerHTML += '<div id="loading">Loading...</div>';

    const data = await fetchJSON();
    const years = extractYears(data.records);
    initializeYearRange(years);

    createScrollItems(data.records);
    updateObjectTypeButtons(data.records, years[0], years[0] + 50);

    // Store records in the year range input for later use
    document.getElementById('yearRange').dataset.records = JSON.stringify(data.records);

    document.getElementById('loading').remove();
}

document.addEventListener('DOMContentLoaded', initializeApp);
