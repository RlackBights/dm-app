import { useEffect, useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { Pages } from './App';

function separateNames(name: String)
{
    return name.match(/[A-Z][a-z]+/g)?.join(' ')
}

export default function Sidebar({startOpen, setOpenPage} : {startOpen: boolean, setOpenPage: Function})
{
    const [isOpen, setIsOpen] = useState(startOpen)

    const handleKeypress = (e: KeyboardEvent) => {
        switch (e.key) {
            case "Tab":
              e.preventDefault();
              setIsOpen(curr => !curr);
              break;
          
            default:
              break;
          }
    }

    useEffect(() => {
      window.addEventListener('keydown', handleKeypress);

      return () => {
        window.removeEventListener('keydown', handleKeypress);
      };
    }, [])

    return (
        <div id="sidebar-container" style={{height: isOpen ? "100vh" : "8vh", marginLeft: isOpen ? "0" : "-16.5vw"}}>
            <div id="sidebar-header" onClick={() =>{
                    setIsOpen(curr => !curr);
                }}>
                <p>Menu</p>
                <div>
                    <GiHamburgerMenu />
                </div>
            </div>
            <div id="sidebar-content">
                {Object.keys(Pages).filter(key => isNaN(Number(key)) && key != "Empty").map((key: any) => (
                    <div key={key} onClick={() => {
                        setOpenPage(Pages[key])
                    }}>
                        <p>{separateNames(key)}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}