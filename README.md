# F1 Drivers Dashboard

This project is a full‑stack web application built with **Node.js** and **React** that displays information about Formula 1 drivers. It leverages the [OpenF1 API](https://openf1.org/) to fetch real‑time and historical data about drivers. According to the OpenF1 documentation, the `drivers` endpoint returns details such as a driver's full name, team name, country code and a headshot URL【627696382645108†L185-L244】. The app visualises this data in an easy‑to‑browse grid of driver cards.

## Features

* **Full Stack Architecture** – A lightweight Express server proxies requests to the OpenF1 API and serves the React front‑end.
* **Responsive UI** – The dashboard uses a simple CSS grid that adapts to different screen sizes. Each card shows the driver's photo, name, country code and team.
* **Real‑time Data** – The server fetches drivers from the latest session using `session_key=latest`, ensuring that the dashboard always displays up‑to‑date information【627696382645108†L265-L270】.
* **Error Handling** – Basic error messages are displayed on the client if the data cannot be fetched.

## Getting Started

These instructions will help you run the project locally. You’ll need **Node.js** installed on your machine.

1. **Install dependencies**

   Navigate to the project directory and install the Node dependencies:

   ```bash
   npm install
   ```

2. **Start the server**

   Start the Express server, which also serves the static front‑end:

   ```bash
   npm start
   ```

   The server runs on port **5000** by default. Open [http://localhost:5000](http://localhost:5000) in your browser to view the dashboard.

## Project Structure

```
f1-dashboard/
├── package.json        – Defines project metadata and dependencies
├── server.js           – Express server that proxies the OpenF1 API and serves the front‑end
├── public/
│   ├── index.html      – HTML template with a `div#root` for React
│   └── app.js          – React application fetching data and rendering cards
└── README.md           – This file
```

## API Reference

The application uses the **drivers** endpoint of the OpenF1 API. The OpenF1 documentation describes the endpoint as follows:

> **Drivers** – Provides information about drivers for each session. A sample query is `https://api.openf1.org/v1/drivers?driver_number=1&session_key=9158`. The response contains fields like `broadcast_name`, `country_code`, `driver_number`, `first_name`, `full_name`, `headshot_url`, `team_name` and `team_colour`【627696382645108†L185-L244】.

For more details, see the official [OpenF1 documentation](https://openf1.org/).

## Future Improvements

* **Pagination and Filtering** – Add controls to filter drivers by team, nationality or meeting.
* **Styling Enhancements** – Integrate a CSS framework such as Tailwind or Material‑UI for a richer UI.
* **Additional Data** – Extend the dashboard with lap times, race results or telemetry using other OpenF1 endpoints.

## License

This project is open source and licensed under the MIT License.
