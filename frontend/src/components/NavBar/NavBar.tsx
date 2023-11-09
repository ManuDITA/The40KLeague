import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import pageLogo from '/logo.avif'


interface NavBarProps { }

const NavBar: FC<NavBarProps> = () => {

  const [availableSessions, setAvailableSessions] = useState(['/seasons/nes1/session1', '/seasons/nes1/session2']);

  useEffect(() => {

    fetch(`http://localhost:3000/getSessions`)
      .then((res) => res.json()) // Parse the response as JSON
      .then((data) => {
        console.log(data); // Log the parsed JSON data
        setAvailableSessions([...data]); // Set the parsed data in your state or variable
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }, [])

  return (
    <div className="topnav">
      <div className="left-block">
        <Link to="/">
          <img src={pageLogo} alt="Logo" className="logo"></img>
        </Link>
      </div>
      <div className="right-block">
        <div className="dropdown">
          <button className="dropbtn">NES1</button>
          <div className="dropdown-content">
            {availableSessions.map((session, index) => {
              return <Link to={session}>NES1 session-{index + 1}</Link>
            })}
          </div>
        </div>

        <div className="dropdown">
          <button className="dropbtn">Match</button>
          <div className="dropdown-content">
            <a href="#">NES1 session</a>
            <a href="#">Link 2</a>
            <a href="#">Link 3</a>
          </div>
        </div>

        <div className="dropdown">
          <button className="dropbtn">Actualités</button>
          <div className="dropdown-content">
            <a href="#">NES1 session</a>
            <a href="#">Link 2</a>
            <a href="#">Link 3</a>
          </div>
        </div>

        <div className="dropdown">
          <button className="dropbtn">Qui sommes-nous</button>
          <div className="dropdown-content">
            <a href="#">Série</a>
            <a href="#">Partenaires</a>
            <a href="#">Social Responsability</a>
            <a href="#">Contactez-nous</a>
          </div>
        </div>

        <div className="dropdown">
          <button href="/loginsignup" className="dropbtn">Register</button>
        </div>


        <div className="dropdown">
          <button href="/loginsignup" className="dropbtn">Login</button>
        </div>

      </div>
    </div>
  );
}

export default NavBar;
