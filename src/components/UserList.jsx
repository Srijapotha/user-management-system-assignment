import { useState } from "react";

import axios from "axios";
import Modal from "./Modal";

const removeUser = async (id) => {
   try {
      // Send a DELETE request to remove the user by ID
      const response = await axios.delete(
         `https://jsonplaceholder.typicode.com/users/${id}`
      );
      // Return a success response without error
      return { error: null };
   } catch (error) {
      // Return the error if the request fails
      return { error: error };
   }
};

const updateUser = async (id, userData) => {
   try {
      // Prepare user data in the required format for the API
      const bodyData = {
         name: `${userData.firstName} ${userData.lastName}`,
         email: userData.email,
         company: {
            catchPhrase: userData.department,
         },
      };

      // Send a PUT request to update the user data by ID
      const response = await axios.put(
         `https://jsonplaceholder.typicode.com/users/${id}`,
         bodyData,
         {
            headers: {
               "Content-type": "application/json; charset=UTF-8", // Set the request content type to JSON
            },
         }
      );

      // Return the updated user data on success
      return response.data;
   } catch (error) {
      // Log and return null on error
      console.error("Error updating user:", error);
      return null;
   }
};

export default function UserList({ users, setUsers }) {
   const [selectedId, setSelectedId] = useState(null); // Stores the ID of the selected user
   const [deletingUser, setDeletingUser] = useState({
      // Tracks the deletion status and error
      status: false,
      err: "",
   });
   const deleteUser = async (e) => {
      if (!selectedId) return;
      setDeletingUser((c) => ({ ...c, status: true }));
      // make api call to remove user
      const { error } = await removeUser(selectedId);
      if (error) {
         setDeletingUser({
            status: false,
            err: error,
         });
         return;
      }

      // removing user from list
      setUsers((c) => c.filter((user) => user.id !== selectedId));
      setDeletingUser({
         status: false,
         err: "",
      });
      // automatically close modal
      document.getElementById("delete-modal-close").click();
   };
   return (
      <>
         <div className="overflow-x-auto w-full">
            <table className="table">
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>First Name</th>
                     <th>Last Name</th>
                     <th>Email</th>
                     <th>Department</th>
                     <th>Action</th>
                  </tr>
               </thead>
               <tbody>
                  {users.map(({ id, name, email, company }) => {
                     const [firstName, lastName] = name.split(" ");
                     return (
                        <tr key={id}>
                           <th>{id}</th>
                           <td>{firstName}</td>
                           <td>{lastName}</td>
                           <td>{email}</td>
                           <td>{company.catchPhrase}</td>
                           <td className="flex gap-2">
                              <label
                                 htmlFor="edit-modal"
                                 className="btn btn-active btn-neutral btn-sm"
                                 onClick={() => setSelectedId(id)}
                              >
                                 Edit
                              </label>
                              <label
                                 htmlFor="delete-modal"
                                 onClick={() => setSelectedId(id)}
                                 className="btn btn-error btn-sm"
                              >
                                 Delete
                              </label>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
         <input type="checkbox" id="delete-modal" className="modal-toggle" />
         <div className="modal" role="dialog">
            <div className="modal-box">
               <h3 className="text-lg font-bold">Delete User</h3>
               <p className="py-4">
                  Are you sure you want to delete user with id {selectedId}?
               </p>
               <div>
                  {deletingUser.err ? (
                     <p className="text-error">
                        Something went wrong, Please check your internet!
                     </p>
                  ) : (
                     ""
                  )}
               </div>
               <div className="modal-action">
                  <label
                     id="delete-modal-close"
                     htmlFor="delete-modal"
                     className="btn"
                  >
                     Close
                  </label>
                  <button
                     onClick={deleteUser}
                     className="btn btn-error"
                     disabled={deletingUser.status}
                  >
                     {deletingUser.status ? "Deleting..." : "Delete User"}
                  </button>
               </div>
            </div>
         </div>
         <Modal
            id="edit-modal"
            heading={"Edit User"}
            description={"Edit details here."}
            apiFunction={async (data) => {
               return await updateUser(selectedId, data);
            }}
            onSuccess={(data) => {
               // Update the user list
               setUsers((c) =>
                  c.map((user) => (user.id === selectedId ? data : user))
               );
            }}
            defaultValue={
               // Pre-filled data for editing an existing user
               selectedId ? users.find((user) => user.id === selectedId) : {}
            }
         />
      </>
   );
}
