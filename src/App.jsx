import { useState, useEffect } from "react";
import axios from "axios";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";
import Error from "./components/Error";
const fetchUsers = async (isMounted, setUsers) => {
   try {
      const response = await axios.get(
         "https://jsonplaceholder.typicode.com/users"
      );
      if (isMounted) {
         setUsers(response.data);
      }
   } catch (error) {
      console.error("Failed to fetch users:", error);
      return false;
   }
};
function App() {
   const [users, setUsers] = useState(undefined);

   useEffect(() => {
      let isMounted = true;

      fetchUsers(isMounted, setUsers);

      return () => {
         isMounted = false;
      };
   }, []);

   return (
      <>
         <main className="container mx-auto px-4">
            {users ? (
               <>
                  <AddUser setUsers={setUsers} />
                  <UserList users={users} setUsers={setUsers} />
               </>
            ) : users === null ? (
               <Error />
            ) : (
               <div className="fixed inset-0 z-20 flex items-center justify-center">
                  <span className="loading loading-spinner loading-lg" />
               </div>
            )}
         </main>
      </>
   );
}

export default App;
