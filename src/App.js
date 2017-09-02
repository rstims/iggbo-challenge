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
    };

    this.getArticles           = this.getArticles.bind(this);
    this.handleSectionChange   = this.handleSectionChange.bind(this);
    this.handleTimezoneChange  = this.handleTimezoneChange.bind(this);
    this.renderHeader          = this.renderHeader.bind(this);  
    this.renderArticles        = this.renderArticles.bind(this);  
    this.renderArticle         = this.renderArticle.bind(this);  
    this.renderLoader          = this.renderLoader.bind(this);  

    // Intantiate NYT Service
    this.nyt                 = new nyt();

    this.pageSize    = 10;
    this.gridSize    = 3;
    this.pseudoDelay = 700;
  }

  componentDidMount() {
    return setTimeout(() => this.getArticles(), this.pseudoDelay);
  }

  getArticles(category = "home") {
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

  handleSectionChange(evt) {
    const section = _.get(evt,"target.value","home");
    this.setState({isLoading:true})
    return setTimeout(() => this.getArticles(section), this.pseudoDelay);
  }

  handleTimezoneChange(evt) {
    const timezone = _.get(evt,"target.value","Pacific/Fiji");
    return this.setState({timezone});
  }

  renderLoader() {
    return <div className="spinner">
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>;
  }

  renderHeader() {
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
    </RBS.Row>; 
  }

  renderArticle(acc, article, idx) {
    if(_.has(article,"multimedia[0].url") && acc.length < this.pageSize){
      acc.push(
        <Article 
          key={idx} 
          idx={idx} 
          timezone={this.state.timezone}
          {...article} 
        />
      );
    }
    return acc;
  }

  renderCardGroup(group, idx) {
    return <RBS.CardGroup key={idx}>{group}</RBS.CardGroup>; 
  }

  renderArticles() {

    // Wrap articles for chain
    const articles = _(this.state.articles);

    // Since no stipulation was set on showing all the articles
    // I strip out the imageless articles for consistency, hence REDUCE
    // Chunk based on the grid size
    // Finally, throw each chunk into a card group
    return <RBS.Row> 
      {
        articles
        .chain()
        .reduce(this.renderArticle, [])
        .chunk(this.gridSize)
        .map(this.renderCardGroup)
        .value()
      } 
    </RBS.Row>;
  }

  render() {
    return (
      <RBS.Container className="articles">
        <RBS.Row>
          <RBS.Col xs="12">
            {this.renderHeader()}
            {this.state.isLoading && this.renderLoader()}
            {!this.state.isLoading && this.renderArticles()}
          </RBS.Col>
        </RBS.Row> 
      </RBS.Container> 
    );
  }
}

export default App;
