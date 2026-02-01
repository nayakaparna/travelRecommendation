const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');
const resultContainer = document.getElementById('resultContainer');
const homeContent = document.getElementById('home-content-wrapper');

function searchCondition() {
    const inputField = document.getElementById('conditionInput');
    if (!inputField) {
        console.error("Input field 'conditionInput' not found!");
        return;
    }
    const input = inputField.value.toLowerCase();
    
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            console.log("Data fetched:", data); // Check if this shows in Console
            let found = [];

            if (input === 'beach' || input === 'beaches') {
                found = data.beaches;
            } else if (input === 'temple' || input === 'temples') {
                found = data.temples;
            } else if (input === 'country' || input === 'countries') {
                found = data.countries.flatMap(country => country.cities);
            } else {
                const countryMatch = data.countries.find(c => c.name.toLowerCase() === input);
                if (countryMatch) found = countryMatch.cities;
            }

            if (found.length > 0) {
                displayResults(found);
                homeContent.style.display = 'none';
            } else {
                resultContainer.innerHTML = '<p class="error">No results found.</p>';
            }
        })
        .catch(error => console.error('Error:', error));
}

// MAKE SURE THIS FUNCTION IS PRESENT
function displayResults(items) {
    resultContainer.innerHTML = ''; 
    items.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');

        // Get the formatted time for this specific item
        const currentTime = getLocalTime(item.name);

        resultItem.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <div class="result-text">
                <h3>${item.name}</h3>
                <p class="local-time"><strong>Current Local Time:</strong> ${currentTime}</p>
                <p>${item.description}</p>
                <button class="visit-btn">Visit</button>
            </div>
        `;
        resultContainer.appendChild(resultItem);
    });
}

btnSearch.addEventListener('click', searchCondition);
btnClear.addEventListener('click', () => {
    document.getElementById('conditionInput').value = '';
    resultContainer.innerHTML = '';
    homeContent.style.display = 'block';
});

function clearSearch() {
    // 1. Clear the text inside the search input box
    const searchInput = document.getElementById('conditionInput');
    if (searchInput) {
        searchInput.value = '';
    }

    // 2. Remove all recommendation cards from the result container
    const resultContainer = document.getElementById('resultContainer');
    if (resultContainer) {
        resultContainer.innerHTML = '';
    }

    // 3. Bring back the Home page content (Welcome text, etc.)
    const homeContent = document.getElementById('home-content-wrapper');
    if (homeContent) {
        homeContent.style.display = 'block'; 
        // Note: use 'flex' if your home content was originally centered with flexbox
    }
    
    console.log("Search results cleared and Home content restored.");
}

if (btnClear) {
    btnClear.addEventListener('click', clearSearch);
}

function getLocalTime(placeName) {
    let timeZone;
    
    // Determine the time zone based on the name from your JSON
    if (placeName.includes("Australia")) {
        timeZone = 'Australia/Sydney';
    } else if (placeName.includes("Japan")) {
        timeZone = 'Asia/Tokyo';
    } else if (placeName.includes("Brazil")) {
        timeZone = 'America/Sao_Paulo';
    } else if (placeName.includes("Cambodia")) {
        timeZone = 'Asia/Phnom_Penh';
    } else if (placeName.includes("India")) {
        timeZone = 'Asia/Kolkata';
    } else if (placeName.includes("French Polynesia")) {
        timeZone = 'Pacific/Tahiti';
    }

    // Format options provided in your instructions
    const options = { 
        timeZone: timeZone, 
        hour12: true, 
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric' 
    };
    
    // Create the time string
    return new Date().toLocaleTimeString('en-US', options);
}

