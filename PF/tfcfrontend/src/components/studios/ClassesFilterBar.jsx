import React from "react";
import "./ClassesFilterBar.css";
import Form from "react-bootstrap/Form";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";

const ClassesFilterBar = () => {
  return (
    <div className="classes-filter-bar-container">
        <Form className="classes-filter-bar-form-container">
            <Row>
                <Form.Group as={Col} className="classes-filter-bar-label-select-container">
                    <Form.Label className="classes-filter-bar-label">
                    Class Name
                    </Form.Label>
                    <Form.Select className="classes-filter-bar-select">

                    </Form.Select>
                </Form.Group>

                <Form.Group as={Col} className="classes-filter-bar-label-select-container">
                    <Form.Label className="classes-filter-bar-label">
                    Coach
                    </Form.Label>
                    <Form.Select className="classes-filter-bar-select">
                    </Form.Select>
                </Form.Group>
            </Row>
        </Form>
        <div className="classes-filter-bar-apply-filters-button-container">
            <Button variant="success" className="classes-filter-bar-apply-filters-button">
            Clear Filters
            </Button>
            <Button variant="success" className="classes-filter-bar-apply-filters-button">
            Apply Filters
            </Button>
        </div>
    </div>
  );
};

export default ClassesFilterBar;
