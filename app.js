/**
 * SingStarDB - Vanilla JS Core Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const countrySelect = document.getElementById('countrySelect');
    const songListContainer = document.getElementById('songList');
    const resultsCountEl = document.getElementById('resultsCount');
    const noResultsEl = document.getElementById('noResults');

    // Global Application State
    let rawData = null; // Holds the raw unflattened JSON
    let flattenedSongs = []; // Holds the optimized, flattened array of all songs
    let availableCountries = []; // Array of global country keys

    // Initialize Application
    async function init() {
        try {
            resultsCountEl.textContent = "Loading database...";
            
            // Fetch the JSON Data
            const response = await fetch('./data/singstarData.json');
            if (!response.ok) throw new Error('Failed to load song data');
            
            rawData = await response.json();
            
            // Process the Data
            processData();
            populateCountrySelect();
            
            // Initial Render
            renderSongs();
            
            // Setup Event Listeners
            setupEventListeners();
            
        } catch (error) {
            console.error("Error initializing app:", error);
            resultsCountEl.textContent = "Error loading database. Please check console.";
            resultsCountEl.style.color = "var(--accent-pink)";
        }
    }

    /**
     * Flattens the nested JSON structure into a single 1D array of song objects
     * for O(N) optimized searching and filtering.
     */
    function processData() {
        flattenedSongs = [];
        availableCountries = Object.keys(rawData);

        // Iterate through each Country key (e.g. DE, UK, etc)
        availableCountries.forEach(country => {
            const countryVersions = rawData[country];
            
            // Iterate through versions (e.g. "SingStar", "SingStar Party")
            if (Array.isArray(countryVersions)) {
                countryVersions.forEach(versionObj => {
                    const versionName = versionObj.version;
                    const platforms = versionObj.platforms || [];
                    
                    // Iterate through songs in that version
                    if (Array.isArray(versionObj.songs)) {
                        versionObj.songs.forEach(songString => {
                            // Extract Artist - Title logic
                            let artist = "";
                            let title = songString;
                            
                            const splitIndex = songString.indexOf(" - ");
                            if (splitIndex !== -1) {
                                artist = songString.substring(0, splitIndex).trim();
                                title = songString.substring(splitIndex + 3).trim();
                            }

                            // Build simplified flattened object
                            flattenedSongs.push({
                                rawString: songString,
                                artist: artist,
                                title: title,
                                lowerSearchString: songString.toLowerCase(), // Cache lowercase for faster search
                                country: country,
                                version: versionName,
                                platforms: platforms
                            });
                        });
                    }
                });
            }
        });
        
        console.log(`Processed ${flattenedSongs.length} total songs.`);
    }

    /**
     * Populates the country dropdown filter
     */
    function populateCountrySelect() {
        // We keep the "All" option already in HTML, and append dynamics
        availableCountries.forEach(countryKey => {
            const option = document.createElement('option');
            option.value = countryKey;
            
            // Simple mapping for display purposes if needed, otherwise use raw key
            // (e.g. DE -> Germany)
            const displayMap = {
                "DE": "Germany (DE)",
                "UK": "United Kingdom (UK)",
                "US": "United States (US)"
            };
            
            option.textContent = displayMap[countryKey] || countryKey;
            countrySelect.appendChild(option);
        });
    }

    /**
     * Filters and renders the song list to the DOM based on current UI state
     */
    function renderSongs() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCountry = countrySelect.value;
        
        console.time("filtering"); // Debug benchmark
        
        // Filter the flattened array
        const results = flattenedSongs.filter(song => {
            // 1. Check Country
            const matchesCountry = (selectedCountry === "All") || (song.country === selectedCountry);
            if (!matchesCountry) return false;
            
            // 2. Check Search Term (using pre-calculated lowercased string)
            const matchesSearch = searchTerm === "" || song.lowerSearchString.includes(searchTerm);
            return matchesSearch;
        });
        
        console.timeEnd("filtering");
        
        // Update Meta UI
        resultsCountEl.textContent = `Found ${results.length} songs`;
        
        // Render to DOM safely (using DocumentFragment for performance)
        songListContainer.innerHTML = '';
        
        if (results.length === 0) {
            noResultsEl.classList.remove('hidden');
        } else {
            noResultsEl.classList.add('hidden');
            
            // Cap DOM rendering at 500 items to prevent browser lag on empty search
            // The user will usually type to filter down anyway
            const displayLimit = 500;
            const itemsToRender = results.slice(0, displayLimit);
            
            if (results.length > displayLimit) {    
                resultsCountEl.textContent = `Found ${results.length} songs (Showing top ${displayLimit})`;
            }

            const fragment = document.createDocumentFragment();
            
            itemsToRender.forEach((song, index) => {
                const li = document.createElement('li');
                li.className = 'song-item';
                li.style.animationDelay = `${Math.min(index * 0.02, 0.5)}s`; // Stagger animation
                
                // Construct the inner HTML securely
                li.innerHTML = `
                    <div class="song-info">
                        <span class="song-title">${escapeHTML(song.rawString)}</span>
                        <div class="song-version">
                            <span class="badge-country">${escapeHTML(song.country)}</span>
                            <span>${escapeHTML(song.version)}</span>
                        </div>
                    </div>
                    <div class="song-platforms">
                        ${renderPlatformLogos(song.platforms)}
                    </div>
                `;
                
                fragment.appendChild(li);
            });
            
            songListContainer.appendChild(fragment);
        }
    }

    /**
     * Generates HTML string for platform logos
     */
    function renderPlatformLogos(platformsArr) {
        if (!platformsArr || platformsArr.length === 0) return '';
        
        return platformsArr.map(p => {
            if (p === 'PS2') {
                return `<img src="./assets/ps2_logo.png" alt="PS2" class="platform-logo logo-ps2" />`;
            } else if (p === 'PS3') {
                return `<img src="./assets/ps3_logo.png" alt="PS3" class="platform-logo logo-ps3" />`;
            } else {
                return `<span class="badge-country">${escapeHTML(p)}</span>`;
            }
        }).join('');
    }

    /**
     * Utility: Basic HTML escaping to prevent XSS (Even though JSON is static)
     */
    function escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * Wire up input events
     */
    function setupEventListeners() {
        // Use standard input event for instantaneous feedback, since our filter is fast enough
        searchInput.addEventListener('input', () => {
            renderSongs();
        });

        countrySelect.addEventListener('change', () => {
            renderSongs();
        });
    }

    // Kick off
    init();
});
