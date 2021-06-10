import React,{useEffect,useState} from 'react'; 
import XLSX from 'xlsx';
import { make_cols } from './MakeColumns';
import { SheetJSFT } from './types';

function ExcelReader(props) {
    const [file,setFile] = useState();
    const [data,setData] = useState([]);
    const [cols,setCols] = useState([]);
   
 
  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) 
    setFile(files[0]);

    console.log(e.target.files);
  };
 
  const handleFile=(file)=> {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
 
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA : true });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);
      /* Update state */
      setData(data);
      // 
      setCols(make_cols(ws['!ref']));
 
    };
 
    if (rABS) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    };
  }


  useEffect(()=>{
  
    if(file)
    handleFile(file);
  },[file]);

  useEffect(() => {
      // props.setExcelData(data);
    let excel_data={};  
    for(let i =0;i<data.length;i++) {
      excel_data[data[i]['IMAGE'].trim()] =  data[i];
    }
    console.log(excel_data);
    props.setExcelData(excel_data);
  }, [data]);


  
 
 
    return (
      <div>
        <label htmlFor="file">Upload Excel file</label>
        <br />
        <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={handleChange} />
        <br />
      </div>
      
    )

}
 
export default ExcelReader;