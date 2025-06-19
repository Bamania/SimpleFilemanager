export interface Folder {
    id: string;
    name: string;
    fullPath: string;
   parentPath:string;
}

export interface SidebarProps {
    handleFolderid: (id: string) => void;
    handleFolderpath: (path: string) => void;
}
export interface folderDocument {
    fileName: string
    filePath: string
}