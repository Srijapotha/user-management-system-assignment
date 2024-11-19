import Modal from "./Modal";
import axios from "axios";
async function addData(userData) {
   try {
      const transformedData = {
         name: `${userData.firstName} ${userData.lastName}`,
         email: userData.email,
         company: {
            catchPhrase: userData.department,
         },
      };

      const response = await axios.post(
         "https://jsonplaceholder.typicode.com/users",
         transformedData,
         {
            headers: {
               "Content-type": "application/json; charset=UTF-8",
            },
         }
      );

      return response.data;
   } catch (err) {
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
               setUsers((c) => [...c, data]);
            }}
         />
      </>
   );
}
