import { useEffect, useState } from "react";
import styles from "./App.module.scss";
import searchIcon from "./assets/search-icon.png";
import axios from "axios";

function App() {
  const [cityInput, setCityInput] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [city, setCity] = useState(null);
  const [error, setError] = useState(false);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);

  const key = "a297fd66dca3f11fad5615916c2dd17c";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&appid=${key}&units=metric`;
  const openUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords?.lat}&lon=${coords?.lon}&appid=${key}&units=metric&`;
  const weatherIcon = `http://openweathermap.org/img/wn/${city?.weather[0].icon}@2x.png`;
  const date = new Date().toLocaleDateString("en-En", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const weekDay = new Date().toLocaleDateString("en-En", { weekday: "long" });

  const handleOnChange = (e) => {
    setCityInput(e.target.value);
  };

  const onCityEnter = (e) => {
    const value = cityInput.trim();
    if (e.key === "Enter" && value) {
      setCitySearch(value);
    }
  };

  const onClickSearch = (e) => {
    e.stopPropagation();
    const value = cityInput.trim();
    if (value) {
      setCitySearch(value);
    }
  };

  useEffect(() => {
    if (citySearch) {
      axios
        .get(url)
        .then((res) => {
          setError(false);
          setCity(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Cannot find your location. Try another one.");
          setLoading(false);
          setCity(null);
        });
    }
    setCityInput("");
  }, [citySearch, url]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Cannot find your location. Try another one.");
      setLoading(false);
      return;
    }

    const handleSuccess = (position) => {
      setCoords({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
      setLoading(false);
    };

    const handleError = () => {
      setError("Cannot find your location. Try another one.");
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
  }, []);

  useEffect(() => {
    if (coords) {
      axios.get(openUrl).then((res) => setCity(res.data));
    }
  }, [coords, openUrl]);

  return (
    <div className="wrapper">
      <div className="content">
        <header className={styles.header}>
          <div className="container">
            <div className={styles.header__search}>
              <input
                onKeyDown={onCityEnter}
                onChange={handleOnChange}
                value={cityInput}
                type="text"
                placeholder="Search"
                className={styles.header__search_input}
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "Search")}
              />
              <button className={styles.header__search_btn}>
                <img src={searchIcon} alt="Search" onClick={onClickSearch} />
              </button>
            </div>
          </div>
        </header>
        <main>
          {loading && (
            <section className={styles.info}>
              <h1 className={styles.alter}>Loading...</h1>
            </section>
          )}
          {error && (
            <section className={styles.info}>
              <h1 className={styles.alter}>{error}</h1>
            </section>
          )}
          {city && (
            <>
              <section className={styles.info}>
                <div className="container">
                  <header className={styles.info__city}>
                    <h1 className={styles.info__city_title}>{city.name}</h1>
                  </header>
                  <div className={styles.temp}>
                    <img src={weatherIcon} alt={city.weather[0].description} />
                    <h2 className={styles.temp__title}>
                      {city.main.temp.toFixed(0)}°c
                    </h2>
                  </div>
                </div>
              </section>
              <section className={styles.details}>
                <div className="container">
                  <div className={styles.details__grid}>
                    <header className={styles.details__date}>
                      <h3>{weekDay}</h3>
                      <p>{date}</p>
                    </header>
                    <article className={styles.left}>
                      <ul className={styles.weather__list}>
                        <li>Feels like: {city.main.feels_like.toFixed(0)}°c</li>
                        <li>Max.: {city.main.temp_max.toFixed(0)}°c</li>
                        <li>Min.: {city.main.temp_min.toFixed(0)}°c</li>
                      </ul>
                    </article>
                    <article className={styles.right}>
                      <ul className={styles.weather__list}>
                        <li>{city.weather[0].description.toUpperCase()}</li>
                        <li>Wind: {city.wind.speed.toFixed(0)} m/s</li>
                        <li>Humidity: {city.main.humidity}%</li>
                      </ul>
                    </article>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
