import React, { useState, useRef, useEffect } from "react";
import {
  BottomNavigation,
  Button,
  Drawer,
} from "@mui/material";
import axios from "axios";
import { Stage, Layer, Rect, Text, Transformer, Image, Circle} from 'react-konva';
import Navbar from "./Navbar";
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import RectangleOutlinedIcon from '@mui/icons-material/RectangleOutlined';


const Canvas = () => {
  const [value, setValue] = useState(0)
  const [file, setFile] = useState();
  const [images, setImages] = useState();
  const [Fonts, setFonts] = useState([]);
  const [Unsplashimages, setUnsplashImages] = useState([]);

  const [openUploadDrawer, setOpenUploadDrawer] = useState(false);
  const [openTextDrawer, setOpenTextDrawer] = useState(false);
  const [openElementDrawer, setOpenElementDrawer] = useState(false);
  const [openLogosDrawer, setOpenLogosDrawer] = useState(false);


  const [text, setText] = useState('');
  // const [imageUrl, setImageUrl] = useState(''); // State to store the image URL
  const [shapes, setShapes] = useState([]);
  
  const [selectedShape, setSelectedShape] = useState(null);
  const transformerRef = useRef(null);

  
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleAddRect = () => {
    // Create a new rectangle shape and add it to the state
    const newRectangle = {
      type: 'rectangle',
      width: 100, // Rectangle width
      height: 50, // Rectangle height
      x: 150, // X-coordinate
      y: 150 + shapes.length * 30, // Y-coordinate, increment for each element
      fill: 'blue', // Rectangle fill color
    };

    setShapes([...shapes, newRectangle]);
  };

  const handleAddCircle = () => {
    // Create a new circle shape and add it to the state
    const newCircle = {
      type: 'circle',
      radius: 50, // Circle radius
      x: 150, // X-coordinate
      y: 150 + shapes.length * 30, // Y-coordinate, increment for each element
      fill: 'green', // Circle fill color
    };

    setShapes([...shapes, newCircle]);
  };

  
  const handleAddText = () => {
    // Create a new text shape and add it to the state
    const newText = {
      type: 'text',
      text: text, // Text content
      x: 10, // X-coordinate
      y: 10 + shapes.length * 30, // Y-coordinate, increment for each text element
      fontSize: 16, // Font size
      fill: 'black', // Text color
      draggable:true
    };

    setShapes([...shapes, newText]);
    setText(''); // Clear the input field
  };

  const handleAddImageToCanvas=(imageUrl)=>{
    console.log(imageUrl) 
     if (imageUrl.trim() === '') return; // Don't add empty image URLs

    // Create a new image shape and add it to the state
    const newImage = {
      type: 'image',
      imageUrl: imageUrl, // Image URL
      x: 10, // X-coordinate
      y: 10 + shapes.length * 30, // Y-coordinate, increment for each element
      width: 100, // Image width
      height: 100, // Image height
    };

    setShapes([...shapes, newImage]);
    // setImageUrl(''); // Clear the input field
  }
  
  const handleSelectShape = (e, shape) => {
    setSelectedShape(shape);
    // Set the transformer to the selected shape
    transformerRef.current.nodes([e.target]);

  };



  const handleDownload = () => {
    if (transformerRef.current) {
      // Deselect the currently selected shape (if any)
      setSelectedShape(null);
      transformerRef.current.detach();
    }

    const stage = transformerRef.current.getStage();

    const dataURL = stage.toDataURL();
    console.log(dataURL);
    

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'edited_image.png';
    const imageName = link.download;
    link.click();
    console.log(link);
    
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/save`,{
      imageName,
      url : dataURL,
    })
    .then(res=>console.log(res))
    .catch(err=>console.log(err))
}

  const ShapeComponent = ({ shape }) => {
    if (shape.type === 'text') {
      return (
        <Text
          text={shape.text}
          x={shape.x}
          y={shape.y}
          fontSize={shape.fontSize}
          fill={shape.fill}
          onClick={e=> handleSelectShape(e, 'rectangle')}
        />
      );
    } else if (shape.type === 'image') {
      return <ImageComponent shape={shape} />;
    } else if (shape.type === 'rectangle') {
      return (
        <Rect
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          fill={shape.fill}
          onClick={e=> handleSelectShape(e, 'rectangle')}
          draggable
        />
      );
    } else if (shape.type === 'circle') {
      return (
        <Circle
          x={shape.x}
          y={shape.y}
          radius={shape.radius}
          fill={shape.fill}
          onClick={e=> handleSelectShape(e,'circle')}
          draggable
        />
      );
    }
    return null;
  };

  const ImageComponent = ({ shape }) => {
    const [imageObj, setImageObj] = useState(null);

    // Load image when the component mounts
    React.useEffect(() => {
      if (shape.type === 'image') {
        const image = new window.Image();
        image.src = shape.imageUrl;
        image.crossOrigin = 'Anonymous'
        console.log(image.src);
        image.onload = () => {
          setImageObj(image);
        };
      }
    }, [shape]);

    console.log(imageObj);
    return (
      <Image
        image={imageObj}
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        draggable
      />
    );
  };


/////////////////////////////////////////////////////////////////////////////////////////////

const handleUploadClick = (e) => {
  // console.log(file);
  const formData = new FormData();
  formData.append("file", file);
  axios
    .post(`${process.env.REACT_APP_BACKEND_URL}/upload`, formData)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

  
 

  const toggleUploadDrawer = () => {
    setOpenUploadDrawer(!openUploadDrawer);

    function showUploads() {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/getImages`)
        .then((res) => {
          setImages(res.data);          
        })
        .catch((err) => console.log(err));
    }

    showUploads();
  };



  const toggleTextDrawer = () => {
    setOpenTextDrawer(!openTextDrawer);

   
    function showFonts() {
        axios
          .get(`https://www.googleapis.com/webfonts/v1/webfonts`,{
            params:{
              key: process.env.REACT_APP_GOOGLE_FONTS_API_KEY,
            }
          })
          .then((res) => {
            let allFonts = res.data.items
            let SlicedFonts = allFonts.slice(0,100)
            setFonts(SlicedFonts)
            console.log(SlicedFonts)
          })
          .catch((err) => console.log(err));
      }
  
      showFonts();
  };

  const toggleElementDrawer = () => {
      setOpenElementDrawer(!openElementDrawer);
      if(openElementDrawer === false ){

        function showElements(){
            axios.get(`https://api.unsplash.com/photos`,{
                params:{
                    client_id : process.env.REACT_APP_UNSPLASH_ACCESS_API_KEY,
                }
            })
            .then(res =>{
                console.log(res.data)
                setUnsplashImages(res.data)
            })
            .catch(err=> console.log(err))
        }
        showElements()
    }
  }; 
  
  const toggleLogosDrawer = () => {
    setOpenLogosDrawer(!openLogosDrawer);
   
}; 

  return (
    <div className="konvajs-content">      
    <Navbar/>
      <Stage width={400} height={400} className="stage">
        <Layer>
            {shapes.map((shape, index) => (
            <div>
                <ShapeComponent shape={shape} />
                <Transformer ref={transformerRef} />
            </div>
    ))}
  </Layer>
      </Stage>

      <Button variant="contained" color="secondary" onClick={handleDownload}>Download Image </Button>
    
    <BottomNavigation
      sx={{ width: "45%", position: "absolute", bottom: 10, background: '#343434', color:"white", display:"flex", alignItems:"center", borderRadius:'20px', justifyContent:'space-evenly' }}
      value={value}
      onChange={async (event, value) => {
        setValue(value);
      }}
      showLabels
    >
        {/* upload button here //////////////////////////////////////////////////*/}
      <div>
        <Button style={{color:"white"}} onClick={toggleUploadDrawer}> Upload </Button>
        <Drawer
          anchor="left"
          open={openUploadDrawer}
          onClose={toggleUploadDrawer}
          PaperProps={{
            sx: {
              backgroundColor: "#252627",
              color: "#FFFCEB",
            },
          }}
        >
          <div>
            <div className="uploadInput">
                <h2 style={{fontSize:'45px'}}>Upload Images</h2>
                <div className="uploadInputButton">
                    <input style={{backgroundColor:'white', padding:'3px', color:'black', borderRadius:'10px', border:'1px solid black'}} type="file" onChange={(e) => setFile(e.target.files[0])} />
                    <span><Button variant="contained" onClick={handleUploadClick}>Upload</Button></span>
                </div>
            </div>

            <br />
            <br />
            <div className="imageContainer">
              {images &&
                images.map((image) => (
                  <div className="images">
                    <img 
                    onClick={()=> handleAddImageToCanvas(`${process.env.REACT_APP_BACKEND_URL}/Images/` + image.Image)}  
                      src={`${process.env.REACT_APP_BACKEND_URL}/Images/` + image.Image}
                      alt=""
                      width={120}
                      height={120}
                      />
                  </div>
                ))}
            </div>
          </div>
        </Drawer>
      </div>

        {/* text button here///////////////////////////////////////////////////////// */}
      <div>
        <Button style={{color:"white"}} onClick={toggleTextDrawer}> Text </Button>
        <Drawer anchor="left" open={openTextDrawer} onClose={toggleTextDrawer} 
         PaperProps={{
           sx: {
              backgroundColor: "#252627",
              color: "#FFFCEB",
            },
          }} >
          <div className="uploadInputButton">
            <h2>Text Content</h2>

            <input style={{padding:'10px'}} type="text" placeholder="Enter text" value={text} onChange={handleTextChange}/>
            <Button variant="contained" color="primary" onClick={handleAddText}>Add Text</Button>
               <div className="fonts">
                {
                Fonts && Fonts.map( (font)=>{
                  let family = font.family;
                  console.log(family)
                  return (<p style={{ font:`25px ${family},${font.category}`, display: 'flex', width:'300px', marginLeft: '45px', gap: '100px'}}> just a showpeice </p>)
                })
                }
              </div>
          </div>
        </Drawer>
      </div>

      {/* element button here //////////////////////////////////////////////////////*/}
      <div>
        <Button style={{color:"white"}} onClick={toggleElementDrawer}> Elements </Button>
        <Drawer
          anchor="left"
          open={openElementDrawer}
          onClose={toggleElementDrawer}
          PaperProps={{
            sx: {
              backgroundColor: "#252627",
              color: "#FFFCEB",
            },
          }}
          >
          <div className="unsplashImageContainer">
            <h2>Elements Content</h2>
              <div className="images">
                {
                Unsplashimages && Unsplashimages.map( (image)=>(
                  <img onClick={()=> handleAddImageToCanvas(image.urls.small)} src={image.urls.small} alt={image.alt_description} width={150} height={150}/>
                  ))
                }
              </div>
          </div>
        </Drawer>
      </div>
      {/*///// logos /////////////////////////////////////////////////////////////////// */}

      <div>
        <Button style={{color:"white"}} onClick={toggleLogosDrawer}> Logos </Button>
        <Drawer
          anchor="left"
          open={openLogosDrawer}
          onClose={toggleLogosDrawer}
          PaperProps={{
            sx: {
              backgroundColor: "#252627",
              color: "#FFFCEB",
            },
          }}
          >
          <div className="logoContainer">
            <h2>Shapes and Logos</h2>
              <div className="logos">
                  <p className="shapes" onClick={handleAddRect}><RectangleOutlinedIcon fontSize="large" /></p>
                  <p className="shapes" onClick={handleAddCircle}><CircleOutlinedIcon fontSize="large" /></p>
              </div>

              <div className="logos">
                  <p className="shapes" onClick={handleAddRect}><RectangleOutlinedIcon fontSize="large" /></p>
                  <p className="shapes" onClick={handleAddCircle}><CircleOutlinedIcon fontSize="large" /></p>
              </div>
              <div className="logos">
                  <p className="shapes" onClick={handleAddRect}><RectangleOutlinedIcon fontSize="large" /></p>
                  <p className="shapes" onClick={handleAddCircle}><CircleOutlinedIcon fontSize="large" /></p>
              </div>
              <div className="logos">
                  <p className="shapes" onClick={handleAddRect}><RectangleOutlinedIcon fontSize="large" /></p>
                  <p className="shapes" onClick={handleAddCircle}><CircleOutlinedIcon fontSize="large" /></p>
              </div>
              
              
          </div>
        </Drawer>
      </div>

    </BottomNavigation>
    </div>
  );
};

export default Canvas;
