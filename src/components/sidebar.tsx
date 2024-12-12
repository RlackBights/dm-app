import { React, useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { Pages } from './App.tsx'

export default function Sidebar({startOpen, setOpenPage} : {startOpen: boolean, setOpenPage: Function})
{
    const [isOpen, setIsOpen] = useState(startOpen)
    const pages = {}

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
                
            </div>
        </div>
    )
}