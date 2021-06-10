import React, { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import DateRangePicker from './DateRangePicker';
// import {PDFtoIMG} from 'react-pdf-to-image';


const UploadForm = () => {
  
  const [file, setFile] = useState([]);
  const [typeList,setTypeList] = useState([]);

  const [error, setError] = useState(null);
  const [image,setImage]=useState([]);
  const types = ['image/png', 'image/jpeg'];
  const [result,setResult]=useState(null);
  
  const [name,setName]=useState("test");
  const [dob,setDob]=useState(new Date('01 Jan 1970 00:00:00 GMT'));
  const [pan,setPan]=useState("XXXXX11111");

  const [names,setNames]=useState([]);
  const [pans,setPans]=useState([]);
  const [dobs,setDobs]=useState([]);
  
  

  const handleChange = (e) => {
    let selectedarray = e.target.files;
    let images=[];
    let types=[];
    for(let i=0;i<e.target.files.length;i++) {
      let selected=selectedarray[i];
      images.push(URL.createObjectURL(e.target.files[i]));
      types.push(selected.type);
      if (selected && types.includes(selected.type)) {
      
        setError('');
      } 
      else if(selected && selected.type === 'application/pdf'){
        
        setError('');
      }
      else {
        
        setError('Please select an image file (png or jpg)');
        return ;
      }
    }
    setImage([...image,...images]);
    setFile([...file,...selectedarray]);
    setTypeList([...typeList,...types]);
    setResult(null);

    
  };
  const filename = (i) => {
   
      return (  
         <td> {<img src={image[i]} height="300" width="300" />}</td>
       );
  };
  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log(numPages);
  };


  const displayPDF = (i) => {
    console.log(file[i]);
    return (  
      <td> {<img src={image[i]} height="300" width="300" />}</td>
    );
};
 


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


  const filenames = () => {
    const items = [];
    const detailsRow = [];

    for(let i=0;i<file.length;i ++) {
      console.log(typeList[i]);
      if(typeList[i]==='application/pdf') {
        items.push(displayPDF(i));
      }
      else {
        items.push(filename(i));
      }
      
    }

    for(let i=0;i<file.length;i ++) {
      detailsRow.push(detailsCell(i));
    }


    return ( <div className="flex">
    {image.map((i,index)=>{
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
  {image.map((image,i)=>{
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

  for(let i=0;i<file.length;i++) {
    formData.append(
      "image",
      file[i],
      file[i].name
    );
    file_names.push(file[i].name);
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
  
  axios.post(" https://sportzi-pancard.herokuapp.com/", formData).then(res => {
  if(res && res.data && res.data.output) {
    let output=res.data.output;
    let result_array=[];
    
    for(let i=0;i<file.length;i++) {
      result_array.push([file[i].name,output[i],output[i].status]);
    }
    // console.log(result_array);
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
 setFile([]);
 setImage([]);
  setResult(null);
  setNames([]);
  setDobs([]);
  setPans([]);
  setName("TEST");
  setPan("bbbbb11111");
  setDob(new Date('01 Jan 1970 00:00:00 GMT'));  
  return;
};

function getFormattedDate(today) {
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();
  if (dd < 10) {
      dd = '0' + dd;
  }
  if (mm < 10) {
      mm = '0' + mm;
  }
  return (dd + '/' + mm + '/' + yyyy);
}

function addDetails(e) {
  e.preventDefault();
 
  setNames([...names,name]);
  setPans([...pans,pan]);
  setDobs([...dobs,getFormattedDate(dob)]);
  setName("TEST");
  setPan("bbbbb11111");
  setDob(new Date('01 Jan 1970 00:00:00 GMT'));
}

  return (
    <div className="container">

      <h1 className="brand">Pan Card Verification demo</h1>
      <div class="flex main">
      <div class="wrapper animated bounceInLeft">
    <form>
    <h2>Upload the PAN Card JPG/Png file</h2>
      <label htmlFor="name">Name: </label>
      <input name="name" type="textbox" value={name} onChange={(e)=>setName(e.target.value)} />
     
      
      <br />
      
      <label htmlFor="DOB">Date of Birth: </label>
      <DateRangePicker
                   propsref="birthcalendar"
                   proptype="birth"
                   propsid="dobpicker"
                   showMonthDropdown={true}
                    showYearDropdown={true}
                    className="form-control"
                    selected={dob}
                    onChange={(val) => setDob(val)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
      />
      
      
      <br />
      
      <label htmlFor="name">PAN Account Number: </label>
      <input name="PAN Card" type="textbox" value={pan} onChange={(e)=>setPan(e.target.value)}/>
      
      
      <br />
      
      <label>
      Select image </label>
      <input name="files" type="file" onChange={handleChange} multiple />
      
      <br />
      
      <button onClick={addDetails} >
        Add the details
      </button>
    
      <button class="button" onClick={upload}>Upload and Verify</button>
      
        <br />
        <button class="button" onClick={reload}>Reload</button>
        
      </form>
      </div>
      {!result && file && file.length && 
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

export default UploadForm;