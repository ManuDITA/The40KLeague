import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import pageLogo from '/logo.avif'
import { Session } from '../../classes/Session';


interface NavBarProps { }

const NavBar: FC<NavBarProps> = () => {

  const [fetchedSessions, setFetchedSessions] = useState(['']);

  useEffect(() => {

    fetch(`https://q6ut75iqab.execute-api.eu-west-3.amazonaws.com/dev/season/nes1/sessions`)
      .then((res) => res.json()) // Parse the response as JSON
      .then((data) => {
        console.log(data); // Log the parsed JSON data
        setFetchedSessions(data); // Set the parsed data in your state or variable
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
          <Link className="dropbtn" to={"/season/nes1/sessions"}>NES1</Link>
          <div className="dropdown-content">
            {fetchedSessions.map((ses, index) => {
              return <Link to={"season/" + ses?.seasonID + "/session/" + ses?.sessionID}>{ses?.seasonID} {ses?.sessionID}</Link>
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
