import React, { useState, useEffect, useRef } from "react";
import "./StudiosFilterBar.css";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { getFilterTagsForStudios } from "../../api/requests";

const StudiosFilterBar = ({ setSelectedFilterTags }) => {
  const [tags, setTags] = useState({});
  const [tagsLoaded, setTagsLoaded] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const studioNameRef = useRef();
  const classNameRef = useRef();
  const amenityRef = useRef();
  const coachRef = useRef();

  useEffect(() => {
    getFilterTagsForStudios(setTags);
  }, []);

  useEffect(() => {
    if (Object.keys(tags).length !== 0) {
      setTagsLoaded(true);
    }
  }, [tags]);

  const handleApplyFilterButtonClick = (e) => {
    if (
      studioNameRef.current.value !== "" ||
      classNameRef.current.value !== "" ||
      amenityRef.current.value !== "" ||
      coachRef.current.value !== ""
    ) {
      setFiltersApplied(true);
    }

    const selectedTags = {
      studio_name: studioNameRef.current.value === "" ? null : studioNameRef.current.value,
      class_name: classNameRef.current.value === "" ? null : classNameRef.current.value,
      amenity: amenityRef.current.value === "" ? null : amenityRef.current.value,
      coach: coachRef.current.value === "" ? null : coachRef.current.value,
    };

    setSelectedFilterTags(selectedTags);
  };

  const handleClearFiltersButtonClick = (e) => {
    studioNameRef.current.value = "";
    classNameRef.current.value = "";
    amenityRef.current.value = "";
    coachRef.current.value = "";

    const selectedTags = {};

    setFiltersApplied(false);
    setSelectedFilterTags(selectedTags);
  };

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
                <Form.Select
                  className="studios-filter-bar-select"
                  ref={studioNameRef}
                >
                  {tags.studio_names.map((studio_name) => (
                    <option>{studio_name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="studios-filter-bar-label-select-container">
                <Form.Label className="studios-filter-bar-label">
                  Class Name
                </Form.Label>
                <Form.Select
                  className="studios-filter-bar-select"
                  ref={classNameRef}
                >
                  {tags.class_names.map((class_name) => (
                    <option>{class_name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="studios-filter-bar-label-select-container">
                <Form.Label className="studios-filter-bar-label">
                  Amenity
                </Form.Label>
                <Form.Select
                  className="studios-filter-bar-select"
                  ref={amenityRef}
                >
                  {tags.amenities.map((amenity) => (
                    <option>{amenity}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="studios-filter-bar-label-select-container">
                <Form.Label className="studios-filter-bar-label">
                  Coach
                </Form.Label>
                <Form.Select
                  className="studios-filter-bar-select"
                  ref={coachRef}
                >
                  {tags.coaches.map((coach) => (
                    <option>{coach}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <div className="studio-filter-bar-apply-filters-button-container">
                <Button
                  variant="success"
                  className="studio-filter-bar-apply-filters-button"
                  onClick={(e) => handleApplyFilterButtonClick(e)}
                >
                  Apply Filters
                </Button>
                {filtersApplied && (
                  <Button
                    variant="danger"
                    className="studio-filter-bar-clear-filters-button"
                    onClick={(e) => handleClearFiltersButtonClick(e)}
                  >
                    Clear Filters
                  </Button>
                )}
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
