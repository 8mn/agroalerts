import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

// 1. get location
// 2. get weather
// 3. get phone number
// 4. send alerts
// 5. test alerts

function App() {
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");
	const [weather, setWeather] = useState("");

	// get location
	// function getLocation() {
	//   if (navigator.geolocation) {
	//     console.log('geolocation is available');
	//     getGeolocation();
	//   } else {
	//     console.log("Geolocation is not supported by this browser.");
	//   }
	// }

	//get geolocation
	function getGeolocation() {
		navigator.geolocation.getCurrentPosition(function (position) {
			// console.log(position);
			setLatitude(position.coords.latitude);
			setLongitude(position.coords.longitude);
		});
	}

	useEffect(() => {
		getGeolocation();
	}, []);

	useEffect(() => {
		if (!latitude || !longitude) {
			return;
		}
		getWeather();
	}, [latitude, longitude]);

	const getWeather = () => {
		axios
			.get(
				`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`
			)
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			});

	};

	return (
		<div className="App">
			agro alerts
			<p>latitude: {latitude}</p>
			<p>longitude: {longitude}</p>
		</div>
	);
}

export default App;
