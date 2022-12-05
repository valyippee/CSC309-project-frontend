import React, { useState, useEffect } from "react";
import "./StudiosFilterBar.css";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { getFilterTagsForStudios } from "../../api/requests";

const StudiosFilterBar = () => {
  const [tags, setTags] = useState({});
  const [tagsLoaded, setTagsLoaded] = useState(false);

  useEffect(() => {
    getFilterTagsForStudios(setTags);
  }, []);

  useEffect(() => {
    if (Object.keys(tags).length !== 0) {
      setTagsLoaded(true);
    }
  }, [tags]);

  if (tagsLoaded) {
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
                  {tags.studio_names.map((studio_name) => (
                    <option>{studio_name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="studios-filter-bar-label-select-container">
                <Form.Label className="studios-filter-bar-label">
                  Class Name
                </Form.Label>
                <Form.Select className="studios-filter-bar-select">
                  {tags.class_names.map((class_name) => (
                    <option>{class_name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="studios-filter-bar-label-select-container">
                <Form.Label className="studios-filter-bar-label">
                  Amenity
                </Form.Label>
                <Form.Select className="studios-filter-bar-select">
                  {tags.amenities.map((amenity) => (
                    <option>{amenity}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="studios-filter-bar-label-select-container">
                <Form.Label className="studios-filter-bar-label">
                  Coach
                </Form.Label>
                <Form.Select className="studios-filter-bar-select">
                  {tags.coaches.map((coach) => (
                    <option>{coach}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <div className="studio-filter-bar-apply-filters-button-container">
                <Button
                  variant="success"
                  className="studio-filter-bar-apply-filters-button"
                >
                  Apply Filters
                </Button>
              </div>
            </Form>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  } else {
    return <></>;
  }
};

export default StudiosFilterBar;
