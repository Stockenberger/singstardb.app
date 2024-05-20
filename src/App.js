import React, { useState, useEffect } from 'react';
import './styles.css';
import singstarData from './singstarData.json';

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
        if (version.platforms.includes('PS2') || version.platforms.includes('PS3')) {
          version.songs.forEach((song) => {
            if (song.toLowerCase().includes(searchTerm.toLowerCase())) {
              filtered.push({
                name: song,
                singstarVersion: version.version,
                country: country,
                platforms: version.platforms
              });
            }
          });
        }
      });
    });

    setFilteredSongs(filtered);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 logo">SingStarDB<span className="lowercase">.app</span></h1>
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
      <ul className="list-group" style={{ width: '100%' }}>
  {filteredSongs.map((song, index) => (
    <li key={index} className="list-group-item">
      <div className="d-flex justify-content-between align-items-center">
        <div style={{ width: '65%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {song.name}
        </div>
        <div style={{ width: '30%', textAlign: 'right' }}>
          <div>
            {song.platforms.includes('PS2') && <img src="/ps2.png" alt="PS2" style={{ height: '15px' }} />}
            {song.platforms.includes('PS3') && <img src="/ps3.png" alt="PS3" style={{ height: '15px' }} />}
          </div>
          <div>{song.singstarVersion}</div>
        </div>
      </div>
    </li>
  ))}
</ul>

    </div>
  );
}

export default App;
