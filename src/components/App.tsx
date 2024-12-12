import { React, useState } from 'react';
import Sidebar from './sidebar.tsx';
import { FaDiceD20 } from 'react-icons/fa6';

export enum Pages
{
  Empty,
  EncounterCreator,
}

function renderPage(page : Pages)
{
  switch (page) {
    case Pages.EncounterCreator:
      
      break;
  
    default:
      return (<div style={{width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center"}}><h1>Welcome to the DM App!</h1></div>)
  }
}

function App() {

  const [openPage, setOpenPage] = useState(Pages.Empty)

  return (
    <div className="App">
      <FaDiceD20 />
      <Sidebar startOpen={false} setOpenPage={setOpenPage}/>
      {renderPage(openPage)}
    </div>
  );
}

export default App;
