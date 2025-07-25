import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Row,
} from "reactstrap";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
//Import Flatepicker
import Flatpickr from "react-flatpickr";
import Select from "react-select";
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import Dropzone from "react-dropzone";

//Import Images
import avatar3 from "@/assets/images/users/avatar-3.jpg";
import avatar4 from "@/assets/images/users/avatar-4.jpg";
import VerticalLayouts from "@/Layouts/VerticalLayouts";
import CategoryTree from "@/Components/Custom/CategoryTree";
import { Category } from "@/Components/Custom/category-types";
import {
  buildCategoryTree,
  MenuItem,
} from "@/Components/Custom/categoryTreeConverter";

// Simulated API data - In a real application, this would come from a fetch call
const API_DATA: Category[] = [
  {
    name: "anaesthetics, pre- & intra-operative medicines and medical gase",
    slug: "anaesthetics-pre-intra-operative-medicines-and-medical-gase",
    description: null,
    status: "active",
    id: 1,
    parent_id: null,
    created_at: "2025-07-15T16:16:47",
    updated_at: "2025-07-18T10:57:59",
    level: 1,
    children: [],
  },
  {
    name: "general anaesthetics",
    slug: "general-anaesthetics",
    description: null,
    status: "active",
    id: 2,
    parent_id: 1,
    created_at: "2025-07-18T10:12:02",
    updated_at: "2025-07-18T10:57:59",
    level: 2,
    children: [],
  },
  {
    name: "Inhalational medicines",
    slug: "inhalational-medicines",
    description: null,
    status: "active",
    id: 3,
    parent_id: 2,
    created_at: "2025-07-18T10:14:00",
    updated_at: "2025-07-18T10:14:00",
    level: 3,
    children: [],
  },
  {
    name: "injectable medicines",
    slug: "injectable-medicines",
    description: null,
    status: "active",
    id: 4,
    parent_id: 2,
    created_at: "2025-07-18T10:57:59",
    updated_at: "2025-07-18T11:56:49",
    level: 3,
    children: [],
  },
  {
    name: "Cardiovascular System",
    slug: "cardiovascular-system",
    description: null,
    status: "active",
    id: 5,
    parent_id: null,
    created_at: "2025-07-19T09:00:00",
    updated_at: "2025-07-19T09:00:00",
    level: 1,
    children: [],
  },
  {
    name: "Antihypertensives",
    slug: "antihypertensives",
    description: null,
    status: "active",
    id: 6,
    parent_id: 5,
    created_at: "2025-07-19T09:05:00",
    updated_at: "2025-07-19T09:05:00",
    level: 2,
    children: [],
  },
  {
    name: "Beta-blockers",
    slug: "beta-blockers",
    description: null,
    status: "active",
    id: 7,
    parent_id: 6,
    created_at: "2025-07-19T09:10:00",
    updated_at: "2025-07-19T09:10:00",
    level: 3,
    children: [],
  },
];

