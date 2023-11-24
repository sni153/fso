/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const Filter = ({ handleSearch }) => {
  return (
    <div>
      find countries <input type="text" onChange={handleSearch}></input>
    </div>
  );
};

const getWeatherData = async (city) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error("Error retrieving weather data:", error);
  }
};

const CountryView = ({ country }) => {
  const { area, capital, languages, flags } = country;
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    getWeatherData(capital).then((data) => {
      setWeatherData(data);
      console.log(data)
    });
  }, []);

  if (!weatherData) {
    return <div>Loading weather data...</div>;
  }

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
      <h3>Weather in {capital}</h3>
      <div>temperature: {weatherData.main.temp} Celsius</div>
      <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="weather icon" />
      <div>wind: {weatherData.wind.speed} m/s</div>
    </>
  );
};

const SearchResult = ({
  filteredCountries,
  searchTerm,
  selectedCountry,
  handleShow,
}) => {
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
