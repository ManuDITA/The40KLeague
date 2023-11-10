import React, { FC } from 'react';
import './home.css'


interface HomeProps { }



const Home: FC<HomeProps> = () => {

  return (
    <div>
      <div className='container'>
        <img src='/mountains.avif' className='mainImage' />
        <div className="imageCenteredMainText">LA LEAGUE SUISSE DE WARHAMMER</div>
        <div className="imageCenteredSecondaryText">Conçue par un joueur pour tous les joueurs, 100 % indépendante.</div>
      </div>  
    </div>
  )
}

export default Home;
