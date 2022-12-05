import React from "react";
import "./StudiosFilterBar.css";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const StudiosFilterBar = () => {
  return (
    <div className="studios-filter-bar-container">
      <Dropdown drop="down">
        <Dropdown.Toggle
          className="studios-filter-bar-dropdown-button"
          variant="success"
          id="dropdown-basic"
        >
          Filter Studios
        </Dropdown.Toggle>

        <Dropdown.Menu className="studios-filter-bar-dropdown-menu-container">
          <Form className="studios-filter-bar-form-container">
            <Form.Group className="studios-filter-bar-label-select-container">
              <Form.Label className="studios-filter-bar-label">
                Studio Name
              </Form.Label>
              <Form.Select className="studios-filter-bar-select">

              </Form.Select>
            </Form.Group>
            <Form.Group className="studios-filter-bar-label-select-container">
              <Form.Label className="studios-filter-bar-label">
                Class Name
              </Form.Label>
              <Form.Select className="studios-filter-bar-select">

              </Form.Select>
            </Form.Group>
            <Form.Group className="studios-filter-bar-label-select-container">
              <Form.Label className="studios-filter-bar-label">
                Amenity
              </Form.Label>
              <Form.Select className="studios-filter-bar-select">
              </Form.Select>
            </Form.Group>
            <Form.Group className="studios-filter-bar-label-select-container">
              <Form.Label className="studios-filter-bar-label">
                Coach
              </Form.Label>
              <Form.Select className="studios-filter-bar-select">
              </Form.Select>
            </Form.Group>
            <div className="studio-filter-bar-apply-filters-button-container">
              <Button variant="success" className="studio-filter-bar-apply-filters-button">
                Apply Filters
              </Button>
            </div>
          </Form>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default StudiosFilterBar;
