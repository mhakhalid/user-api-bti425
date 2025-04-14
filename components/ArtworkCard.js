import { useEffect, useState } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import useSWR from 'swr';
import Error from 'next/error';
import { useAtom } from 'jotai';
import { favouritesAtom } from '../../store'; 

export default function ArtworkCard({ objectID }) {
  const [isClient, setIsClient] = useState(false);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom); 
  const [isFavourited, setIsFavourited] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsFavourited(favouritesList.includes(objectID));
  }, [favouritesList, objectID]);

  const toggleFavourite = () => {
    if (isFavourited) {
      setFavouritesList(current => current.filter(id => id !== objectID));
    } else {
      setFavouritesList(current => [...current, objectID]);
    }
  };

  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
  );

  if (!isClient) return null;
  if (error) return <Error statusCode={404} />;
  if (!data) {
    return (
      <Card>
        <Card.Body className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Img
        variant="top"
        src={data.primaryImageSmall || 'https://placehold.co/375x375?text=Image+Not+Available'}
        alt={data.title || 'Artwork Image'}
      />
      <Card.Body>
        <Card.Title>{data.title || 'N/A'}</Card.Title>
        <Card.Text>
          {data.objectDate || 'Date not available'} |{" "}
          {data.classification || 'Classification not available'} |{" "}
          {data.medium || 'Medium not available'}
        </Card.Text>
        
        <div className="d-flex justify-content-between">
          <Link href={`/artwork/${objectID}`} passHref>
            <Button variant="primary">View Details</Button>
          </Link>

          <Button 
            variant={isFavourited ? "danger" : "outline-danger"} 
            onClick={toggleFavourite}
          >
            {isFavourited ? '♥ Remove' : '♡ Favourite'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
