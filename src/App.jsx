import { useState } from "react";
import "./css/App.css";

import { UilLocationPoint } from "@iconscout/react-unicons";

// Grab the Token from https://www.weatherapi.com/
const Token = "";

function App() {
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLoading(true);

          fetch(
            "http://api.weatherapi.com/v1/current.json?key=" +
              Token +
              "&q=" +
              pos.coords.latitude +
              "," +
              pos.coords.longitude
          )
            .then((res) => res.json())
            .then((data) => {
              if (data.error) {
                setLoading(false);
                setError(data.error);
                setWeather(null);
                setTimeout(() => {
                  setError(null);
                }, 5000);
                return;
              }

              setWeather(data);
              setLoading(false);
            })
            .catch((err) => {
              setError(err);
              setTimeout(() => {
                setError(null);
              }, 2000);
            });
        },
        (error) => {
          console.error(error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  function GrabWeatherInput() {
    setLoading(true);
    fetch(
      "http://api.weatherapi.com/v1/current.json?key=" + Token + "&q=" + input
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setLoading(false);
          setError(data.error);
          setWeather(null);
          setInput("");
          setTimeout(() => {
            setError(null);
          }, 5000);
          return;
        }

        setWeather(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setTimeout(() => {
          setError(null);
        }, 2000);
      });
  }

  return (
    <div className="App bg-stone-400 max-h-min h-screen w-full">
      <h1 className="text-center text-5xl pt-5 pb-5 text-black">
        Simple Weather App by JKane!
      </h1>
      {error ? (
        <div className="alert alert-error shadow-lg max-w-xl absolute bottom-0 right-0">
          <div className="ml-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Error! There was an error grabbing the Weather for that Location!
            </span>
          </div>
        </div>
      ) : null}
      <div
        className={
          weather
            ? `bg-white max-w-xl max-h-full md:max-w-screen-sm absolute top-44 mt-52 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg scale-110 duration-700`
            : "bg-white max-w-xl max-h-full md:max-w-screen-sm h-44 absolute top-44 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg"
        }
      >
        <h1 className="text-black text-xl m-3 text-center">
          Please search for a Location!
        </h1>
        <div className="flex">
          <a
            className="flex items-center justify-center m-3 text-black hover:scale-105 duration-300"
            onClick={() => getLocation()}
          >
            <UilLocationPoint size={35} />
          </a>
          <input
            type="text"
            className="m-3 bg-stone-300 focus:outline-zinc-700 h-14 rounded-md w-32 text-2xl text-black md:w-full"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <button
            className={`${
              loading ? "btn btn-success opacity-30" : "btn btn-success"
            } ${
              input.length === 0 ? "btn-disabled opacity-30" : ""
            } m-3 h-14 flex items-center justify-center`}
            onClick={() => GrabWeatherInput()}
          >
            {loading ? (
              <div className="spinner mr-1 border-2 border-blue-500 rounded-full animate-spin"></div>
            ) : null}{" "}
            Search
          </button>
        </div>
        <h1 className="m-2 text-red-600 text-center">
          *Note: Some of the results may not be accurate
        </h1>
        {weather ? (
          <div>
            <h1 className="text-black text-xl pt-5 text-center">
              {weather.location.name} - {weather.location.region}
            </h1>
            <div className="flex items-center justify-center">
              <img
                src={weather.current.condition.icon}
                alt="Weather Icon"
                className="w-32 h-32"
              />
              <h1 className="text-black text-6xl m-3 text-center">
                {Math.round(weather.current.temp_f)}
                <span className="text-xl align-top">°F</span>
              </h1>
            </div>
            <div className="pb-10">
              <h1 className="text-black text-4xl text-center">
                {weather.current.condition.text}
              </h1>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
