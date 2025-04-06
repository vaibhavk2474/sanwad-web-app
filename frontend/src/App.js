import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";

function App() {
	const [jokes, setJokes] = useState([]);

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch("/api/v1");
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				// const json = await response.json();
				// console.log(json); // Process the json
				// setJokes(json.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		}
		fetchData();
	}, []);
	return (
		<div className="App">
			<h3>Total jokes: {jokes.length}</h3>

			{jokes.map((cJoke) => (
				<div>
					<h5>{cJoke.joke}</h5>
				</div>
			))}
		</div>
	);
}

export default App;
