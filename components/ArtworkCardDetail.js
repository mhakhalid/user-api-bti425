import { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import useSWR from 'swr';
import Error from 'next/error';
import { useAtom } from 'jotai';
import { favouritesAtom } from '../../store';

export default function ArtworkCardDetail({ objectID }) {
  const [isClient, setIsClient] = useState(false);
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  const { data, error } = useSWR(
    objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (objectID) {
      setShowAdded(favouritesList.includes(objectID));
    }
  }, [favouritesList, objectID]);

  const favouritesClicked = () => {
    if (showAdded) {
      setFavouritesList(current => current.filter(fav => fav !== objectID));
    } else {
      setFavouritesList(current => [...current, objectID]);
    }
    setShowAdded(!showAdded);
  };

  // If still server-side rendering or data not ready
  if (!isClient || !data) return null;
  if (error) return <Error statusCode={404} />;

  return (
    <Card>
      {data.primaryImage && <Card.Img variant="top" src={data.primaryImage} />}
      <Card.Body>
        <Card.Title>{data.title || 'N/A'}</Card.Title>
        <Card.Text>
          {data.objectDate || 'N/A'} | {data.medium || 'N/A'}
        </Card.Text>
        <br />
        <Card.Text>
          {data.artistDisplayName || 'N/A'} | {data.creditLine || 'N/A'}
        </Card.Text>
        <Card.Text>{data.dimensions || 'N/A'}</Card.Text>

        {/* Favourite Button */}
        <Button
          variant={showAdded ? 'primary' : 'outline-primary'}
          onClick={favouritesClicked}
          className="me-2"
        >
          {showAdded ? '+ Favourite (added)' : '+ Favourite'}
        </Button>

        {/* Wiki link */}
        {data.artistWikidata_URL && (
          <a
            href={data.artistWikidata_URL}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-secondary"
          >
            Wiki
          </a>
        )}
      </Card.Body>
    </Card>
  );
}
