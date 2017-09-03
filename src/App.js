import React, {
  Component 
}                 from 'react';
import * as RBS   from 'reactstrap';
import _          from 'lodash'; 
import Bluebird   from 'bluebird'; 
import moment     from 'moment-timezone';

import nyt        from './services/nyt';
import categories from './services/nyt/categories';

import Article    from './component/Article';

class App extends Component {
  constructor(props) {
    super(props); 

    this.state = {
      isLoading: true,
      articles: [], 
      count:0,
      articleIsOpen:[], 
      timezone:'Pacific/Fiji',
      searchTerm:'',
      imageFormat:'mediumThreeByTwo210',
    };

    // Intantiate NYT Service
    this.nyt          = new nyt();
    
    // Set some defaults
    this.pageSize     = 9;
    this.gridSize     = 3;
    this.pseudoDelay  = 700;
  }

  /**
   * Fetch articles from NYT 
   */
  componentDidMount() {
    return setTimeout(() => this.getArticles(), this.pseudoDelay);
  }

  /**
   * Fetches articles 
   *
   * @param {String} category = default `home`
   */
  getArticles = (category = "home") => {
    const options = {
     category 
    };

    return Bluebird.resolve()
    .return(this.nyt.get(options))
    .then((res) => {
      const rawArticles = _.get(res,"results",[]);
      // Shuffle to give a feeling of dynamism
      const articles = _.shuffle(rawArticles);
      const count = _.get(res,"num_results",[]);
      this.setState({
        articles,
        count,
        isLoading: false,
      })
    });
  }

  /**
   * Handle when search is being typed 
   *
   * @param {Object} evt
   */
  handleSearchChange = (evt) => {
    const searchTerm  = _.get(evt,"target.value","");

    return this.setState({
      searchTerm,
    }); 
  }

  /**
   * Handle when section is changed 
   *
   * @param {Object} evt
   */
  handleSectionChange = (evt) => {
    const section = _.get(evt,"target.value","home");
    this.setState({isLoading:true})
    return setTimeout(() => this.getArticles(section), this.pseudoDelay);
  }

  /**
   * Handle when timezone is changed 
   *
   * @param {Object} evt
   */
  handleTimezoneChange = (evt) => {
    const timezone = _.get(evt,"target.value","Pacific/Fiji");
    return this.setState({timezone});
  }

  /**
   * Render loading spinner 
   */
  renderLoader = () => {
    return <div className="spinner">
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>;
  }

  /**
   * Render filtering and searching tools 
   *
   * @state <timezone>
   * @state <seachTerm>
   */
  renderHeader = () => {
    const categoriesOptions = _.map(categories, (c,i) => <option key={i} value={c.id}>{c.label}</option>);
    const timzoneOptions    = _.map(moment.tz.names(), (t,i) => <option key={i} value={t}>{t}</option>);

    return <RBS.Row>
      <RBS.Col xs="12" sm="6">
        <RBS.FormGroup onChange={this.handleSectionChange} >
          <RBS.Label for="categories-select">Choose a Section</RBS.Label>
          <RBS.Input type="select" name="section" id="categories-select">
            {categoriesOptions}
          </RBS.Input>
        </RBS.FormGroup>
      </RBS.Col>
      <RBS.Col xs="12" sm="6">
        <RBS.FormGroup>
          <RBS.Label for="timezone-select">Choose Timezone</RBS.Label>
          <RBS.Input 
            onChange={this.handleTimezoneChange}
            value={this.state.timezone} 
            type="select" 
            name="timezone" 
            id="timezone-select"
          >
            {timzoneOptions}
          </RBS.Input>
        </RBS.FormGroup>
      </RBS.Col>
      <RBS.Col xs="12">
        <RBS.FormGroup>
          <RBS.Label for="search-term-text">Search</RBS.Label>
          <RBS.Input 
            onChange={this.handleSearchChange}
            value={this.state.searchTerm} 
            name="searchTerm" 
            id="search-term-text"
            placeholder="Start typing..."
          />
        </RBS.FormGroup>
      </RBS.Col>
    </RBS.Row>; 
  }

  /**
   * Article search render helper
   *
   * @state <seachTerm>
   */
  renderSearchArticle = (acc, article, idx) => {
    const searchChecker = (prop) => prop.toLowerCase && prop.toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) > -1;

    if(_.some(article,searchChecker)){
      return this.renderArticle(acc, article, idx); 
    }
    return acc;
  }

  /**
   * Article render helper
   *
   * @state <timezone>
   * @state <imageFormat>
   */
  renderArticle = (acc, article, idx) => {
    if(_.has(article,"multimedia[0].url") && acc.length < this.pageSize){
      acc.push(
        <Article 
          key={idx} 
          idx={idx} 
          timezone={this.state.timezone}
          imageFormat={this.state.imageFormat}
          {...article} 
        />
      );
    }
    return acc;
  }

  /**
   * CardGroup render helper
   */
  renderCardGroup = (group, idx) => {
    // Update count
    this.totalShowing += group.length;

    if(group.length < this.gridSize){
      const diff = this.gridSize - group.length;
      for(let i = 0;i < diff;i++){
        group.push(<RBS.Card key={Math.random()} className="no-border">{null}</RBS.Card>);  
      } 
    }
    return <RBS.CardGroup key={idx}>{group}</RBS.CardGroup>; 
  }

  /**
   * No results render helper
   */
  renderNoResults = () => {
    return <div>Nothing found.</div>; 
  }

  renderResultsCount = () => {
    const plural = this.totalShowing > 1 ? 's' : '';

    return <div>{`${this.totalShowing} Article${plural} found`}</div>;  
  }

  /**
   * Articles render helper 
   *
   * @state <articles>
   */
  renderArticles = () => {
    // Reset count
    this.totalShowing = 0;

    // Wrap articles and start chain
    const articlesChain = _(this.state.articles).chain()

    // Since no stipulation was set on showing all the articles
    // I strip out the imageless articles for consistency, hence REDUCE
    // If a searchterm is present I reduce through there instead
    // Chunk based on the grid size
    // Finally, throw each chunk into a card group
    const articles = this.state.searchTerm.length > 2 ? 
      articlesChain.reduce(this.renderSearchArticle, []) : 
      articlesChain.reduce(this.renderArticle, []);
    
    const results = articles.chunk(this.gridSize).map(this.renderCardGroup).value();

    return <RBS.Row> 
      {
        results.length > 0 ? results : this.renderNoResults()
      } 
    </RBS.Row>;
  }

  /**
   *  Render
   */
  render() {
    return (
      <RBS.Container className="articles">
        <RBS.Row>
          <RBS.Col xs="12">
            {this.renderHeader()}
            {this.state.isLoading && this.renderLoader()}
            {!this.state.isLoading && this.renderArticles()}
            {!this.state.isLoading && this.renderResultsCount()}
          </RBS.Col>
        </RBS.Row> 
      </RBS.Container> 
    );
  }
}

export default App;
