import React, { FC } from 'react';
import './home.css'


interface HomeProps { }



const Home: FC<HomeProps> = () => {

  function getData() {
    console.log('getting data')
    fetch(`http://localhost:3000/`)
      .then((res) => res.text())
      .then(text => console.log(text))
  }



  return (
    <div>
      <div className='container'>
        <img src='/mountains.avif' className='mainImage' />
        <div className="imageCenteredMainText">LA LEAGUE SUISSE DE WARHAMMER</div>
        <div className="imageCenteredSecondaryText">Conçue par un joueur pour tous les joueurs, 100 % indépendante.</div>
      </div>

      <button onClick={() => getData()}>ASD</button>

      
    </div>
  )
}

export default Home;
