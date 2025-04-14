import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import { addToHistory } from "@/lib/userData";

export default function AdvancedSearch() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  if (!searchHistory) return null;


  const submitForm = async (data) => {
    let queryString = `searchBy=${data.searchBy}`;

    if (data.geoLocation) queryString += `&geoLocation=${data.geoLocation}`;
    if (data.medium) queryString += `&medium=${data.medium}`;
    if (data.isOnView) queryString += `&isOnView=true`;
    if (data.isHighlight) queryString += `&isHighlight=true`;
    if (data.q) queryString += `&q=${data.q}`;
    

    setSearchHistory(await addToHistory(queryString));
    router.push(`/artwork?${queryString}`);
  };

  return (
    <Form onSubmit={handleSubmit(submitForm)}>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Search Query</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter keywords"
              {...register("q", { required: true })}
              className={errors.q ? "is-invalid" : ""}
            />
            {errors.q && <div className="invalid-feedback">This field is required.</div>}
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Label>Search By</Form.Label>
          <Form.Select {...register("searchBy")} className="mb-3">
            <option value="title">Title</option>
            <option value="tags">Tags</option>
            <option value="artistOrCulture">Artist or Culture</option>
          </Form.Select>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Geo Location</Form.Label>
            <Form.Control type="text" placeholder="Enter location" {...register("geoLocation")} />
            <Form.Text className="text-muted">
              Case Sensitive String (e.g., &quot;Europe&quot;, &quot;France&quot;, &quot;Paris&quot;, &quot;China&quot;, &quot;New York&quot;), with multiple values separated by the | operator
            </Form.Text>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Medium</Form.Label>
            <Form.Control type="text" placeholder="Enter medium" {...register("medium")} />
            <Form.Text className="text-muted">
              Case Sensitive String (e.g., &quot;Ceramics&quot;, &quot;Furniture&quot;, &quot;Paintings&quot;, &quot;Sculpture&quot;, &quot;Textiles&quot;), with multiple values separated by the | operator
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Check type="checkbox" label="Highlighted" {...register("isHighlight")} />
          <Form.Check type="checkbox" label="Currently on View" {...register("isOnView")} />
        </Col>
      </Row>

      <Row>
        <Col>
          <br />
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
