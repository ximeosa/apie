# imdb-api

A private high-performance Node.js API that scrapes IMDb search results and exposes them via a Fastify REST interface.

## Features

- Scrapes [IMDb search](https://www.imdb.com/search/title/) using Axios + Cheerio
- Fastify server for better performance than Express
- REST API endpoint: `/v1/search`
- Usable from Node.js apps and Firebase web apps
- CORS enabled for all origins (easy integration)
- Easily extensible for more features

## Usage

### Install dependencies

```bash
npm install
```

### Start the server

```bash
npm start
```

### Example API call

```
GET /v1/search?query=inception&genre=sci-fi&year=2010&page=1&media=true
```

#### Example response

```json
{
  "results": [
    {
      "title": "Inception",
      "year": "(2010)",
      "rating": "8.8",
      "summary": "A thief who steals corporate secrets ...",
      "poster": "https://m.media-amazon.com/images/...",
      "horizontal_images": [
        "https://m.media-amazon.com/images/M/horizontal1.jpg",
        "https://m.media-amazon.com/images/M/horizontal2.jpg"
      ]
    },
    ...
  ],
  "url": "https://www.imdb.com/search/title/?title=inception&genres=sci-fi&year=2010&start=1"
}
```

## CORS Support

CORS (Cross-Origin Resource Sharing) is enabled for all origins.  
You can call this API directly from your Node.js backend, browser, or Firebase web app with no special configuration required.

## License

MIT