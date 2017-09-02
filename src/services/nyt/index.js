export default class{

  constructor() {
    this._baseUrl = 'https://api.nytimes.com/svc/topstories/v2';
    this._apiKey = '3adc832186c84176af5c0a59d707b1ce';
  }

  fetch(options) {
    const reqUrl = `${this._baseUrl}/${options.category}.json?api-key=${this._apiKey}`; 
    return fetch(reqUrl, {
      method: options.method || 'GET',
    });    
  }

  get(options = {}) {
    try{
      const reqOptions = {
        category:'home',
        ...options,
      };
      reqOptions.method = 'GET';
      return this.fetch(reqOptions)
      .then((res) => res.json())  

    } catch(e) {
      return console.error('Error fetching top stories: %o', e); 
    }
  }
}
