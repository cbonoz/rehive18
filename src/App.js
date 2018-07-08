import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Globe from './components/Globe';
import { Navbar, NavItem, Nav, MenuItem, NavDropdown, Grid, Row, Col, Button } from 'react-bootstrap';
import api from './helper/api';
import axios from 'axios';

import logo from './assets/stellar_world_50.png';

class App extends Component {

  componentWillMount() {
    const self = this;
    this.resetGlobe();

    self.onSelectNode = self.onSelectNode.bind(this);

    self.setState({
      nodes: {},
      selectedNodes: [],
      isNodeSelected: false,
      nodeInfo: {},
      lastUpdated: undefined
    });

    console.log('requesting nodes')

    api.getLastUpdated().then(data => {
      const res = data.data;
        self.setState({lastUpdated:res.updated});
    });

    api.getNodes().then((data) => {
      const nodes = data.data;
      console.log('received ' + nodes.length + " nodes");
      self.setState({nodes: nodes});
    }).catch(err => {
      alert("Data could not be retrieved: " + err);
    })

  }

  onSelectNode(primaryNode) {
    const self = this;
    // console.log(primaryNode)
    const nodes = self.state.nodes;
    const selectedNodes = [primaryNode];
    if (primaryNode.quorumSet) {
      [...primaryNode.quorumSet.validators, ...primaryNode.quorumSet.innerQuorumSets].map((key) => {
        if (nodes.hasOwnProperty(key)) {
          selectedNodes.push(nodes[key]);
        }
      });
    }
    self.setState({
      nodeInfo: primaryNode,
      isNodeSelected: true,
      selectedNodes: selectedNodes
    });
    console.log('new state', self.state)
  }

  resetGlobe() {
    const self = this;
    self.setState({
      nodeInfo: {}, // map of publicKey -> Node
      selectedNodes: [], // list of publicKeys
      isNodeSelected: false // did the user select a node on the globe view
    });
  }

  render() {
    const self = this;
    const { lastUpdated, nodes, nodeInfo, isNodeSelected, selectedNodes } = self.state;
    const infoKeys = Object.keys(nodeInfo);

    const locationMap = {};
    const nodeValues = Object.values(nodes);
    nodeValues.map(node => {
      const loc = node.city || node.country;
      if (loc) {
        if (!locationMap[loc]) {
          locationMap[loc] = 0;
        }
        locationMap[loc] += 1;
      }
    });
    // const nodeSelected (infoKeys.length > 0)
    return (
      <div className="App">
        <Navbar collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <img src={logo} />
              {/* <a href="#brand">Stellar World</a> */}
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Nav>
    <NavItem eventKey={1} href="/home">
      Node Map
    </NavItem>
    <NavItem eventKey={2} href="/about">
      About
    </NavItem>
  </Nav>
        </Navbar>
        <Grid fluid style={{ paddingLeft: 100, paddingRight: 100 }}>
        <div className="top-row">
            <Row>
              <Col xs={12} md={12}>
                <h3 className="centered"> Found <b>{Object.keys(nodes).length}</b> Stellar Nodes</h3>
                <p className="centered"><i>Last Updated: <b>{lastUpdated}</b></i></p>
              </Col>
            </Row>
          </div>
          <Row className="show-grid">
            <Col xs={12} md={4}>
              {isNodeSelected && <Button bsStyle="danger" onClick={() => this.resetGlobe()}>Go Back</Button>}
              {!isNodeSelected && <div>
                <h3><b>Locations Represented</b></h3>
                <ul>
                {
                  Object.keys(locationMap).sort().map((location, index) => {
                    return <li key={index}><b>{location}</b> ({locationMap[location]})</li>;
                  })
                }
                </ul>
                </div>
              }
              {isNodeSelected &&
                <div>
                  <h3><b>Selected Node:</b></h3>
                  {infoKeys.filter(key => nodeInfo[key]).map((key, keyIndex) => {
                    const value = nodeInfo[key];
                    if (value instanceof Object) {
                      return <div key={keyIndex}><b>{key}:&nbsp;</b>
                        <ol>
                          {Object.keys(value).map((valueKey, valIndex) => {
                            if (value[valueKey] instanceof Array) {
                              <ul>
                                {value[valueKey].map((subValue, subKey) => {
                                  <li key={subKey}>&nbsp;{JSON.stringify(subValue[subKey])}</li>
                                })}
                              </ul>
                            } else {
                              return <li key={valIndex}>&nbsp;{JSON.stringify(value[valueKey])}</li>
                            }
                          })}
                        </ol>
                      </div>
                    } else {
                      return <div key={keyIndex}><b>{key}:</b>{value}<br /></div>
                    }
                  })} 
                  <b>More info: <br/><a href={`https://www.stellarbeat.io/nodes/${nodeInfo.publicKey}`} target="_blank">Stellarbeat</a></b>
                  <br /><hr />
                </div>
              }

            </Col>
            <Col xs={12} md={8}>
              <Globe nodes={self.state.nodes} onSelectNode={self.onSelectNode} selectedNodes={self.state.selectedNodes} isNodeSelected={self.state.isNodeSelected} />
            </Col>
          </Row>

          <div className="info-section centered">
            <a className="bottom-link" rel="noopener noreferrer" href="https://www.stellar.org/" target="_blank">Stellar</a>
            <a className="bottom-link" rel="noopener noreferrer" href="https://stellarscan.io/transactions" target="_blank">Stellar Transactions</a>
            <a className="bottom-link" rel="noopener noreferrer" href="https://www.stellarbeat.io/" target="_blank">Stellar Beat (Flatmaps)</a>
          </div>

          <div className="bottom-row"/>
        </Grid>
      </div>
    );
  }
}

export default App;
