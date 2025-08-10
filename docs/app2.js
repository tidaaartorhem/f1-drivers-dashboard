const { useState, useEffect } = React;

function DriverCard({ driver }) {
  const [expanded, setExpanded] = useState(false);
  const [extraData, setExtraData] = useState(null);

  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  useEffect(() => {
    if (expanded && !extraData) {
      const meeting = driver.meeting_key;
      const number = driver.driver_number;
      if (meeting && number) {
        fetch(`https://api.openf1.org/v1/laps?meeting_key=${meeting}&driver_number=${number}&lap_number=1`)
          .then(res => {
            if (!res.ok) throw new Error('Failed to fetch lap data');
            return res.json();
          })
          .then(data => {
            if (data && data.length > 0) {
              setExtraData(data[0]);
            }
          })
          .catch(err => {
            console.error(err);
          });
      }
    }
  }, [expanded, extraData, driver.meeting_key, driver.driver_number]);

  return React.createElement(
    'div',
    {
      className: 'card bg-white rounded-lg shadow-md p-4 border-t-4',
      style: { borderTopColor: `#${driver.team_colour}`, cursor: 'pointer' },
      onClick: toggleExpanded,
    },
    [
      React.createElement('img', { className: 'w-full h-32 object-cover rounded-md mb-2', src: driver.headshot_url, alt: driver.full_name }),
      React.createElement('h2', { className: 'text-lg font-semibold' }, driver.full_name),
      React.createElement('p', null, `${driver.first_name} ${driver.last_name}`),
      React.createElement('p', null, driver.country_code),
      React.createElement('p', { className: 'team text-sm text-gray-600 mb-2' }, driver.team_name),
      expanded &&
        React.createElement(
          'div',
          { className: 'details text-sm mt-2' },
          [
            driver.broadcast_name && React.createElement('p', null, `Broadcast Name: ${driver.broadcast_name}`),
            driver.name_acronym && React.createElement('p', null, `Acronym: ${driver.name_acronym}`),
            driver.driver_number && React.createElement('p', null, `Number: ${driver.driver_number}`),
            driver.meeting_key && React.createElement('p', null, `Meeting Key: ${driver.meeting_key}`),
            driver.session_key && React.createElement('p', null, `Session Key: ${driver.session_key}`),
            extraData && extraData.lap_time && React.createElement('p', null, `Lap 1 Time: ${extraData.lap_time}`),
          ].filter(Boolean)
        ),
    ].filter(Boolean)
  );
}

function Dashboard() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ team: 'All', nationality: 'All', meeting: 'All' });
  const [currentPage, setCurrentPage] = useState(1);
  const driversPerPage = 12;

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

  const teams = React.useMemo(() => ['All', ...Array.from(new Set(drivers.map(d => d.team_name)))], [drivers]);
  const nationalities = React.useMemo(() => ['All', ...Array.from(new Set(drivers.map(d => d.country_code)))], [drivers]);
  const meetings = React.useMemo(() => ['All', ...Array.from(new Set(drivers.map(d => d.meeting_key)))], [drivers]);

  const filteredDrivers = drivers.filter(d =>
    (filters.team === 'All' || d.team_name === filters.team) &&
    (filters.nationality === 'All' || d.country_code === filters.nationality) &&
    (filters.meeting === 'All' || String(d.meeting_key) === String(filters.meeting))
  );

  const totalPages = Math.max(1, Math.ceil(filteredDrivers.length / driversPerPage));
  const indexOfLast = currentPage * driversPerPage;
  const indexOfFirst = indexOfLast - driversPerPage;
  const currentDrivers = filteredDrivers.slice(indexOfFirst, indexOfLast);

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  }

  function nextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }

  if (loading) {
    return React.createElement('p', { className: 'loading' }, 'Loading drivers...');
  }

  if (error) {
    return React.createElement('p', { className: 'loading text-red-500' }, error);
  }

  return React.createElement(
    'div',
    { className: '' },
    [
      React.createElement('div', { className: 'controls flex flex-wrap gap-4 mb-4' }, [
        React.createElement('select', { name: 'team', value: filters.team, onChange: handleFilterChange, className: 'border rounded p-2' }, teams.map(t => React.createElement('option', { value: t, key: t }, t))),
        React.createElement('select', { name: 'nationality', value: filters.nationality, onChange: handleFilterChange, className: 'border rounded p-2' }, nationalities.map(n => React.createElement('option', { value: n, key: n }, n))),
        React.createElement('select', { name: 'meeting', value: filters.meeting, onChange: handleFilterChange, className: 'border rounded p-2' }, meetings.map(m => React.createElement('option', { value: m, key: m }, m))),
      ]),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' },
        currentDrivers.map((driver, idx) =>
          React.createElement(DriverCard, { driver, key: driver.driver_number || idx })
        )
      ),
      React.createElement('div', { className: 'pagination flex justify-center items-center mt-4 gap-4' }, [
        React.createElement('button', { onClick: prevPage, disabled: currentPage === 1, className: 'px-4 py-2 bg-gray-200 rounded disabled:opacity-50' }, 'Prev'),
        React.createElement('span', null, `${currentPage} / ${totalPages}`),
        React.createElement('button', { onClick: nextPage, disabled: currentPage === totalPages, className: 'px-4 py-2 bg-gray-200 rounded disabled:opacity-50' }, 'Next'),
      ])
    ]
  );
}

ReactDOM.render(React.createElement(Dashboard), document.getElementById('root'));
