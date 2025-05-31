# imdb-api

A private high-performance Node.js API that scrapes IMDb search results and exposes them via a Fastify REST interface.

## Features

- Scrapes [IMDb search](https://www.imdb.com/search/title/) using Axios + Cheerio
- Fastify server for better performance than Express
- REST API endpoint: `/v1/search`
- Extracts movie/show title, year, rating, summary, poster, and number of votes.
- Supports filtering by content certificates (e.g., for adult titles) via the 'certificates' parameter.
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
GET /v1/search?query=inception&genre=sci-fi&year=2010&page=1&media=true&certificates=US:PG-13
```

#### Example response

```json
{
  "results": [
    {
      "title": "Inception",
      "year": "(2010)",
      "rating": "8.8",
      "votes": 2400000,
      "summary": "A thief who steals corporate secrets through use of dream-sharing technology...",
      "poster": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SY1000_CR0,0,675,1000_AL_.jpg",
      "horizontal_images": []
    }
    // ... more results
  ],
  "url": "https://www.imdb.com/search/title/?title=inception&genres=sci-fi&year=2010&start=1&certificates=US:PG-13"
}
```
**Note on response fields:**
*   `votes`: The number of user votes/ratings for the title.
*   `horizontal_images`: This will be an empty array when querying search results, as distinct horizontal/landscape images are typically found on individual title pages, not on the search results page.

## CORS Support

CORS (Cross-Origin Resource Sharing) is enabled for all origins.  
You can call this API directly from your Node.js backend, browser, or Firebase web app with no special configuration required.

## License

MIT