import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import ProductCatalog from './ProductCatalog';
import CartDrawer from '../common/CartDrawer';
import backgroundImage from '../../assets/images/Farm Sharing background.jpg';

const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const cartRef = useRef<HTMLButtonElement>(null);
  
  console.log('🔄 CatalogPage: Rendering');

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
      }}
    >
      <div className="content-wrapper">
        <Header 
          onProfileClick={() => navigate('/welcome')} 
          showOnWelcome={false}
          cartRef={cartRef}
        />
        <div style={{ paddingTop: '64px' }}> {/* Отступ для фиксированного хэдера */}
          <ProductCatalog cartRef={cartRef} />
        </div>
        <CartDrawer />
      </div>
    </div>
  );
};

export default CatalogPage; 