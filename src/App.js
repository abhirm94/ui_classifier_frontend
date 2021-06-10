import React,{useEffect,useState} from 'react';
import Title from './comps/Title';
import UploadForm from './comps/UploadForm';
import ExcelContainer from './comps/ExcelContainer';
import ImageContainer from './comps/ImageContainer';
import ExcelPage from './comps/ExcelPage';

// import './App.css';
import './Test.css';
// import ImageGrid from './comps/ImageGrid';
// import Modal from './comps/Modal';

function App() {
  const [excelData,setExcelData] = useState();
  const [images,setImages] = useState([]);
  const [files,setFiles] = useState([]);
  
  const [names,setNames]=useState([]);
  const [pans,setPans]=useState([]);
  const [dobs,setDobs]=useState([]);

  const [route,setRoute]=useState("single");

  


  
  
  return (
    <div className="App">
        <nav>
          <button onClick={()=>{setRoute("batch")}}> Upload from Excel data </button>
          <button onClick={()=>{setRoute("single")}}>Upload from Form </button>
        </nav>
        {route ==="single" && <UploadForm />} 
      
 
        {route==="batch" && <ExcelPage />}
 

    </div>
  );
}

export default App;