import { useRouter } from 'next/router';
import useSWR from 'swr';
import Error from 'next/error';
import { Card, Row, Col, Spinner, Button } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { favouritesAtom } from '../../../store'; 
import { useEffect, useState } from 'react';

const fetchArtworkDetails = (objectID) => {
  return fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`)
    .then((res) => res.json())
    .catch((err) => console.error('Error fetching artwork details:', err));
};

export default function ArtworkDetailPage() {
  const router = useRouter();
  const { objectid } = router.query;

  const { data, error } = useSWR(objectid ? objectid : null, fetchArtworkDetails);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [isFavourited, setIsFavourited] = useState(false);

  useEffect(() => {
    if (objectid && favouritesList) {
      setIsFavourited(favouritesList.includes(parseInt(objectid)));
    }
  }, [favouritesList, objectid]);

  const toggleFavourite = () => {
    const id = parseInt(objectid);
    if (isFavourited) {
      setFavouritesList((current) => current.filter((favID) => favID !== id));
    } else {
      setFavouritesList((current) => [...current, id]);
    }
  };

  if (error) return <Error statusCode={404} />;
  if (!data) {
    return (
      <Row className="justify-content-center">
        <Col>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Col>
      </Row>
    );
  }

  return (
    <div>
      <Card>
        <Card.Header>{data.title}</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <img
                src={data.primaryImage}
                alt={data.title}
                className="img-fluid"
              />
            </Col>
            <Col md={6}>
              <h5>Details</h5>
              <p><strong>Date:</strong> {data.objectDate}</p>
              <p><strong>Classification:</strong> {data.classification}</p>
              <p><strong>Medium:</strong> {data.medium}</p>
              <p><strong>Dimensions:</strong> {data.dimensions}</p>

              {/* Favourite Toggle Button */}
              <Button
                variant={isFavourited ? 'danger' : 'outline-danger'}
                onClick={toggleFavourite}
                className="mt-3"
              >
                {isFavourited ? '♥ Remove from Favourites' : '♡ Add to Favourites'}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}
