import Modal from "./Modal";
import axios from "axios";
async function addData(userData) {
   try {
      // Transform the input data into the format required by the API
      const transformedData = {
         name: `${userData.firstName} ${userData.lastName}`,
         email: userData.email,
         company: {
            catchPhrase: userData.department,
         },
      };

      // Make an API POST request to add the transformed data
      const response = await axios.post(
         "https://jsonplaceholder.typicode.com/users",
         transformedData,
         {
            headers: {
               "Content-type": "application/json; charset=UTF-8",
            },
         }
      );

      // Return the API response data
      return response.data;
   } catch (err) {
      // Log any errors during the API call
      console.error("API Error:", err);
      return null;
   }
}

export default function AddUser({ setUsers }) {
   return (
      <>
         <div className="flex items-center justify-between py-6">
            <h1 className="text-2xl text-white font-medium">User List</h1>
            <label htmlFor="my_modal_6" className="btn btn-success">
               Add User
            </label>
         </div>
         <Modal
            id="my_modal_6"
            heading={"Add User"}
            description={"Add details here."}
            apiFunction={addData}
            onSuccess={(data) => {
               // Update the user list
               setUsers((c) => [...c, data]);
            }}
         />
      </>
   );
}
