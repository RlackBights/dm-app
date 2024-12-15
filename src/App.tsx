import { useState } from 'react';
import Sidebar from './components/sidebar';
import { FaCog } from 'react-icons/fa';
import EncounterCreator from './pages/encounterCreator';
import CharacterTracker from './pages/characterTracker';
import { initDB } from 'react-indexed-db-hook';
import { DBConfig } from './resources/DBConfig';
import WelcomePage from './pages/welcomePage';

export enum Pages
{
  Home,
  EncounterCreator,
  CharacterTracker,
}

function renderPage(page : Pages)
{
  switch (page) {
    case Pages.EncounterCreator:
      return <EncounterCreator/>
    case Pages.CharacterTracker:
      return <CharacterTracker />
    case Pages.Home:
      return <WelcomePage />
  }
}

initDB(DBConfig)
sessionStorage.setItem("openOverlay", "false");

function App() {

  const [openPage, setOpenPage] = useState(Pages.Home)

  return (
    <div className="App">
      <FaCog />
      <Sidebar startOpen={false} setOpenPage={setOpenPage}/>
      {renderPage(openPage)}
    </div>
  );
}

export default App;
