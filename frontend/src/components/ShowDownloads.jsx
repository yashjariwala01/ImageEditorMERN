import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';

const ShowDownloads = () => {
    const [images, setImages] = useState();
    const [error,setError ] = useState(true);

    useEffect(()=>{
        axios.get("https://deltaimageeditorappmern.onrender.com/getDownloadedImages")
        .then(res=>{
            console.log(res.data);
            setError(false);
            setImages(res.data)
            // console.log(res.data.url);
        })
    },[])

    if(error){
      return <h1 style={{display:'flex', justifyContent:'center', marginTop:'50vh'}}>loading...</h1>
    }
  return (
    <div>
      <Navbar/>
      <div className='downloads'>
          {
            images && images.map(image=>{
              return (<img className='DownloadedImages' src={image.url} alt="image" width={250} height={200} />)
            })
          }
    </div>
    </div>
  )
}

export default ShowDownloads

