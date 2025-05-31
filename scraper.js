const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.imdb.com/search/title/';

function buildUrl({ query, genre, year, page }) {
  const params = new URLSearchParams();
  if (query) params.append('title', query);
  if (genre) params.append('genres', genre);
  if (year) params.append('year', year);
  if (page) params.append('start', ((parseInt(page) - 1) * 50 + 1).toString());
  return `${BASE_URL}?${params.toString()}`;
}

async function search({ query, genre, year, page = 1, media = false }) {
  const url = buildUrl({ query, genre, year, page });
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; imdb-api/1.0)' }
  });
  const $ = cheerio.load(data);

  const results = [];
  $('.lister-item.mode-advanced').each((i, el) => {
    const title = $(el).find('.lister-item-header a').text().trim();
    const year = $(el).find('.lister-item-year').text().trim();
    const rating = $(el).find('.ratings-imdb-rating strong').text().trim();
    const summary = $(el).find('.ratings-bar').nextAll('p').eq(0).text().trim();
    const poster = $(el).find('.lister-item-image img').attr('loadlate') || $(el).find('.lister-item-image img').attr('src');
    
    let horizontal_images = [];
    if (media) {
      // Try to extract possible horizontal/landscape images if present in the item
      $(el).find('.lister-item-image a').each((j, imgA) => {
        const horizontal = $(imgA).find('img').attr('src');
        if (horizontal && !horizontal.includes('nopicture')) {
          horizontal_images.push(horizontal);
        }
      });
    }

    results.push({ title, year, rating, summary, poster, horizontal_images });
  });

  return { results, url };
}

module.exports = { search };