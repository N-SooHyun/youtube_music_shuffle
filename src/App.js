import logo from './logo.svg';
import React, { useState, useEffect, useRef } from "react";
import NoApiIframe from './components/NoApiIframe';
import ApiIframe from './components/ApiIframe';
import YouTubePlayer from './components/YouTubePlayer';
import TestPlayer from './components/TestPlayer';
import DragNDrop from './components/DragNDrop';
import TestSample from './components/TestSample';
import './App.css';

function App() {  
  const [file, setFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [jsonData, setJsonData] = useState(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleProcess = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const parsedData = JSON.parse(e.target.result);

        const isValid = validateJsonFormat(parsedData);

        if(isValid){
          setJsonData(parsedData);
          alert('파일이 정상적으로 업로드되었습니다!');
          setIsFileUploaded(true);
        }else{
          alert('잘못된 형식의 JSON파일입니다.');
        }
      };
      reader.readAsText(file);
    } else {
      alert('파일을 선택해 주세요!');
    }
  };

  const validateJsonFormat = (data) => {
    if(!Array.isArray(data)){
      return false; //배열이 아님
    }

    for(const item of data){
      //필수 키
      if(!item.ID || !item.URL || !item.Title || !item.Thumbnail){
        console.log("필수키가 없습니다.");
        return false;
      }

      if (typeof item.ID !== 'string' || isNaN(item.ID)) {
        console.log("ID가 없습니다.");
        return false; 
      }
  
      if (typeof item.URL !== 'string' || !isValidUrl(item.URL)) {
        console.log("URL이 없습니다.");
        return false;  
      }
  
      if (typeof item.Title !== 'string' || item.Title.trim() === '') {
        console.log("제목이 없습니다.");
        return false;  
      }
  
      if (typeof item.Thumbnail !== 'string' || !isValidUrl(item.Thumbnail)) {
        console.log("썸네일이 없습니다.");
        return false;  
      }
    }
    return true;
  };

  const isValidUrl = (url) => {
    try{
      new URL(url);
      return true;
    }catch(e){
      return false;
    }
  }

  return(
    <div>
      {!isFileUploaded ? (<>
      <div  className="container">
    <h1>유튜브 재생목록 셔플 정상화</h1>
    <p>
      이 프로그램을 사용하여 유튜브 재생목록의 셔플을 정상화할 수 있습니다. 아래에 JSON 파일을
      업로드하여 기능을 실행해 보세요.<br/><br/>
      &#123;  json형식  &#125; <br/>
  <table>
  <tr>
    <td colspan="2" class="merged-cell">[&#123;</td>
  </tr>
  
  <tr>
    <td>"ID" :</td>
    <td>"0",</td>
  </tr>
  <tr>
    <td>"URL" :</td>
    <td>"https://example.com/link1",</td>
  </tr>
  <tr>
    <td>"Title" :</td>
    <td>"Title 1",</td>
  </tr>
  <tr>
    <td>"Thumbnail" :</td>
    <td>"https://example.com/image1.jpg"</td>
  </tr>
  
  <tr>
    <td colspan="2" class="merged-cell">&#125;, &#123;&#125;, &#123;&#125;]</td>
  </tr>
</table>
    </p>
    <div className="file-upload">
      <label htmlFor="json-upload">JSON 파일 업로드:</label>
      <input
        type="file"
        id="json-upload"
        accept=".json"
        onChange={handleFileChange}
      />
    </div>
    <button className="process-btn" onClick={handleProcess}>
      파일 처리 시작
    </button>
      </div>
      
      </>):(<DragNDrop jsonData={jsonData}/>
    )}
    
  </div>
  );
}

export default App;