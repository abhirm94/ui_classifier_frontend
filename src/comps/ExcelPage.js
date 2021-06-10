import React, { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

import ExcelContainer from './ExcelContainer';
import ImageContainer from './ImageContainer';

const ExcelPage = () => {
  const [file, setFile] = useState([]);
  const [error, setError] = useState(null);
  const [image,setImage]=useState([]);
  const types = ['image/png', 'image/jpeg'];
  const [result,setResult]=useState(null);
  
  const [name,setName]=useState("test");
  const [dob,setDob]=useState(new Date('01 Jan 1970 00:00:00 GMT'));
  const [pan,setPan]=useState("XXXXX11111");
  
  const [excelData,setExcelData] = useState();
  const [images,setImages] = useState([]);
  const [files,setFiles] = useState([]);
  const [typeList,setTypeList] = useState([]);

  const [names,setNames]=useState([]);
  const [pans,setPans]=useState([]);
  const [dobs,setDobs]=useState([]);

  useEffect(()=>{
    let temp_images=[];
    let file_types=[];
    for(let i=0;i<files.length;i++){
      temp_images.push(URL.createObjectURL(files[i]));
      file_types.push(files[i].type);
    }
    setImages(temp_images);
    setTypeList(file_types);
    console.log(file_types);
  },[files]);

function ExcelDateToJSDate(serial) {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000);
 
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
 
    var total_seconds = Math.floor(86400 * fractional_day);
 
    var seconds = total_seconds % 60;
 
    total_seconds -= seconds;
 
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
 
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
 }

function getformatteddate(serial) {
    let today=ExcelDateToJSDate(serial);  
    if(today instanceof Date){
    let dd = today.getDate && today.getDate();
    let mm = (today.getMonth && today.getMonth()) + 1;
    let yyyy = today.getFullYear && today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return (dd + '/' + mm + '/' + yyyy);
    }
    
  }	
  useEffect(()=>{
    let temp_names=[];
    let temp_pans=[];
    let temp_dobs=[];
   
    console.log(excelData);

    for(let i=0;i<files.length;i++){
      
      if(excelData[files[i].name]){
        temp_names.push(excelData[files[i].name]['NAME']);
        temp_pans.push(excelData[files[i].name]['PAN'])
        temp_dobs.push(getformatteddate(excelData[files[i].name]['DOB']));
      }
    }

    setNames(temp_names);
    setPans(temp_pans);
    setDobs(temp_dobs);
    console.log(temp_dobs);

  },[files,excelData]);
  
  

  
 

 function percent(prob) {
   if(prob!=="")
   return 100*prob;
   else 
   return 0;
 } 
  const detailsCell = (i) => {
    return (  
       <td> 
         Name: {names[i]}<br />
         Date of Birth {dobs[i]} <br />
         PAN Card {pans[i]} 
       </td>
     );
   };

   const filename = (i) => {
    return (  
       <td> {<img src={images[i]} height="300" width="300" />}</td>
     );
    };
    
  const filenames = () => {
    const items = [];
    const detailsRow = [];

    for(let i=0;i<files.length;i ++) {
      items.push(filename(i));
    }

    for(let i=0;i<files.length;i ++) {
      detailsRow.push(detailsCell(i));
    }


    return ( <div className="flex">
    {images.map((i,index)=>{
      return(
        <div className="card">

<img src={i} height="250" width="250" />
<p className="text">
Name: {names[index]}<br />
         Date of Birth {dobs[index]} <br />
         PAN Card {pans[index]}
       </p> </div>
      
      );
    })}
  </div>);
      
};





const resultnames = () => {
 
  return (<div className="flex">
  {images.map((image,i)=>{
    return(
      <div className="large-card">

<img src={image} height="220" width="220" />
<p className="text margin-top">
        <h3 className="sub"> CMS Data</h3>
       Name: {names[i]}<br />
       Date of Birth {dobs[i]} <br />
       PAN Card {pans[i]} <br />
       <h3 className="sub"> OCR  Data</h3>
      
       {result[i][1].reason && <span>
      Status: {result[i][1].status}<br />
      Reason: {result[i][1].reason}<br />
      PAN Card Pattern Match: {percent(result[i][1].pan_card_ocr_similarity_score)+"%"}<br />
      Name match : {percent(result[i][1].ocr_cms_name_similarity_score)+"%"}<br />
      PAN Match : {percent(result[i][1].ocr_cms_pan_similarity_score)+"%"}<br />
      Dob Match : {percent(result[i][1].ocr_cms_dob_similarity_score)+"%"}<br />
     </span> }

     </p> </div>
    
    );
  })}
</div> );
    
};


const onFileUpload = () => {
  const formData = new FormData();
  const file_names = [];

  for(let i=0;i<files.length;i++) {
    formData.append(
      "image",
      files[i],
      files[i].name
    );
    file_names.push(files[i].name);
  }

  formData.append(
    "names",names.join(",")
  );
  formData.append(
    "pans",pans.join(",")
  );

  formData.append(
    "dobs",dobs.join(",")
  );

  formData.append(
    "filenames",file_names.join(",")
  );
  //   https://sportzi-pancard.herokuapp.com/
 
  axios.post("https://sportzi-pancard.herokuapp.com/", formData).then(res => {
  if(res && res.data && res.data.output) {
    let output=res.data.output;
    let result_array=[];
    
    for(let i=0;i<files.length;i++) {
      result_array.push([files[i].name,output[i],output[i].status]);
    }
    console.log(result_array);
    setResult(result_array);
    
  } 
  })
  .catch(err => console.error(err));
};

const upload=(e) =>{
  e.preventDefault();
 
    onFileUpload();
  return;
};

const reload=(e) =>{
  e.preventDefault();
 setFiles([]);
 setImages([]);
  setResult(null);
  setNames([]);
  setDobs([]);
  setPans([]);
  setName("TEST");
  setPan("bbbbb11111");
  setDob(new Date('01 Jan 1970 00:00:00 GMT'));  
  return;
};



  return (
    <div className="container">

      <h1 className="brand">Pan Card Verification demo</h1>
      <div class="flex main">
      <div class="wrapper animated bounceInLeft">

      Upload Excel File <ExcelContainer setExcelData={(data)=>{setExcelData(data)}}/>

      Upload Images  <ImageContainer setFiles={(files)=>setFiles(files)}/>
        <button class="button" onClick={upload}>Upload and Verify</button>
      
      
      <button class="button" onClick={reload}>Reload</button>

      </div>
      {!result && files && files.length && 
        <div class="wrapper animated bounceIn">
          {filenames()}
        </div>
        }

{result && result.length && 
        <div class="tbl-header">
          {resultnames()}
        </div>
        }
      
      </div>
     
      <div className="output">
        { error && <div className="error">{ error }</div>}
        
        
      </div>
   
    </div>
  );
}

export default ExcelPage;
