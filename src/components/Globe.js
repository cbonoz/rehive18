
import React, { Component } from "react"
import {
  ComposableMap,
  Annotation,
  ZoomableGlobe,
  Geographies,
  Geography,
  Graticule,
  Markers,
  Marker,
  Line,
  Lines
} from "react-simple-maps"
import { scaleLinear } from "d3-scale"

import cities from "../assets/world-most-populous-cities.json"
import Annotations from "../../node_modules/react-simple-maps/lib/Annotations";


const ratingScale = scaleLinear()
  .domain([1, 5])
  .range([5, 10])

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
}

class Globe extends Component {

  componentWillMount() {
    const self = this;
    self.createMarker = self.createMarker.bind(self);
  }

  createMarker(node, isQuorum) {
    const self = this;
    const radius = ratingScale(node.activeRating);
    const color = isQuorum ?
      "#00FF00" :
      (node.active ? "#FF5722" : "#000080");

    return (
      <Marker
        key={node.name}
        marker={node}
        onClick={self.props.onSelectNode}
        style={{
          default: { opanode: 0.8 },
          hidden: { display: "none" },
        }}>
        <circle
          cx={0}
          cy={0}
          r={radius}
          fill={color}
          stroke="#FFF"
        />
        <circle
          cx={0}
          cy={0}
          r={radius + 2}
          fill="transparent"
          stroke="#FF5722"
        />
      </Marker>);
  }

  buildCurves(start, end, line) {
    const x0 = start[0];
    const x1 = end[0];
    const y0 = start[1];
    const y1 = end[1];
    const curve = {
      forceUp: `${x1} ${y0}`,
      forceDown: `${x0} ${y1}`
    }[line.curveStyle];
  
    return `M ${start.join(' ')} Q ${curve} ${end.join(' ')}`;
  }

  render() {
    const self = this;
    const nodes = self.props.nodes || {};
    const isNodeSelected = self.props.isNodeSelected;
    const selectedNodes = self.props.selectedNodes;
    console.log(isNodeSelected, selectedNodes);
    const nodekeys = Object.keys(nodes);

    const shownNodes = isNodeSelected ?
      selectedNodes :
      Object.values(nodes);
    // console.log(shownNodes)
    // const shownNodes = [];

    const OFFSET = 50;
    // const MAG = 130;
    const ROW_HEIGHT = 15;

    const annotationMap = {};
    const locationMap = {};
    shownNodes.map(node => {
      const loc = node.city || `${node.country} (Other)`;
      if (!annotationMap[loc]) {
        annotationMap[loc] = 0;
      }
      locationMap[loc] = node.coordinates;
      annotationMap[loc] += 1;
    });

    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projection="orthographic"
          projectionConfig={{
            scale: 300,
          }}
          width={800}
          height={800}
          style={{
            width: "100%",
            height: "auto",
          }}
        >
          <ZoomableGlobe center={[96, 32]}>
            <circle cx={400} cy={400} r={300} fill="transparent" stroke="#eceff1" />
            <Geographies geography="./world-110m.json" disableOptimization>
              {(geographies, projection) =>
                geographies.map((geography, i) => {
                  return (
                    <Geography
                      key={i}
                      round
                      geography={geography}
                      projection={projection}
                      style={{
                        default: {
                          fill: "#eceff1",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                        },
                        hover: {
                          fill: "#eceff1",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                        },
                        pressed: {
                          fill: "#eceff1",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                        },
                      }}
                    />
                  )
                }
                )}
            </Geographies>
            <Markers>
              {
                shownNodes.map((node, index) => {
                return self.createMarker(node, index == 0 && isNodeSelected);
              })
              }
            </Markers>

          <Annotations>
          {Object.keys(locationMap).map((loc, index) => {
            const magY = ((index % 10) * ROW_HEIGHT) - OFFSET;
            const magX = (index % 2 ? 1 : -1) * OFFSET;
            return <Annotation key={index} dx={ magX } dy={ magY } subject={ locationMap[loc] } strokeWidth={ 1 }>
              <text>
                { `${loc} (${annotationMap[loc]})` }
              </text>
            </Annotation>
          })}
          </Annotations>
            <Lines>
            {isNodeSelected && 
              selectedNodes.slice(1).map((node, index) => {
                console.log(selectedNodes[0].coordinates, node.coordinates)
                return <Line key={index}
                buildPath={self.buildCurves}
                  line={{
                    coordinates: {
                      start: [selectedNodes[0].longitude, selectedNodes[0].latitude],
                      end: [node.longitude, node.latitude]
                    }
                  }}
                  style={{
                    default: { fill: "#0000ff" },
                    hover:   { fill: "#0000ff" },
                    pressed: { fill: "#000" },
                  }}
                />
              })}
            </Lines>
          </ZoomableGlobe>
        </ComposableMap>
      </div>
    )
  }
}

export default Globe
