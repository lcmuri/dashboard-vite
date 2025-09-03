import { createAsyncThunk } from "@reduxjs/toolkit";
import "react-toastify/dist/ReactToastify.css";

// Include Both Helper File with needed methods
import { getCategoryTree as getCategoryTreeApi } from "@/helpers/backend_helper";
import type { Category } from "@/interfaces/category";

// export const getCategories = createAsyncThunk("ims/getCategories", async () => {
//   try {
//     const response = getCategoriesApi();
//     return response;
//   } catch (error) {
//     return error;
//   }
// });

// Async Thunks for API calls
// createAsyncThunk automatically handles pending, fulfilled, and rejected states.
export const getCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("ims/getCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await getCategoryTreeApi();

    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// export const getCategoryTree = createAsyncThunk(
//   "ims/getCategoryTree",
//   async () => {
//     try {
//       const response = await getCategoryTreeApi();
//       return response;
//     } catch (error) {
//       return error;
//     }
//   }
// );

// export const addNewCompanies = createAsyncThunk("crm/addNewCompanies" , async (companies:any) => {
//   try{
//     const response = addNewCompaniesApi(companies)
//     toast.success("Company Added Successfully", { autoClose: 3000 });
//     return response;
//   }catch (error) {
//     toast.error("Company Added Failed", { autoClose: 3000 });
//     return error;
//   }
// })

// export const updateCompanies = createAsyncThunk("crm/updateCompanies" , async (companies:any) => {
//   try{
//     const response = updateCompaniesApi(companies)
//     toast.success("Company Updated Successfully", { autoClose: 3000 });
//     return response;
//   }catch (error) {
//     toast.error("Company Updated Failed", { autoClose: 3000 });
//     return error;
//   }
// })

// export const deleteCompanies = createAsyncThunk("crm/deleteCompanies" , async (companies:any) => {
//   try{
//     const response = deleteCompaniesApi(companies)
//     toast.success("Company Deleted Successfully", { autoClose: 3000 });
//     return { companies, ...response };
//   }catch (error) {
//     toast.error("Company Deleted Failed", { autoClose: 3000 });
//     return error;
//   }
// })
