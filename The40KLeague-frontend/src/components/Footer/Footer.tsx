import React, { FC } from 'react';
import './footer.css'

interface FooterProps { }

const Footer: FC<FooterProps> = () => (
  <div className='footer'>
    <div className='column'>
      <div>
        FAQs
      </div>
      <div>
        Sponsorship
      </div>
      <div>
        Contact Us
      </div>
      <div>
        Privacy Policy
      </div>
    </div>
    <div className='column'>
      Powered by our passion
    </div>
    <div className='column'>
      <div>
        Facebook
      </div>
      <div>
        Instagram
      </div>

    </div>
  </div>
);

export default Footer;
