import axios from "axios";
import React, { useEffect, useState } from "react";
import type { Folder, SidebarProps } from "../globaltypes";

const Sidebar: React.FC<SidebarProps>  = ({handleFolderid,handleFolderpath}) => {
  const [foldername, setFoldername] = useState<string>("");
  const [folders,setFolders] = useState<Array<Folder>>([]);
  const apiUrl = import.meta.env.VITE_API_URL;


  useEffect( () => {
     getFolders()
  }, []);

  async function getFolders(){
    const response = await axios.get(`${apiUrl}/folders`);
    setFolders(response.data.data)

  }

  const handleCreateFolder = async () => {
    if (!foldername.trim()) return;
    const response = await axios.post(`${apiUrl}/folders`, {
      name: foldername,
    });
 
    if (response.data) {
      setFoldername("");
      setFolders(prev => [...prev, response.data.folder]);
    }
  };

  const handleFolderClick = (id: string,path:string) => {
    handleFolderid(id)
    handleFolderpath(path)

  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-blue-600 via-blue-500 to-blue-400 shadow-2xl flex flex-col p-6 border-r border-blue-700 z-40 font-sans">
      <h2 className="text-2xl font-extrabold tracking-tight text-white mb-6 drop-shadow">
        Folders
      </h2>
      <div className="flex items-center mb-8">
        <input
          type="text"
          value={foldername}
          onChange={(e) => setFoldername(e.target.value)}
          placeholder="New folder name"
          className="border-none rounded-l-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-white bg-white/90 text-blue-900 placeholder-blue-400 shadow-inner"
        />
        <button
          onClick={handleCreateFolder}
          className="bg-white hover:bg-blue-200 text-blue-700 rounded-r-lg p-2 transition-colors shadow-md border-l border-blue-200"
          title="Create Folder"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
      <hr className="border-blue-300 mb-4 opacity-40" />
  
      <ul className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
        {folders.map((item ) => (
          <li
            key={item.id}
            onClick={()=>handleFolderClick(item.id,item.parentPath)}
            className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-50 cursor-pointer transition group"
          >
            {item.name} 
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
