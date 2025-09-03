// import React, { useMemo } from 'react';
// import { ColumnDef } from '@tanstack/react-table';

// // Define the Category interface
// export interface Category {
//   id: number;
//   name: string;
//   slug: string;
//   description: string | null;
//   status: "active" | "inactive";
//   parent_id: number | null;
//   created_at: string;
//   updated_at: string;
//   level: number;
//   children: Category[];
// }

// // Dummy Link component for demonstration if react-router-dom is not available
// // In a real application, you would import Link from 'react-router-dom'
// const Link = ({ to, children, className, onClick }: any) => (
//   <a href={to} className={className} onClick={onClick}>{children}</a>
// );

// // Helper function for date formatting
// const formatDateTime = (dateString: string | null): string => {
//   if (!dateString) return 'N/A';
//   try {
//     return new Date(dateString).toLocaleString();
//   } catch {
//     return 'Invalid Date';
//   }
// };

// // Define the columns using useMemo
// // This function will be called in your component to get the columns array
// export const getCategoryColumns = (
//   checkedAll: () => void,
//   deleteCheckbox: () => void,
//   onEdit: (category: Category) => void, // Uncommented this line
//   onDelete: (id: number) => void // Uncommented this line
// ): ColumnDef<Category>[] => {
//   return useMemo(
//     () => [
//       {
//         header: (
//           <input
//             type="checkbox"
//             className="form-check-input" // Bootstrap 5 class
//             id="checkBoxAll"
//             onClick={checkedAll}
//           />
//         ),
//         cell: (cell: any) => {
//           return (
//             <input
//               type="checkbox"
//               className="form-check-input leadsCheckBox" // Bootstrap 5 class
//               value={cell.getValue()} // This should be the category ID
//               onChange={deleteCheckbox} // This function should handle individual checkbox state
//             />
//           );
//         },
//         id: '#', // Unique ID for this column
//         enableSorting: false,
//         enableColumnFilter: false,
//       },
//       {
//         header: "Name",
//         accessorKey: "name",
//         enableColumnFilter: true, // Enable filter for name
//         cell: (cell: any) => (
//           <div className="d-flex align-items-center"> {/* Bootstrap 5 class */}
//             <div className="flex-grow-1 ms-2 fw-medium text-dark"> {/* Bootstrap 5 equivalent */}
//               {cell.getValue()}
//             </div>
//           </div>
//         ),
//       },
//       {
//         header: "Slug",
//         accessorKey: "slug",
//         enableColumnFilter: true,
//       },
//       {
//         header: "Status",
//         accessorKey: "status",
//         enableColumnFilter: true,
//         cell: (cell: any) => {
//           const status = cell.getValue() as Category['status'];
//           const colorClass = status === 'active' ? 'text-bg-success' : 'text-bg-danger'; // Bootstrap 5 badge colors
//           return (
//             <span className={`badge rounded-pill ${colorClass}`}> {/* Bootstrap 5 badge classes */}
//               {status.charAt(0).toUpperCase() + status.slice(1)}
//             </span>
//           );
//         },
//       },
//       {
//         header: "Parent ID",
//         accessorKey: "parent_id",
//         enableColumnFilter: false,
//         cell: (cell: any) => cell.getValue() || 'None',
//       },
//       {
//         header: "Level",
//         accessorKey: "level",
//         enableColumnFilter: false,
//       },
//       {
//         header: "Created At",
//         accessorKey: "created_at",
//         enableColumnFilter: false,
//         cell: (cell: any) => formatDateTime(cell.getValue() as string),
//       },
//       {
//         header: "Updated At",
//         accessorKey: "updated_at",
//         enableColumnFilter: false,
//         cell: (cell: any) => formatDateTime(cell.getValue() as string),
//       },
//       {
//         header: "Subcategories",
//         accessorKey: "children",
//         enableColumnFilter: false,
//         enableSorting: false,
//         cell: (cell: any) => {
//           const children = cell.getValue() as Category[];
//           return children && children.length > 0 ? children.length : '0';
//         },
//       },
//       {
//         id: "actions", // Unique ID for the actions column
//         header: "Action",
//         enableColumnFilter: false,
//         enableSorting: false,
//         cell: (cellProps: any) => {
//           const categoryData = cellProps.row.original as Category;
//           return (
//             <ul className="list-inline hstack gap-2 mb-0"> {/* Bootstrap 5 classes */}
//               <li className="list-inline-item" title="View"> {/* Bootstrap 5 class */}
//                 <Link to="#" className="text-muted d-inline-block"> {/* Bootstrap 5 text-muted and d-inline-block */}
//                   <i className="ri-eye-fill align-bottom fs-16"></i> {/* Bootstrap 5 fs-16 */}
//                 </Link>
//               </li>
//               <li className="list-inline-item" title="Edit">
//                 <Link
//                   className="edit-item-btn d-inline-block" // Bootstrap 5 d-inline-block
//                   to="#"
//                   onClick={() => onEdit(categoryData)}
//                 >
//                   <i className="ri-pencil-fill align-bottom text-muted fs-16"></i> {/* Bootstrap 5 text-muted and fs-16 */}
//                 </Link>
//               </li>
//               <li className="list-inline-item" title="Delete">
//                 <Link
//                   className="remove-item-btn d-inline-block" // Bootstrap 5 d-inline-block
//                   onClick={() => onDelete(categoryData.id)}
//                   to="#"
//                 >
//                   <i className="ri-delete-bin-fill align-bottom text-muted fs-16"></i> {/* Bootstrap 5 text-muted and fs-16 */}
//                 </Link>
//               </li>
//             </ul>
//           );
//         },
//       },
//     ],
//     [checkedAll, deleteCheckbox, onEdit, onDelete] // Dependencies for useMemo
//   );
// };
