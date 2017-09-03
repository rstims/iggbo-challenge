import React, {
  Component
}                from 'react';

import _         from 'lodash';
import moment    from 'moment-timezone';
import * as RBS  from 'reactstrap';


export default class Article extends Component{
  constructor(props){
    super(props); 

    this.state = {
      toolTipIsOpen: false 
    };

  }

  /**
   * Retrieve date with correct format 
   *
   * @props <created_date>
   * @props <timezone>
   *
   */
  getDate = () => {
    const date   = _.get(this.props,"created_date",undefined);
    // FJT isn't part of the moment timezone database
    const format = `M/DD/YYYY h:mm A ${this.props.timezone === 'Pacific/Fiji' ? 'FJT' : 'z'}`;

    return moment.tz(date, this.props.timezone).format(format); 
  }

  /**
   * Retrieve date with correct format 
   *
   * @state <tooTipIsOpen>
   *
   */
  handleToggleTooltip = () => {
    this.setState({toolTipIsOpen: !this.state.toolTipIsOpen}); 
  }

  /**
   * Render image block 
   *
   * @state <tooTipIsOpen>
   *
   * @props <imageFormat>
   * @props <multimedia>
   * @props <idx>
   */
  renderImage = () => {
    const image = _(this.props.multimedia).chain().filter({ format: this.props.imageFormat }).get("[0]",null).value();

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

  /**
   * Render body block 
   *
   * @props <abstract>
   * @props <section>
   * @props <title>
   * @props <url>
   */
  renderBody = () => {
    const abstrct = _.get(this.props,"abstract",null); 
    const section = _.get(this.props,"section",null); 
    const title   = _.get(this.props,"title",null); 
    const url     = _.get(this.props,"url",null); 

    return <RBS.CardBlock>
      <RBS.CardTitle>{section}</RBS.CardTitle>
      <RBS.CardSubtitle>{title}</RBS.CardSubtitle>
      <RBS.CardText>{this.getDate()}</RBS.CardText>
      <RBS.CardText>{abstrct}</RBS.CardText>
      <RBS.CardLink href={url} target="_BLANK">Read Now</RBS.CardLink>
      
    </RBS.CardBlock>;
  }

  /**
   * Render 
   */
  render() {
    return <RBS.Card>
        {this.renderImage()}  
        {this.renderBody()}  
    </RBS.Card>; 
  }
}
