import React, {
  Component
}                from 'react';

import _         from 'lodash';
import moment    from 'moment-timezone';
import * as RBS  from 'reactstrap';


export default class Article extends Component{
  constructor(props){
    super(props); 

    this.getDate             = this.getDate.bind(this);  
    this.handleToggleTooltip = this.handleToggleTooltip.bind(this);
    this.renderImage         = this.renderImage.bind(this);  
    this.renderBody          = this.renderBody.bind(this);  

    this.imageFormat = 'superJumbo';

    this.state = {
      toolTipIsOpen: false 
    };
  }

  getDate() {
    const date = _.get(this.props,"created_date",undefined);
    return moment.tz(date, "Pacific/Fiji").format("M/DD/YYYY H:mm A FJT"); 
  }

  handleToggleTooltip() {
    this.setState({toolTipIsOpen: !this.state.toolTipIsOpen}); 
  }

  renderImage() {
    const image = _(this.props.multimedia).chain().filter({ format: this.imageFormat }).get("[0]",null).value();

    return <div>
      <RBS.CardImg id={`Tooltip-${this.props.idx}`} top width="100%" src={image.url} alt={image.caption} /> 
      <RBS.Tooltip 
        placement="bottom" 
        isOpen={this.state.toolTipIsOpen} 
        target={`Tooltip-${this.props.idx}`} 
        toggle={this.handleToggleTooltip}
        delay={{ show: 0, hide: 0 }} 
      >
        {image.caption || "No Caption"}
      </RBS.Tooltip>
    </div>;
  }

  renderBody() {
    const abstrct = _.get(this.props,"abstract",null); 
    const url     = _.get(this.props,"url",null); 
    const section = _.get(this.props,"section",null); 
    const title   = _.get(this.props,"title",null); 

    return <RBS.CardBlock>
      <RBS.CardTitle>{section}</RBS.CardTitle>
      <RBS.CardSubtitle>{title}</RBS.CardSubtitle>
      <RBS.CardText>{this.getDate()}</RBS.CardText>
      <RBS.CardText>{abstrct}</RBS.CardText>
      <RBS.CardLink href={url} target="_BLANK">Read Now</RBS.CardLink>
      
    </RBS.CardBlock>;
  }

  render() {
    return <RBS.Card>
        {this.renderImage()}  
        {this.renderBody()}  
    </RBS.Card>; 
  }
  }
