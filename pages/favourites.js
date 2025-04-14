import { useAtom } from 'jotai';
import { Row, Col, Card } from 'react-bootstrap';
import { favouritesAtom } from '../../store'; 
import ArtworkCard from '../components/ArtworkCard'; 

export default function Favourites() {
  const [favouritesList] = useAtom(favouritesAtom); 
  if (!favouritesList) return null;


  return (
    <div>
      <h1>Your Favourite Artworks</h1>
      
      {}
      {favouritesList.length > 0 ? (
        <Row className="gy-4">
          {favouritesList.map((objectID) => (
            <Col lg={3} key={objectID}>
              <ArtworkCard objectID={objectID} /> {}
            </Col>
          ))}
        </Row>
      ) : (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            Try adding some new artwork to the list.
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
