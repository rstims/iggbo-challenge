import React, {
  Component
}                from 'react';

import _         from 'lodash';
import moment    from 'moment';
import * as RBS  from 'react-bootstrap';


export default class Article extends Component{
  constructor(props){
    super(props); 
  }

  render() {
    const image = _.get(this.props,"multimedia[0].url",null); 
    return <RBS.Panel>
      <RBS.Media>
        <RBS.Media.Left>
          <img width={64} src={image} alt="Image"/>
        </RBS.Media.Left>
        <RBS.Media.Body>
          <RBS.Media.Heading>{this.props.title}</RBS.Media.Heading>
          <p>{this.props.abstract}</p>
        </RBS.Media.Body>
      </RBS.Media> 
    </RBS.Panel> ; 
  }
  }
