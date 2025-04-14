/*********************************************************************************
* BTI425 – Assignment 6
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Muhammad Hamid Ali Khalid Student ID: 166000232 Date: 2025-03-23
*
********************************************************************************/
import { Row, Col, Pagination, Card } from 'react-bootstrap';
import ArtworkCard from '../../components/ArtworkCard'; 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';
import useSWR from 'swr';

const PER_PAGE = 12;

export default function ArtworkPage() {
  const router = useRouter();
  const { q, title } = router.query;
  const [artworkList, setArtworkList] = useState(null);
  const [page, setPage] = useState(1);
  const [validObjectIDList, setValidObjectIDList] = useState([]); 

  const searchQuery = q || '';
  const titleFilter = title || '';
  const finalQuery = `q=${searchQuery}`;

  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`
  );
  console.log('Fetching data with query:', finalQuery); 
  console.log('SWR data:', data); 

  useEffect(() => {
    fetch('/data/validObjectIDList.json')
      .then((response) => response.json())
      .then((data) => setValidObjectIDList(data.objectIDs)) 
      .catch((error) => console.error('Error fetching the JSON file:', error));
  }, []);

  useEffect(() => {
    if (data && validObjectIDList.length > 0) {
      const filteredResults = validObjectIDList.filter((x) => data.objectIDs?.includes(x));

      const results = [];
      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }
      setArtworkList(results);
      setPage(1);
    }
  }, [data, validObjectIDList]);

  console.log('Rendering artworkList:', artworkList);

  if (error) return <Error statusCode={404} />;
  if (!artworkList) return <p>Loading...</p>;

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const nextPage = () => {
    if (page < artworkList.length) {
      setPage(page + 1);
    }
  };

  return (
    <div>
      <Row className="gy-4">
        {artworkList.length > 0 ? (
          artworkList[page - 1].map((objectID) => (
            <Col lg={3} key={objectID}>
              <ArtworkCard objectID={objectID} />
            </Col>
          ))
        ) : (
          <Card>
            <Card.Body>
              <h4>Nothing Here</h4>
              Try searching for something else.
            </Card.Body>
          </Card>
        )}
      </Row>

      {artworkList.length > 0 && (
        <Row>
          <Col>
            <Pagination>
              <Pagination.Prev onClick={previousPage} disabled={page <= 1} />
              <Pagination.Item>{page}</Pagination.Item>
              <Pagination.Next onClick={nextPage} disabled={page >= artworkList.length} />
            </Pagination>
          </Col>
        </Row>
      )}
    </div>
  );
}
