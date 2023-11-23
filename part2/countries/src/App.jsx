/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const Filter = ({ handleSearch }) => {
  return (
    <div>
      find countries <input type="text" onChange={handleSearch}></input>
    </div>
  );
};

const CountryView = ({ country }) => {
  let { area, capital, languages, flags } = country;
  return (
    <>
      <h1>{country.name.common}</h1>
      <div>capital: {capital}</div>
      <p>area: {area}</p>
      <ul>
        <h3>languages:</h3>
        {Object.values(languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={flags.png} alt="png flag" />
    </>
  );
};

const SearchResult = ({ filteredCountries, searchTerm, selectedCountry, handleShow }) => {
  if (!searchTerm) {
    return <></>;
  }
  if (selectedCountry) {
    return <CountryView country={selectedCountry} />;
  }
  if (filteredCountries.length === 1) {
    let country = filteredCountries[0];
    return <CountryView country={country} />;
  }
  if (filteredCountries.length >= 10) {
    return <p>Too many matches, specify another filter</p>;
  }
  if (filteredCountries.length > 1 && filteredCountries.length <= 10) {
    return (
      <ul>
        {filteredCountries.map((country) => (
          <li key={country.cca2}>
            {country.name.common}
            <button onClick={() => handleShow(country)}>show</button>
          </li>
        ))}
      </ul>
    );
  }
};

function App() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSearch = (event) => {
    let countryName = event.target.value.trim().toLowerCase();
    setSearchTerm(countryName);
    setSelectedCountry(null);
  };

  const handleShow = (country) => {
    setSelectedCountry(country);
  };

  let filteredCountries = countries.filter((country) => {
    return country.name.common.toLowerCase().includes(searchTerm);
  });

  return (
    <>
      <Filter handleSearch={handleSearch} />
      <SearchResult
        filteredCountries={filteredCountries}
        searchTerm={searchTerm}
        selectedCountry={selectedCountry}
        handleShow={handleShow}
      />
    </>
  );
}

export default App;
