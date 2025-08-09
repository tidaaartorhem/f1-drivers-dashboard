const { useState, useEffect } = React;

function DriverCard({ driver }) {
  return (
    React.createElement('div', { className: 'card', style: { borderTop: `5px solid #${driver.team_colour}` } },
      React.createElement('img', { src: driver.headshot_url, alt: driver.full_name }),
      React.createElement('h2', null, driver.full_name),
      React.createElement('p', null, `${driver.first_name} ${driver.last_name}`),
      React.createElement('p', null, driver.country_code),
      React.createElement('p', { className: 'team' }, driver.team_name)
    )
  );
}

function Dashboard() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://api.openf1.org/v1/drivers?session_key=latest')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch drivers');
        return res.json();
      })
      .then((data) => {
        setDrivers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return React.createElement('div', { className: 'loading' }, 'Loading drivers…');
  }
  if (error) {
    return React.createElement('div', { className: 'loading' }, `Error: ${error}`);
  }
  return (
    React.createElement('div', { className: 'grid' },
      drivers.map((driver) => React.createElement(DriverCard, { key: driver.driver_number, driver }))
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(Dashboard)
);
