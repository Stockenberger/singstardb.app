import React, { useState, useEffect } from 'react';
import './styles.css';
import singstarData from './singstarData.json';
import ps2Logo from './ps2_logo.png';
import ps3Logo from './ps3_logo.png';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [filteredSongs, setFilteredSongs] = useState([]);

  useEffect(() => {
    // Initialize with all songs
    filterSongs('', 'All');
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterSongs(value, selectedCountry);
  };

  const handleCountryChange = (event) => {
    const value = event.target.value;
    setSelectedCountry(value);
    filterSongs(searchTerm, value);
  };

  const filterSongs = (searchTerm, country) => {
    let filtered = [];
    const countries = country === 'All' ? Object.keys(singstarData) : [country];
  
    countries.forEach((country) => {
      singstarData[country].forEach((version) => {
        let songs = version.songs.map(song => ({
          name: song,
          version: version.version,
          platforms: version.platforms,
          country: country
        }));
  
        filtered.push({ version: version.version, songs: songs });
      });
    });
  
    // Flatten the filtered array and remove duplicates
    filtered = filtered.map(item => ({
      version: item.version,
      songs: item.songs
    }));
  
    // Filter by search term
    if (searchTerm) {
      filtered.forEach((version) => {
        version.songs = version.songs.filter(song =>
          song.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
  
    setFilteredSongs(filtered);
  };
  
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">SingStarDB</h1>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search for a song"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="form-group">
        <select className="form-control" value={selectedCountry} onChange={handleCountryChange}>
          <option value="All">All</option>
          {Object.keys(singstarData).map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>
      <ul className="list-group">
        {filteredSongs.map((version, index) => (
          <React.Fragment key={index}>
            {version.songs.map((song, songIndex) => (
              <li key={songIndex} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{song.name}</span>
                <div className="d-flex flex-column align-items-end">
                  {song.platforms.includes('PS2') && song.platforms.includes('PS3') && (
                    <div className="d-flex">
                      <img src={ps2Logo} alt="PS2" style={{ width: '70px', marginRight: '5px' }} />
                      <img src={ps3Logo} alt="PS3" style={{ width: '70px', marginRight: '5px' }} />
                    </div>
                  )}
                  {!song.platforms.includes('PS3') && song.platforms.includes('PS2') && (
                    <img src={ps2Logo} alt="PS2" style={{ width: '70px', marginRight: '5px' }} />
                  )}
                  {!song.platforms.includes('PS2') && song.platforms.includes('PS3') && (
                    <img src={ps3Logo} alt="PS3" style={{ width: '70px', marginRight: '5px' }} />
                  )}
                  <span>{version.version}</span>
                </div>
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}

export default App;
