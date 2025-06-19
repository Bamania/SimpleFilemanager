import { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import axios from "axios";
import type { folderDocument } from "./globaltypes";

function App() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [file, setFile] = useState<File | null>(null);
  const [folderPath, setFolderPath] = useState<string>("");
 
  const [folderId, setFolderId] = useState<string | null>(null);
  
  const [documents, setDocuments] = useState<Array<folderDocument>>([]);
  
  const handleUpload = async () => {
    console.log("handleUpload  clicked");
    
    if (file && folderPath) {
     
      const formData = new FormData();

      
      formData.append("parentPath", folderPath); 
      formData.append("file", file);           
     
      try {
        const response = await axios.post(
          `${apiUrl}/documents`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data) {
          alert("Upload successful");
          fetchFolderdocuments(); //refetchjng the docs so that you dont have to refresh the page
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };


const fetchFolderdocuments=async()=>{
  if (!folderId || !folderPath) {
    setDocuments([]);
    return;
  }
  const response=await axios.get(`${apiUrl}/folders/${folderId}/${folderPath}/documents`)
  console.log("response",response.data)
  setDocuments(response.data|| []);

}
useEffect(()=>{
  fetchFolderdocuments()
},[folderId])
  

const openDocumentcontent=async(filepath:string)=>{
  const encodedFilepath = encodeURIComponent(filepath);

  
  const response=await axios.get(`${apiUrl}/documents/${encodedFilepath}`,{responseType:'blob'})
  console.log("response",response.data)
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const a = document.createElement('a');
  a.href = url;
  a.download = filepath;
  a.click();
  window.URL.revokeObjectURL(url);
}

  return (  
    <div className="flex min-h-screen bg-gray-50">
     
      <Sidebar  handleFolderid={setFolderId} handleFolderpath={setFolderPath}/>
      {/* Main Content: Documents in Folder */}
      <main className="flex-1 flex flex-col items-center justify-start p-10">
     
        <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Upload Document for this folder {folderId}</h3>
       
          <input
            type="text"
            value={folderPath}
            onChange={(e) => setFolderPath(e.target.value)}
            placeholder={folderPath || "Enter folder path"}
            className="block w-full text-gray-700 border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-gray-700 border border-gray-300 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleUpload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors">
            Upload
          </button>
        </div>

        
        {/* List of Documents in Folder */}
        <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Documents</h3>
          <ul className="divide-y divide-gray-100">
            {documents.length === 0 ? (
              <li className="py-3 text-gray-400 italic">No documents found for this folder.</li>
            ) : (
              documents.map((doc, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-4 px-2 hover:bg-blue-50 rounded transition"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{doc.fileName}</span>
                    <span className="text-xs text-blue-600 mt-1">{doc.filePath}</span>
                  </div>
                  <button
                    onClick={() => openDocumentcontent(doc.filePath)}
                    className="flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                    title="Download"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                      />
                    </svg>
                    Download
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="w-full max-w-xl flex justify-end mt-4">
      <button
        onClick={() => window.open('https://www.tldraw.com/f/8xINRuZ6KQennZs-A6eH1?d=v-1074.3266.4399.2264.f1PeytGz4sTa-2335mLpu', '_blank')}
        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 7h6m0 0v6m0-6L10 19M5 19h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
     Small Props Flow
      </button>
    </div>
      </main>
    
     
    </div>
  );
}

export default App;
