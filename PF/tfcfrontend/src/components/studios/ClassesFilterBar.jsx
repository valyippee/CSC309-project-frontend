import React from "react";
import "./ClassesFilterBar.css";
import Form from "react-bootstrap/Form";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";
import TimeRangeSlider from 'react-time-range-slider';

const ClassesFilterBar = (props) => {
  return (
    <>
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
            <div className="classes-filter-time">
                <span>Time Range</span>
                <div className="classes-filter-time-range-selector">
                    <TimeRangeSlider 
                        format={24}
                        maxValue={"22:00"}
                        minValue={"08:00"}
                        name={"time_range"}
                        onChangeComplete={props.changeCompleteHandler}
                        onChange={(time) => props.timeChangeHandler(time)}
                        step={15}
                        value={props.timeRangeValue}
                    />
                    <div className="classes-filter-time-range-labels">
                        <span>Start: {props.timeRangeValue.start}</span>
                        <span>End: {props.timeRangeValue.end}</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="classes-filter-bar-reset-filters-button-container">
            <Button className="classes-filter-bar-reset-filters-button">
            Reset Filters
            </Button>
        </div>
    </>
  );
};

export default ClassesFilterBar;
