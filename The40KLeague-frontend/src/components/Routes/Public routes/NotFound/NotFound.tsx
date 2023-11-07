import React, { FC } from 'react';
import './notFound.css'

interface NotFoundProps {}

const NotFound: FC<NotFoundProps> = () => (
  <div className='notFound'>
    404 page not found
  </div>
);

export default NotFound;
