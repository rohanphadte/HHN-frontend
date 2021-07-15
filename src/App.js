import './App.css';
import React from "react";
import {Container, Row, Col} from "react-bootstrap"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      news_ids: [],
      stories: {}
    }
  }

  componentDidMount() {
    var url = "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"
    fetch(url)
      .then(response => response.json())
      .then(json => {
         this.setState({ news_ids: json.slice(0, 20) })
         this.populateData()
      });
  }

  populateData() {
    for (let i = 0; i < this.state.news_ids.length; i++) {
      var url = "https://hacker-news.firebaseio.com/v0/item/" + this.state.news_ids[i] + ".json?print=pretty"
      fetch(url)
        .then(response => response.json())
        .then(json => {
          const stories = { ...this.state.stories, [this.state.news_ids[i]]: json} 
          this.setState({ stories: stories })
        });
    }
  }

  render() {
    var entries = this.state.news_ids.map((id, index) => <Entry key={index} number={index+1} data={this.state.stories[id]}/>)

    return (
      <Container>
        <div className="App">
          <header className="App-header">
            Highlighted Hacker News
          </header>
        </div>
        <div className="Content">
          {entries}
        </div>
      </Container>
    );
  }
}


class Entry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }
    this.expand = this.expand.bind(this)
    this.goToWebsite = this.goToWebsite.bind(this)
  }

  expand() {
    this.setState({expanded: !this.state.expanded})
  }

  goToWebsite() {
    if (this.props.data?.url != null) {
      var url = this.props.data?.url
      window.location.href = url
    }
  }

  render() {
    var highlights = <div></div>
    if (this.state.expanded) {
      highlights = <div>
        <Highlight></Highlight>
        <Highlight></Highlight>
        <Highlight></Highlight>
        <div className="EntryFooter">
          <span onClick={this.goToWebsite}>Visit Website</span>
          <span onClick={this.expand}> | See Less</span>
        </div>
        </div>
    }

    
    var host = ""
    if (this.props.data?.url != null) {
      host = "(" + new URL(this.props.data?.url).hostname + ")"
      var title = this.props.data?.title
      var score = this.props.data?.score
      var author = this.props.data?.by
      var number = this.props?.number + "."
    }
    
    return (
      <Row className="Entry">
        <Col xs="auto" className="EntryNumber">
          <b>{number}</b>
        </Col>
        <Col className="EntryDetails">
        <div onClick={this.expand} className="EntryTitle">
          <span>{title}</span>
          <span className="EntryHost">{host}</span>
        </div>
        <div className="EntrySubline">
          <span>{score} points by {author}</span>
          <span onClick={this.expand}> | 3 Highlights</span>
        </div>
        {highlights}
        </Col>
      </Row>
    )
  }
}

class Highlight extends React.Component {
  render() {
    return (
      <Row className="Highlight">
        <Col xs="auto">
          <div className="Thread"></div>
        </Col>
        <Col xs={10} l={5}>
          Hello, this will be a highlight from a Hacker News Article. It is intended to be useful.
        </Col>
      </Row>
    )
  }
}

export default App;
