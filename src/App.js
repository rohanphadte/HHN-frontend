import './App.css';
import React from "react";
import {Container, Row, Col} from "react-bootstrap"

class App extends React.Component {

  render() {
    return (
      <Container>
        <div className="App">
          <header className="App-header">
            Highlighted Hacker News
          </header>
        </div>
        <div className="Content">
          <Entry/>
          <Entry/>
          <Entry/>
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
  }

  expand() {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    var highlights = <div></div>
    if (this.state.expanded) {
      highlights = <div>
        <Highlight></Highlight>
        <Highlight></Highlight>
        <Highlight></Highlight>
        <div className="EntryFooter">
          <span onClick={this.expand}>Visit Website</span>
          <span onClick={this.expand}> | See Less</span>
        </div>
        </div>
    }

    return (
      <Row className="Entry">
        <Col xs="auto" className="EntryNumber">
          <b>1.</b>
        </Col>
        <Col className="EntryDetails">
        <div onClick={this.expand} className="EntryTitle">
          <span>Google</span>
          <span className="EntryHost">Google</span>
        </div>
        <div className="EntrySubline">
          <span>120 points by nvahalik</span>
          <span onClick={this.expand}> | 6 Highlights</span>
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
          Hello, this is a highlight from a Hacker News Article. It is useful.
        </Col>
      </Row>
    )
  }
}

export default App;
