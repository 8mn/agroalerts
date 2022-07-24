import axios from "axios";
import { useEffect, useState } from "react";
import Style from "./App.module.scss";

import QR from "./frame.png";

function App() {
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");
	const [weather, setWeather] = useState("");
	const [location, setLocation] = useState("");
	const [days, setDays] = useState([]);
	const [loading, setLoading] = useState(false);
	const [day, setDay] = useState();

	function getGeolocation() {
		navigator.geolocation.getCurrentPosition(function (position) {
			console.log(position);
			setLatitude(position.coords.latitude);
			setLongitude(position.coords.longitude);
		});
	}

	useEffect(() => {
		setLoading(true);
		getGeolocation();
	}, []);

	useEffect(() => {
		if (!latitude || !longitude) {
			return;
		} else {
			getWeather();
		}
	}, [latitude, longitude]);

	const BACKEND_URL = "https://agro-alerts.herokuapp.com";

	const getWeather = () => {
		axios
			.post(`${BACKEND_URL}/api/weather`, {
				latitude: latitude,
				longitude: longitude,
			})
			.then((res) => {
				console.log(res);
				setLoading(false);
				setWeather(res.data.body.list);
				setLocation(res.data.body.city);

				const daysData = [];
				res.data.body.list.forEach((item) => {
					if (!daysData.includes(item.dt_txt.slice(0, 10))) {
						daysData.push(item.dt_txt.slice(0, 10));
					}
				});
				console.log(daysData);
				setDays(daysData);
				setDay(daysData[0]);

				const timeData = [];
				res.data.body.list.forEach((item) => {
					if (!timeData.includes(item.dt_txt.slice(11, 13))) {
						timeData.push(item.dt_txt.slice(11, 13));
					}
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleClick = (day) => {
		setDay(day);
	};

	const getDate = (day) => {
		const date = new Date(day);
		const dayName = date.toLocaleString("en-US", { weekday: "long" });
		const monthName = date.toLocaleString("en-US", { month: "long" });
		const dayNumber = date.getDate();
		const year = date.getFullYear();

		return ` ${monthName} ${dayNumber} ${year} ${dayName}`;
	};

	return (
		<>
			{loading ? (
				<div className={Style.loading}>Loading...</div>
			) : (
				<div className={Style.App}>
					<nav className={Style.navbar}>
						<div className={Style.logo}>Agro Alerts</div>
						<div className={Style["right-nav"]}>
							<div className={Style.location}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									// class="ai ai-Location"
								>
									<circle cx="12" cy="10" r="3" />
									<path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z" />
								</svg>
								<div>
									{location.name}, {location.country}
								</div>
							</div>
							{/* <button>Sign up for alerts</button> */}
						</div>
					</nav>

					<div className={Style.sandbox}>
						<div>
							<h2>Steps to join sandbox</h2>

							<p>
								1. Save the phone number <code>+1 415 523 8886 </code>on your
								phone
							</p>
							<p>2. Scan the shown QR code to join the sandbox</p>
						</div>
						<img src={QR} alt="" />
					</div>
					<div className={Style["day-container"]}>
						{weather &&
							days.map((d) => {
								return (
									<button
										className={Style.day}
										key={d}
										onClick={() => handleClick(d)}
										style={{
											backgroundColor: d === day ? "#53ff62" : "",
											color: d === day ? "#000" : "",
										}}
									>
										{getDate(d)}
									</button>
								);
							})}
					</div>

					<div className={Style["weather-container"]}>
						{weather &&
							weather.map((item) => {
								if (item.dt_txt.slice(0, 10) === day) {
									return (
										<div key={item.dt} className={Style.weather}>
											<img
												src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
												alt={`${item.weather[0].main} Icon`}
												className={Style["weather-icon"]}
											/>
											<div className={Style.TimeInfo}>
												<div className={Style.field}>
													<div className={Style.label}>AT</div>
													<div className={Style.data}>
														{item.dt_txt.slice(11, 16)}
													</div>
												</div>
											</div>
											<div className={Style.info}>
												<div className={Style.field}>
													<div className={Style.label}>Temp</div>
													<div className={Style.data}>{item.main.temp} °C</div>
												</div>
												<div className={Style.field}>
													<div className={Style.label}>feels like</div>
													<div className={Style.data}>
														{item.main.feels_like} °C
													</div>
												</div>
												<div className={Style.field}>
													<div className={Style.label}>Description</div>
													<div className={Style.data}>
														{item.weather[0].description}
													</div>
												</div>
												<div className={Style.field}>
													<div className={Style.label}>Humidity</div>
													<div className={Style.data}>{item.main.humidity}</div>
												</div>
												<div className={Style.field}>
													<div className={Style.label}>cloudiness</div>
													<div className={Style.data}>{item.clouds.all}%</div>
												</div>
												<div className={Style.field}>
													<div className={Style.label}>wind speed</div>
													<div className={Style.data}>
														{item.wind.speed} m/s
													</div>
												</div>

												<p></p>
											</div>
											<div className={Style.popContainer}>
												<div className={Style.label}>Precipitation</div>
												<p className={Style.pop}>
													{(item.pop * 100).toFixed(0)}%{" "}
												</p>
											</div>
										</div>
									);
								}
							})}
					</div>
				</div>
			)}
		</>
	);
}

export default App;
