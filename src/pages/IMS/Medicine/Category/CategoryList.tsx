import React, { useCallback, useEffect, useMemo, useState } from "react"; // Add useCallback
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

import BreadCrumb from "@/Components/Common/BreadCrumb";

import Loader from "@/Components/Common/Loader";
import TableContainer from "@/Components/Common/TableContainer";
import { useAppDispatch } from "@/hooks";
import type { CategoriesState, Category } from "@/interfaces/category";
import { getCategories as onGetCategories } from "@/slices/thunks";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createSelector } from "reselect";

// Define the RootState for useSelector
interface RootState {
  categories: CategoriesState;
}

// Utility function (not directly used in the final memoized logic, but good to keep)
// const isEmpty = (arr: any[] | null | undefined) => !arr || arr.length === 0;

const CategoryList = () => {
  const dispatch = useAppDispatch();
  const [modal, setModal] = useState<boolean>(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
      setTag([]);
      setAssignTag([]);
    }
  }, [modal]);

  const selectCategoriesState = (state: RootState) => state.categories;

  const categoryProperties = createSelector(selectCategoriesState, (state) => ({
    allCategoriesTree: state.list, // Renamed to allCategoriesTree to reflect nested structure
    status: state.status,
    error: state.error,
  }));

  const {
    allCategoriesTree, // Now holds the full nested tree of categories
    status,
    error,
  } = useSelector(categoryProperties);

  const [currentParentId, setCurrentParentId] = useState<number | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<
    { id: number; name: string }[] // Store ID and name for breadcrumbs
  >([]);

  // Helper function to recursively find a category by ID within the nested tree
  // Memoize this function to prevent unnecessary re-creations
  const findCategoryInTree = useCallback(
    (categories: Category[], id: number): Category | null => {
      for (const cat of categories) {
        if (cat.id === id) {
          return cat;
        }
        if (cat.children && cat.children.length > 0) {
          const found = findCategoryInTree(cat.children, id);
          if (found) {
            return found;
          }
        }
      }
      return null;
    },
    []
  ); // No dependencies for this simple recursive function

  const handleEditCategory = (category: Category) => {
    console.log("Edit category:", category);
  };

  const handleDeleteCategory = (id: number) => {
    console.log("Delete category ID:", id);
  };

  const handleViewSubcategories = (category: Category) => {
    // Pass the full category object
    setNavigationHistory((prev) => [
      ...prev,
      { id: category.id, name: category.name },
    ]);
    setCurrentParentId(category.id);
  };

  const handleGoBack = () => {
    if (navigationHistory.length > 0) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove the current parent from history

      const previousParentId =
        newHistory.length > 0 ? newHistory[newHistory.length - 1].id : null;

      setNavigationHistory(newHistory);
      setCurrentParentId(previousParentId);
    }
  };

  const formatDateTime = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Invalid Date";
    }
  };

  // Memoized categories to be displayed in the TableContainer
  const displayedCategories = useMemo(() => {
    if (!allCategoriesTree.length) {
      return [];
    }

    if (currentParentId === null) {
      // If no parent is selected, display the top-level categories
      return allCategoriesTree;
    } else {
      // Find the parent category within the nested tree
      const parentCategory = findCategoryInTree(
        allCategoriesTree,
        currentParentId
      );
      // If found, return its children; otherwise, return an empty array
      return parentCategory?.children || [];
    }
  }, [allCategoriesTree, currentParentId, findCategoryInTree]);

  const columns = useMemo(
    () => [
      {
        header: (
          <input
            type="checkbox"
            className="form-check-input"
            id="checkBoxAll"
            onClick={() => console.log("Check all")} // Implement checkedAll logic if needed
          />
        ),
        cell: (cell: any) => {
          return (
            <input
              type="checkbox"
              className="form-check-input leadsCheckBox"
              value={cell.getValue()}
              onChange={() => console.log("Individual checkbox changed")} // Implement deleteCheckbox logic if needed
            />
          );
        },
        id: "#",
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: true,
        cell: (cell: any) => (
          <div className="d-flex align-items-center">
            <div className="flex-grow-1 ms-2 fw-medium text-dark">
              {cell.getValue()}
            </div>
          </div>
        ),
      },
      // {
      //   header: "Slug",
      //   accessorKey: "slug",
      //   enableColumnFilter: true,
      // },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: true,
        cell: (cell: any) => {
          const status = cell.getValue() as Category["status"];
          const colorClass =
            status === "active"
              ? "bg-success-subtle text-success"
              : "text-bg-danger";
          return (
            <span className={`badge ${colorClass}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        },
      },
      {
        header: "Parent ID",
        accessorKey: "parent_id",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue() || "None",
      },
      {
        header: "Level",
        accessorKey: "level",
        enableColumnFilter: false,
      },
      {
        header: "Subcategories",
        accessorKey: "children", // Access children array directly
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps: { row: { original: Category } }) => {
          const category = cellProps.row.original;
          const childrenCount = category.children
            ? category.children.length
            : 0;
          if (childrenCount > 0) {
            return (
              <Button
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleViewSubcategories(category); // Pass the full category object
                }}
                color="secondary"
                className="rounded-pill"
              >
                {childrenCount} Subcategories
              </Button>
            );
          }
          return "0";
        },
      },
      {
        id: "actions",
        header: "Action",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps: any) => {
          const categoryData = cellProps.row.original as Category;
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item" title="View">
                <Link to="#" className="text-muted d-inline-block">
                  <i className="ri-eye-fill align-bottom fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Edit">
                <Link
                  className="edit-item-btn d-inline-block"
                  to="#"
                  onClick={() => handleEditCategory(categoryData)}
                >
                  <i className="ri-pencil-fill align-bottom text-muted fs-16"></i>{" "}
                </Link>
              </li>
              <li className="list-inline-item" title="Delete">
                <Link
                  className="remove-item-btn d-inline-block"
                  onClick={() => handleDeleteCategory(categoryData.id)}
                  to="#"
                >
                  <i className="ri-delete-bin-fill align-bottom text-muted fs-16"></i>{" "}
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [
      handleEditCategory,
      handleDeleteCategory,
      handleViewSubcategories, // Add this dependency
    ]
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(onGetCategories());
    }
  }, [dispatch, status]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Medicine Categories" pageTitle="IMS" />
          <Row>
            <Col lg={12}>
              <Card id="categoriesList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <Col sm={3}>
                      <div className="search-box">
                        <Input
                          type="text"
                          className="form-control search"
                          placeholder="Search for..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>
                    <div className="col-sm-auto ms-auto">
                      {navigationHistory.length > 0 && (
                        <Button
                          color="primary"
                          className="btn-sm"
                          onClick={handleGoBack}
                        >
                          <i className="ri-arrow-left-line align-bottom me-1"></i>{" "}
                          Go Back
                        </Button>
                      )}
                    </div>
                  </Row>
                </CardHeader>
                <CardBody className="pt-3">
                  <div>
                    {status === "loading" ? (
                      <Loader />
                    ) : error ? (
                      <Loader error={error} /> // Assuming Loader can display error
                    ) : (
                      <>
                        {displayedCategories &&
                        displayedCategories.length > 0 ? (
                          <TableContainer
                            columns={columns}
                            data={displayedCategories}
                            isGlobalFilter={false}
                            customPageSize={10}
                            divClass="table-responsive table-card"
                            tableClass="align-middle"
                            theadClass="table-light"
                            isLeadsFilter={false}
                          />
                        ) : (
                          <p className="text-center text-muted">
                            {currentParentId === null
                              ? "No top-level categories found."
                              : "No subcategories found for this parent."}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Lead" : "Add Lead"}
                    </ModalHeader>
                    <Form
                      className="tablelist-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <ModalBody>
                        <Input type="hidden" id="id-field" />
                        <Row className="g-3">
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="name-field"
                                className="form-label"
                              >
                                Name
                              </Label>
                              <Input
                                name="name"
                                id="customername-field"
                                className="form-control"
                                placeholder="Enter Name"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.name || ""}
                                invalid={
                                  validation.touched.name &&
                                  validation.errors.name
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.name &&
                              validation.errors.name ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.name}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="company_name-field"
                                className="form-label"
                              >
                                Company Name
                              </Label>
                              <Input
                                name="company"
                                id="company_name-field"
                                className="form-control"
                                placeholder="Enter Company Name"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.company || ""}
                                invalid={
                                  validation.touched.company &&
                                  validation.errors.company
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.company &&
                              validation.errors.company ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.company}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="leads_score-field"
                                className="form-label"
                              >
                                Leads Score
                              </Label>
                              <Input
                                name="score"
                                id="company_name-field"
                                className="form-control"
                                placeholder="Enter Score"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.score || ""}
                                invalid={
                                  validation.touched.score &&
                                  validation.errors.score
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.score &&
                              validation.errors.score ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.score}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="phone-field"
                                className="form-label"
                              >
                                Phone
                              </Label>
                              <Input
                                name="phone"
                                id="phone-field"
                                className="form-control"
                                placeholder="Enter Phone Number"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.phone || ""}
                                invalid={
                                  validation.touched.phone &&
                                  validation.errors.phone
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.phone &&
                              validation.errors.phone ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.phone}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="location-field"
                                className="form-label"
                              >
                                Location
                              </Label>
                              <Input
                                name="location"
                                id="location-field"
                                className="form-control"
                                placeholder="Enter Location"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.location || ""}
                                invalid={
                                  validation.touched.location &&
                                  validation.errors.location
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.location &&
                              validation.errors.location ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.location}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="taginput-choices"
                                className="form-label"
                              >
                                Tags
                              </Label>

                              <Select
                                isMulti
                                value={tag}
                                onChange={(e: any) => {
                                  handlestag(e);
                                }}
                                className="mb-0"
                                options={tags}
                                id="taginput-choices"
                                defaultValue={validation.values.tags || ""}
                              ></Select>

                              {validation.touched.tags &&
                              validation.errors.tags ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.tags}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => {
                              setModal(false);
                            }}
                          >
                            {" "}
                            Close{" "}
                          </button>
                          <button
                            type="submit"
                            className="btn btn-success"
                            id="add-btn"
                          >
                            {" "}
                            {!!isEdit ? "Update" : "Add Lead"}{" "}
                          </button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CategoryList;
