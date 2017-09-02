import React, { 
  Component 
}                 from 'react';
import * as RBS   from 'react-bootstrap'; 
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
    this.renderLoader        = this.renderLoader.bind(this);  

    // Intantiate NYT Service
    this.nyt                 = new nyt();

    this.pageSize = 10;
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
    return <div></div>; 
  }

  renderArticle(article, idx) {
    
    return <Article 
      key={idx} 
      {...article} 
    />; 
  }

  renderArticles() {
    console.log(this.state.articles);
    const articles = this.state.articles.map(this.renderArticle); 

    return <div>
      {articles}
    </div>;
  }

  render() {
    return (
      <RBS.Grid className="articles">
        <RBS.Row>
          <RBS.Col sm={8} smOffset={2} lg={6} lgOffset={3} >
            {!this.state.articles.length && this.renderLoader()}
            {this.state.articles.length > 0 && this.renderHeader()}
            {this.state.articles.length > 0&& this.renderArticles()}
          </RBS.Col>
        </RBS.Row> 
      </RBS.Grid> 
    );
  }
}

export default App;
