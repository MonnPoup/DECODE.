import React from "react";
import { Carousel, Container, Row, Col} from 'react-bootstrap';
import { Popover, Button } from 'antd';

function AllPaletteModel(props) {
 

  var paletteColor = props.colors;
  var tabPaletteColor = paletteColor.map((color, i) => {
    return (
      <div
        key={i}
        className="paletteAllPalettes"
        style={{ backgroundColor: `${color}` }}
      ></div>
    );
  });
  

  return (
    <div style={{paddingBottom:'1vh'}}>
      <div className="containerAllPalettes">
        <h3 className="h3Container"> {props.name}</h3>
        <div className="traitContainerAllPalettes">
          <div className="paletteContainer">{tabPaletteColor}</div>
        </div>
      </div>
      <div style={{marginBottom:'50px', marginTop: '25px'}}>
      <Carousel >
        <Carousel.Item className="carouselAllPalettes">
              <div style={{padding: '10px',height:'350px', width:'300px', backgroudColor: 'white', display: 'flex'}}>
                  <img
                  style={{marginRight: '20px', height:'100%', maxWidth: '500px',maxHeight:'4000',borderRadius:"10px"}}
                  key={1}
                    src={props.inspirations[0]}
                    alt="First slide"
                  />
          
          
                  <img
                  style={{marginRight: '20px', height:'100%', maxWidth: '500px',maxHeight:'4000',borderRadius:"10px"}}
                  key={1}
                    src={props.inspirations[1]}
                    alt="First slide"
                  />
           
                  <img
                  style={{marginRight: '20px', height:'100%', maxWidth: '500px',maxHeight:'4000',borderRadius:"10px"}}
                  key={1}
                    src={props.inspirations[2]}
                    alt="First slide"
                  />
              </div>
            </Carousel.Item>
            <Carousel.Item style={{backgroundColor: '#203126', maxWidth: '80%', marginLeft: '10%', paddingLeft: '10%'}}>
              <div style={{padding: '10px',height:'350px', backgroudColor: 'white', display: 'flex'}}>
            
                  <img
                  style={{marginRight: '20px', height:'100%', maxWidth: '500px',maxHeight:'4000',borderRadius:"10px"}}
                  key={1}
                    src={props.inspirations[3]}
                    alt="First slide"
                  />
             
                  <img
                  style={{marginRight: '20px', height:'100%', maxWidth: '500px',maxHeight:'4000',borderRadius:"10px"}}
                  key={1}
                    src={props.inspirations[4]}
                    alt="First slide"
                  />
             
                  <img
                  style={{marginRight: '20px', height:'100%', maxWidth: '500px',maxHeight:'4000',borderRadius:"10px"}}
                  key={1}
                    src={props.inspirations[5]}
                    alt="First slide"
                  />
            
              </div>
            </Carousel.Item>
      </Carousel>
      </div>
    </div>
  );
}

export default AllPaletteModel;

