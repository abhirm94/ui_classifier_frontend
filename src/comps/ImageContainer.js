import React,{useEffect,useState} from 'react';

export default function ImageContainer(props) {
    
    const types = ['image/png', 'image/jpeg','application/pdf'];
    const [files,setFiles] = useState([]);
    // useEffect(()=>{
    //     console.log(images);
    // },[images]);

    const handleChange = (e) => {
        let selectedarray = e.target.files;
        let temp_images=[];
        let temp_files=[];
        for(let i=0;i<e.target.files.length;i++) {
          
          let selected=selectedarray[i];
          if (selected && types.includes(selected.type)) {
             temp_files.push(e.target.files[i]);
          }
        }

        setFiles(temp_files);
        props.setFiles(temp_files);
      };

    return (
        <div>
             <input name="files" type="file" onChange={handleChange} multiple />
        </div>
    )
}
