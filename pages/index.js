/*********************************************************************************
* BTI425 – Assignment 6
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Muhammad Hamid Ali Khalid Student ID: 166000232 
*
********************************************************************************/
import { Container, Row, Col, Image } from 'react-bootstrap';
import Layout from '../components/Layout'; 

export default function Home() {
  return (
    <Layout>
      <Container>
        <Row>
          <Col lg={12} className="text-center">
            <Image
              src="/museum.jpg" 
              alt="Metropolitan Museum of Art"
              fluid
              className="mb-4" 
            />
          </Col>
        </Row>
        <Row className="text-row">
          <Col lg={8}>
            <h1 className="text-header">Welcome to the Artwork Search</h1>
            <p className="text-body">
              The Metropolitan Museum of Art, located in New York City, is one of the largest and most prestigious art museums in the world. It was founded in 1870 and is renowned for its vast collection of artworks spanning over 5,000 years of human history. The museum is located along the eastern edge of Central Park, and its main building is often referred to as "The Met."
            </p>
            <p className="text-body">
              The Metropolitan Museum of Art was founded in 1870 with its mission to bring art and art education to the American people. The museum's permanent collection consists of works of art from classical antiquity and ancient Egypt, paintings, and sculptures from nearly all the European masters, and an extensive collection of American and modern art. The Met maintains extensive holdings of African, Asian, Oceanian, Byzantine, and Islamic art. The museum is home to encyclopedic collections of musical instruments, costumes, and accessories, as well as antique weapons and armor from around the world. Several notable interiors, ranging from 1st-century Rome through modern American design, are installed in its galleries.
            </p>
            <p className="text-body">
              Learn more about the museum on its <a href="https://en.wikipedia.org/wiki/Metropolitan_Museum_of_Art" target="_blank" rel="noreferrer">Wikipedia page</a>.
            </p>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
