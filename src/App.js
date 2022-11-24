import { useEffect, useState } from "react";

function App() {
  const [endpoint, setEndpoint] = useState("/");
  const [time, setTime] = useState(500);
  const [capture, setCapture] = useState(false);

  const [responses, setResponses] = useState([
    {
      start: 100,
      end: 500,
      status: 0,
    },
    {
      start: 500,
      end: 750,
      status: 200,
    },
  ]);

  useEffect(() => {
    if (capture === false) return;

    setResponses([]);

    const interval = setInterval(async () => {
      console.log("tick");

      const control = new AbortController();
      setTimeout(() => control.abort(), time);

      const start = performance.now();
      let status = -1;
      try {
        const res = await fetch(endpoint, { signal: control.signal });
        status = res.status;
      } catch (e) {}
      const end = performance.now();

      setResponses((prev) => prev.concat({ start, end, status }));
    }, time);

    return () => {
      clearInterval(interval);
    };
  }, [capture, endpoint, time]);

  const width = 1000;
  const height = 1000;
  const xstep = width / responses.length;
  const ystep = height / time;

  return (
    <div>
      <header>
        {capture ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCapture(false);
            }}
          >
            <dl>
              <dt>Endpoint</dt>
              <dd>{endpoint}</dd>
              <dt>Interval (ms)</dt>
              <dd>{time}</dd>
            </dl>
            <button>stop</button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCapture(true);
            }}
          >
            <label>
              Endpoint
              <input
                type="text"
                name="endpoint"
                value={endpoint}
                onChange={(e) => {
                  setEndpoint(e.value);
                }}
              />
            </label>
            <label>
              Interval (ms)
              <input
                type="number"
                name="timeout"
                value={time}
                onChange={(e) => setTime(e.value)}
              />
            </label>

            <input type="submit" value="start" />
          </form>
        )}
      </header>
      <main>
        <svg width={1000} height={1000} viewBox={`0 0 ${width} ${height}`}>
          {responses.map((r, i) => (
            <rect
              key={i}
              width={xstep}
              height={ystep * (r.end - r.start)}
              x={i * xstep}
              y={height - ystep * (r.end - r.start)}
              className={`status_${r.status}`}
            ></rect>
          ))}
        </svg>
      </main>
    </div>
  );
}

export default App;
