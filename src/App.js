import './App.css';
import React from "react";
import {Container, Row, Col, Alert} from "react-bootstrap"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.showAbout = this.showAbout.bind(this)
    this.state = {
      news_ids: [],
      stories: {},
      showAbout: false
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
    var urls = this.state.news_ids.map((id) => "https://hacker-news.firebaseio.com/v0/item/" + id + ".json?print=pretty")
    Promise.all(
      urls.map(url =>
        fetch(url)
          .then(res => res.json())
      )
    ).then(data => {
      var stories = {}
      var urls = []
      for (let i = 0; i < data.length; i++) {
        var storydata = data[i]
        storydata["numHighlights"] = 0
        stories[data[i]["id"]] = storydata
        urls.push(data[i].url ?? "")
      }
      this.setState({ stories: stories })
      return urls
    }).then(urls => {
      fetch("https://hacker-news-dot-commandfeed.uc.r.appspot.com/getHighlights", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"urls": urls})
      }).then(res => res.json())
      .then(data => {
        var stories = this.state.stories
        for (let i = 0; i < data.length; i++) {
          for (var key in stories) {
            if (stories[key].url === data[i].url) {
              var storyData = stories[key]
              storyData["highlights"] = data[i].highlights
              storyData["numHighlights"] = data[i].highlights.length
              stories[key] = storyData
              this.setState({ stories: stories })
            }
          }
        }
      })
    })
  }

  showAbout() {
    this.setState({showAbout: !this.state.showAbout})
  }

  render() {
    var showAbout = <AlertDismissible />
    if (!this.state.showAbout) {
      showAbout = <div></div>
    }

    var entries = this.state.news_ids.map((id, index) => <Entry key={index} number={index+1} data={this.state.stories[id]}/>)
    return (
      <Container>
        <div className="App">
        {showAbout}
          <header className="App-header">
            <span>
              Highlighted Hacker News
            </span>
            <span onClick={this.showAbout} className="About">
              about
            </span>
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
      var highlightRows = <div></div>
      if (this.props.data?.highlights) {
        highlightRows = this.props.data?.highlights.map(x => <Highlight text={x}/>)
      }

      highlights = <div>
        {highlightRows}
        <div className="EntryFooter">
          <span onClick={this.goToWebsite}>Visit Website</span>
          <span onClick={this.expand}> | See Less</span>
        </div>
        </div>
    }

    var host = ""
    var scoreSpan = <span></span>
    var highlightSpan = <span></span>

    if (this.props.data?.title != null) {
      if (this.props.data?.url != null) {
        host = "(" + new URL(this.props.data?.url).hostname + ")"
      }
      var title = this.props.data?.title
      var score = this.props.data?.score
      var author = this.props.data?.by
      var number = this.props?.number + "."
      var numHighlights = this.props.data?.numHighlights
      scoreSpan = <span>{score} points by {author}</span>

      if (numHighlights > 0) {
        if (numHighlights === 1) {
          highlightSpan = <span onClick={this.expand}> | <b className="boldHighlights">{numHighlights} Highlight </b></span>
        } else {
          highlightSpan = <span onClick={this.expand}> | <b className="boldHighlights">{numHighlights} Highlights </b></span>
        }
      }
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
          {scoreSpan}
          {highlightSpan}
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
          {this.props.text}
        </Col>
      </Row>
    )
  }
}

class AlertDismissible extends React.Component {
  render() {
    return (
      <Alert variant="info">
        <Alert.Heading>Why Highlights?</Alert.Heading>
        <p>
          Hi There! I'm an avid Hacker News reader, but I sometimes find myself spending hours reading articles. I wanted to create Hacker News, but just the highlights, where people could understand teh general idea before committing to reading.
        </p>
        <hr />
        <p className="mb-0">
          These are my highlights from the top articles - decided by me. I don't claim to the sole arbiter of truth here, but I hope it helps the Hacker community.
        </p>
      </Alert>
    )
  }
}

export default App;
