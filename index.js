const Fastify = require('fastify');
const imdbScraper = require('./scraper');

// Create Fastify instance
const fastify = Fastify({ logger: true });

// Register CORS plugin to allow all origins
fastify.register(require('@fastify/cors'), {
  origin: true // Open for all origins; adjust for prod if needed
});

// Versioned API route: /v1/search
fastify.register(async function (appV1) {
  appV1.get('/search', async (request, reply) => {
    const { query, genre, year, page, media, certificates } = request.query; // Added 'certificates'

    try {
      const results = await imdbScraper.search({
        query,
        genre,
        year,
        page,
        media: media === 'true',
        certificates // Pass 'certificates'
      });
      reply.send(results);
    } catch (err) {
      appV1.log.error(err);
      reply.status(500).send({ error: 'Failed to fetch IMDb data.' });
    }
  });
}, { prefix: '/v1' });

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info('IMDB API server running...');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();