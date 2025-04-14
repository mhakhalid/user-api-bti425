import { useEffect, useState } from 'react';
import MainNav from './MainNav'; 
import { Container } from 'react-bootstrap';

export default function Layout({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); 
  }, []);

  
  if (!isClient) {
    return null; 
  }

  return (
    <>
      <MainNav />
      <br />
      <Container>{children}</Container>
      <br />
    </>
  );
}
