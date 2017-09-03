import Bluebird from 'bluebird';

export default class{

  constructor() {
    // Base url for nyt api
    this._baseUrl = process.env.REACT_APP_NYT_API_URL;
    // Api key for nyt api
    this._apiKey = process.env.REACT_APP_NYT_API_KEY;
  }

  /**
   * Run ajax request
   *
   * @param {Object} options - {
   *                             method   // Optional, request method, default - GET,
   *                             category // Optional, section to request, default - home,
   *                           }
   *
   * @returns {Promise}
   */
  fetch(options) {
    const reqUrl = `${this._baseUrl}/${options.category}.json?api-key=${this._apiKey}`; 
    return fetch(reqUrl, {
      method: options.method || 'GET',
    });    
  }

  /**
   * Get articles 
   *
   * @param {Object} options - {
   *                             category // Optional, section to request, default - home,
   *                           }
   *
   * @returns {Promise}
   */
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
      return Bluebird.resolve().return(console.error('Error fetching top stories: %o', e)); 
    }
  }
}
