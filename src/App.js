import React, { 
  Component 
}                 from 'react';
import * as RBS  from 'reactstrap';
import _          from 'lodash'; 
import Bluebird   from 'bluebird'; 

import nyt        from './services/nyt';
import categories from './services/nyt/categories';

import Article    from './component/Article';

class App extends Component {
  constructor(props) {
    super(props); 

    this.state = {
      articles: [], 
      count:0,
      articleIsOpen:[], 
    };

    this.renderHeader        = this.renderHeader.bind(this);  
    this.renderArticles      = this.renderArticles.bind(this);  
    this.renderArticle       = this.renderArticle.bind(this);  
    this.renderLoader        = this.renderLoader.bind(this);  

    // Intantiate NYT Service
    this.nyt                 = new nyt();

    this.pageSize   = 10;
    this.gridSize   = 3;
  }

  componentDidMount() {
    return setTimeout(() => {
      return Bluebird.resolve()
      .return(this.nyt.get())
      .then((res) => {
        const articles = _.get(res,"results",[]);
        const count = _.get(res,"num_results",[]);
        this.setState({
          articles,
          count
        })
      });
    }, 1500);
  }

  renderLoader() {
    return <div className="spinner">
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>;
  }

  renderHeader() {
    return <div>
      <FormGroup>
          <Label for="exampleSelect">Select</Label>
          <Input type="select" name="select" id="exampleSelect">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </Input>
      </FormGroup>
    </div>; 
  }

  renderArticle(acc, article, idx) {
    if(_.has(article,"multimedia[0].url") && acc.length < this.pageSize){
      acc.push(<Article idx={idx} {...article} />);
    }
    return acc;
  }

  renderCardGroup(group) {
    return <RBS.CardGroup>{group}</RBS.CardGroup>; 
  }

  renderArticles() {
    console.log(this.state.articles);

    const articles = _(this.state.articles);

    // Since no stipulation was set on showing all the articles
    // I strip out the imageless articles for consistency, hence REDUCE
    // Chunk based on the grid size
    return <RBS.Row>
      {
        articles
        .chain()
        .shuffle()
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
            {!this.state.articles.length && this.renderLoader()}
            {this.state.articles.length > 0 && this.renderHeader()}
            {this.state.articles.length > 0&& this.renderArticles()}
          </RBS.Col>
        </RBS.Row> 
      </RBS.Container> 
    );
  }
}

export default App;
