const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.imdb.com/search/title/';

function buildUrl({ query, genre, year, page, certificates }) {
  const params = new URLSearchParams();
  if (query) params.append('title', query);
  if (genre) params.append('genres', genre);
  if (year) params.append('year', year);
  if (page) params.append('start', ((parseInt(page) - 1) * 50 + 1).toString());
  if (certificates) params.append('certificates', certificates);
  return `${BASE_URL}?${params.toString()}`;
}

async function search({ query, genre, year, page = 1, media = false, certificates }) {
  const url = buildUrl({ query, genre, year, page, certificates }); // 'year' here is the search filter parameter
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; imdb-api/1.0)' }
  });
  const $ = cheerio.load(data);

  const results = [];
  $('.lister-item.mode-advanced').each((i, el) => {
    const title = $(el).find('.lister-item-header a').text().trim();
    const yearText = $(el).find('.lister-item-year').text().trim(); // Extracted year string for the specific movie
    const ratingString = $(el).find('.ratings-imdb-rating strong').text().trim();
    const rating = ratingString ? ratingString : null;

    const votesElement = $(el).find('span[name="nv"]');
    let votes = null;
    if (votesElement.length) {
        const votesDataValue = votesElement.data('value');
        if (votesDataValue !== undefined && votesDataValue !== null) {
            const parsedVotes = parseInt(String(votesDataValue).replace(/,/g, ''), 10);
            if (!isNaN(parsedVotes)) {
                votes = parsedVotes;
            }
        } else {
            // Fallback to text if data-value is not present
            const votesText = votesElement.text().trim().replace(/[()]/g, ''); // Remove parentheses
            if (votesText) {
                const upperVotesText = votesText.toUpperCase();
                if (upperVotesText.includes('K')) {
                    votes = Math.round(parseFloat(upperVotesText.replace('K', '')) * 1000);
                } else if (upperVotesText.includes('M')) {
                    votes = Math.round(parseFloat(upperVotesText.replace('M', '')) * 1000000);
                } else {
                    const parsedNum = parseFloat(upperVotesText);
                    if (!isNaN(parsedNum)) {
                        votes = Math.round(parsedNum);
                    }
                }
            }
        }
    }

    const summary = $(el).find('.ratings-bar').nextAll('p').eq(0).text().trim();
    const posterImg = $(el).find('.lister-item-image img');
    const poster = posterImg.attr('loadlate') || posterImg.attr('src');
    
    let horizontal_images = [];
    if (media) {
      // No reliable selectors for distinct horizontal images were found on the search results page.
      // horizontal_images will remain empty for now.
    }

    results.push({
      title,
      year: yearText,
      rating,
      votes,
      summary,
      poster,
      horizontal_images
    });
  });

  return { results, url };
}

module.exports = { search };