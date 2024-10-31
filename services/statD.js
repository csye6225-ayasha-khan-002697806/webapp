import StatsD from 'node-statsd';

// Create a StatsD client instance
const statsdClient = new StatsD({ host: '127.0.0.1', port: 8125 });

// Make the StatsD client available in your application
export { statsdClient };