const CreateMedicine = () => {
  const [navData, setNavData] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to simulate fetching and processing category data
  const fetchCategoryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real application, you would fetch from an actual endpoint:
      // const response = await fetch("http://127.0.0.1:8000/medicines/categories/?skip=0&limit=100");
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      // const flatCategories: Category[] = await response.json();

      const flatCategories: Category[] = API_DATA; // Using simulated data for demonstration

      const treeData = buildCategoryTree(flatCategories);

      // Initialize stateVariables for all menu items for Collapse component
      const initializeCollapseState = (items: MenuItem[]): MenuItem[] => {
        return items.map((item) => ({
          ...item,
          stateVariables: false, // Default to closed
          subItems: item.subItems
            ? initializeCollapseState(item.subItems)
            : undefined,
        }));
      };

      setNavData(initializeCollapseState(treeData));
    } catch (err: any) {
      console.error("Failed to fetch categories:", err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

  // Function to handle menu item clicks to toggle collapse state
  const handleMenuItemClick = useCallback((itemId: number) => {
    setNavData((prevNavData) => {
      const toggleCollapse = (items: MenuItem[]): MenuItem[] => {
        return items.map((item) => {
          if (item.id === itemId) {
            return { ...item, stateVariables: !item.stateVariables };
          } else if (item.subItems && item.subItems.length > 0) {
            return { ...item, subItems: toggleCollapse(item.subItems) };
          }
          return item;
        });
      };
      return toggleCollapse(prevNavData);
    });
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading categories...</div>;
  }

  if (error) {
    return <div className="p-4 text-danger text-center">Error: {error}</div>;
  }

  const SingleOptions = [
    { value: "Watches", label: "Watches" },
    { value: "Headset", label: "Headset" },
    { value: "Sweatshirt", label: "Sweatshirt" },
    { value: "20% off", label: "20% off" },
    { value: "4 star", label: "4 star" },
  ];

  // const [selectedMulti, setselectedMulti] = useState<any>(null);

  // const handleMulti = (selectedMulti: any) => {
  //   setselectedMulti(selectedMulti);
  // };

  //Dropzone file upload
  // const [selectedFiles, setselectedFiles] = useState<any>([]);

  // const handleAcceptedFiles = (files: any) => {
  //   files.map((file: any) =>
  //     Object.assign(file, {
  //       preview: URL.createObjectURL(file),
  //       formattedSize: formatBytes(file.size),
  //     })
  //   );
  //   setselectedFiles(files);
  // };

  /**
   * Formats the size
   */
  const formatBytes = (bytes: any, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  document.title = "Create Project | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Create Project" pageTitle="Projects" />
          <Row>
            <Col lg={8}>
              <Card>
                <CardBody>
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="project-title-input">
                      Project Title
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="project-title-input"
                      placeholder="Enter project title"
                    />
                  </div>

                  <div className="mb-3">
                    <Label
                      className="form-label"
                      htmlFor="project-thumbnail-img"
                    >
                      Thumbnail Image
                    </Label>
                    <Input
                      className="form-control"
                      id="project-thumbnail-img"
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                    />
                  </div>

                  <div className="mb-3">
                    <Label className="form-label">Project Description</Label>
                    {/* <CKEditor
                                            editor={ClassicEditor}
                                            data="<p>Hello from CKEditor 5!</p>"
                                            onReady={(editor) => {
                                                // You can store the "editor" and use when it is needed.
                                                
                                            }}
                                            // onChange={(editor) => {
                                            //     editor.getData();
                                            // }}
                                            /> */}
                  </div>

                  <Row>
                    <Col lg={4}>
                      <div className="mb-3 mb-lg-0">
                        <Label
                          htmlFor="choices-priority-input"
                          className="form-label"
                        >
                          Priority
                        </Label>
                        <select
                          className="form-select"
                          data-choices
                          data-choices-search-false
                          id="choices-priority-input"
                        >
                          <option defaultValue="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="mb-3 mb-lg-0">
                        <Label
                          htmlFor="choices-status-input"
                          className="form-label"
                        >
                          Status
                        </Label>
                        <select
                          className="form-select"
                          data-choices
                          data-choices-search-false
                          id="choices-status-input"
                        >
                          <option defaultValue="Inprogress">Inprogress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div>
                        <Label
                          htmlFor="datepicker-deadline-input"
                          className="form-label"
                        >
                          Deadline
                        </Label>
                        <Flatpickr
                          className="form-control"
                          options={{
                            dateFormat: "d M, Y",
                          }}
                          placeholder="Enter due date"
                        />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Attached files</h5>
                </CardHeader>
                <CardBody>
                  <div>
                    <p className="text-muted">Add Attached files here.</p>

                    {/* <Dropzone
                      onDrop={(acceptedFiles) => {
                        handleAcceptedFiles(acceptedFiles);
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone dz-clickable">
                          <div
                            className="dz-message needsclick"
                            {...getRootProps()}
                          >
                            <div className="mb-3">
                              <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                            </div>
                            <h4>Drop files here or click to upload.</h4>
                          </div>
                        </div>
                      )}
                    </Dropzone> */}

                    {/* <ul className="list-unstyled mb-0" id="dropzone-preview">
                      {selectedFiles.map((f: any, i: any) => {
                        return (
                          <Card
                            className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                            key={i + "-file"}
                          >
                            <div className="p-2">
                              <Row className="align-items-center">
                                <Col className="col-auto">
                                  <img
                                    data-dz-thumbnail=""
                                    height="80"
                                    className="avatar-sm rounded bg-light"
                                    alt={f.name}
                                    src={f.preview}
                                  />
                                </Col>
                                <Col>
                                  <Link
                                    to="#"
                                    className="text-muted font-weight-bold"
                                  >
                                    {f.name}
                                  </Link>
                                  <p className="mb-0">
                                    <strong>{f.formattedSize}</strong>
                                  </p>
                                </Col>
                              </Row>
                            </div>
                          </Card>
                        );
                      })}
                    </ul> */}
                  </div>
                </CardBody>
              </Card>

              <div className="text-end mb-4">
                <button type="submit" className="btn btn-danger w-sm me-1">
                  Delete
                </button>
                <button type="submit" className="btn btn-secondary w-sm me-1">
                  Draft
                </button>
                <button type="submit" className="btn btn-success w-sm">
                  Create
                </button>
              </div>
            </Col>

            <Col lg={4}>
              <Card>
                <CardBody>
                  <CategoryTree
                    items={navData}
                    handleMenuItemClick={handleMenuItemClick}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CreateMedicine;
