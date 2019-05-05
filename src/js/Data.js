class Data {
  constructor() {
    this.openaqURI = 'https://api.openaq.org/v1/measurements';
    this.wikiURI = 'https://en.wikipedia.org/w/api.php';
  }

  // get array of cities
  async getCities(country) {
    // get yesterday's date
    const offset = new Date().getTimezoneOffset() * 60000;
    const yesterday = new Date(Date.now() - 86400000 - offset)
      .toISOString()
      .slice(0, -5);

    // complete request
    const query = `?country=${country}&parameter=pm25&date_from=${yesterday}&limit=500&order_by=value&sort=desc`;
    const response = await fetch(this.openaqURI + query);
    const data = await response.json();

    // fill array without repeated cities
    let i = 0;
    const results = [];
    while (results.length < 20) {
      if (results.indexOf(data.results[i].city) === -1) {
        results.push(data.results[i].city);
        results.push(data.results[i].value);
      }
      i += 1;
    }
    // group array [[city, value], ...]
    const chunkedResults = [];
    for (let j = 0; j < results.length; j += 2) {
      chunkedResults.push(results.slice(j, j + 2));
    }

    return chunkedResults;
  }

  // get description, image, url of city
  async getInfo(city) {
    // complete request
    const query = `?action=query&formatversion=2&format=json&origin=*&prop=extracts|info|pageimages&inprop=url&piprop=thumbnail&pithumbsize=300&exchars=500&explaintext&exintro&exsectionformat=plain&redirects=1&titles=${city}`;
    const response = await fetch(this.wikiURI + query);
    const data = await response.json();

    return data.query.pages[0];
  }
}

export default Data;
