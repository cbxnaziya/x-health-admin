
// import {
//   Card,
//   CardHeader,
//   CardBody,
//   Typography,
//   Dialog,
//   DialogHeader,
//   DialogBody,
//   DialogFooter,
//   Button,
//   Input,
// } from "@material-tailwind/react";
// import { useEffect, useState } from "react";
// import { fetchHandler } from "@/utils/Api";
// import { GET_ALL_USERS, UPDATE_USER, DELETE_USER } from "@/utils/Endpoint";
// import toast from "react-hot-toast";
// import { useLoader } from "@/context/LoaderContext";
// import { formatTimestamp } from "@/utils/Functions";

// export function Tables() {
//   const { setLoader } = useLoader();
//   const [users, setUsers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState(""); // State for search query
//   const [open, setOpen] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   // Fetch users data
//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const response = await fetchHandler(GET_ALL_USERS, "", true, setLoader, "GET");
//         setUsers(response?.data?.users || []);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };
//     getData();
//   }, []);

//   // Filter users based on search query
//   const filteredUsers = users.filter((user) =>
//     `${user.name} ${user.email} ${user.phone}`
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase())
//   );

//   const handleEdit = (user) => {
//     setSelectedUser(user);
//     setOpen(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { name, email, phone } = selectedUser;
//       const response = await fetchHandler(
//         UPDATE_USER,
//         { id: selectedUser._id, name, email, phone },
//         true,
//         setLoader,
//         "PUT"
//       );
//       toast.success(response.data.message);
//       setOpen(false);
//       setUsers((prev) =>
//         prev.map((user) => (user._id === selectedUser._id ? selectedUser : user))
//       );
//     } catch (error) {
//       console.error("Error updating user:", error);
//       toast.error("Failed to update user. Please try again.");
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSelectedUser((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleDelete = async () => {
//     try {
//       const response = await fetchHandler(
//         DELETE_USER,
//         { user_id: selectedUser._id },
//         true,
//         setLoader,
//         "DELETE"
//       );
//       toast.success(response.data.message);
//       setUsers((prev) => prev.filter((user) => user._id !== selectedUser._id));
//       setOpenDelete(false);
//     } catch (error) {
//       console.error("Error deleting user:", error);
//       toast.error("Failed to delete user. Please try again.");
//     }
//   };

//   const confirmDelete = (userId) => {
//     setSelectedUser({ _id: userId });
//     setOpenDelete(true);
//   };

//   return (
//     <div className="mt-12 mb-8 flex flex-col gap-12">
//       <Card>
//         <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
//           <div className="flex flex-col md:flex-row justify-between item-center">

//           <Typography variant="h6" color="white">
//             Users Table
//           </Typography>
//           <div className="flex items-center gap-2">
//       <Typography variant="body2" color="white">
//         Search:
//       </Typography>
//       <Input
//         type="text"
//         placeholder="Search"
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         className="text-white" // Make input text white
//         style={{ backgroundColor: "#1f2937" }} // Optional: change background to dark for contrast
//       />
//     </div>
//               </div>
//         </CardHeader>
//         <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
//           <table className="w-full min-w-[640px] table-auto">
//             <thead>
//               <tr>
//                 {["ID", "User", "Phone", "Started", "Actions"].map((el) => (
//                   <th
//                     key={el}
//                     className="border-b border-blue-gray-50 py-3 px-5 text-left"
//                   >
//                     <Typography
//                       variant="small"
//                       className="text-[11px] font-bold uppercase text-blue-gray-400"
//                     >
//                       {el}
//                     </Typography>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map(({ _id, name, email, phone, createdAt }) => (
//                 <tr key={_id}>
//                   <td className="py-3 px-5">{_id}</td>
//                   <td className="py-3 px-5">
//                     <div className="flex items-center gap-4">
//                       <div>
//                         <Typography className="font-semibold">{name}</Typography>
//                         <Typography className="text-xs text-blue-gray-500">
//                           {email}
//                         </Typography>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-3 px-5">{phone}</td>
//                   <td className="py-3 px-5">{formatTimestamp(createdAt)}</td>
//                   <td className="py-3 px-5 flex gap-2">
//                     <Button
//                       size="sm"
//                       onClick={() =>
//                         handleEdit({ _id, name, email, phone, createdAt })
//                       }
//                     >
//                       Edit
//                     </Button>
//                     <Button size="sm" color="red" onClick={() => confirmDelete(_id)}>
//                       Delete
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </CardBody>
//       </Card>

//            {/* Popup for editing user */}
//        <Dialog open={open} handler={setOpen}>
//          <DialogHeader>Edit User</DialogHeader>
//          <form onSubmit={handleSubmit}>
//            <DialogBody>
//              <div className="flex flex-col gap-4">
//                <Input
//                  label="Name"
//                  name="name"
//                  value={selectedUser?.name || ""}
//                  onChange={handleChange}
//                  required
//                />
//                <Input
//                  label="Email"
//                  name="email"
//                  value={selectedUser?.email || ""}
//                  onChange={handleChange}
//                  required
//                />
//                <Input
//                  label="Phone"
//                  name="phone"
//                  value={selectedUser?.phone || ""}
//                  onChange={handleChange}
//                  required
//                />
//              </div>
//            </DialogBody>
//            <DialogFooter>
//              <Button variant="text" onClick={() => setOpen(false)}>
//                Cancel
//              </Button>
//              <Button type="submit" variant="gradient">
//                Save
//              </Button>
//            </DialogFooter>
//          </form>
//        </Dialog>




//        {/* Delete Confirmation Popup */}
//        <Dialog open={openDelete} handler={setOpenDelete}>
//         <DialogHeader>Confirm Deletion</DialogHeader>
//         <DialogBody>
//           Are you sure you want to delete this user? This action cannot be undone.
//         </DialogBody>
//         <DialogFooter>
//           <Button variant="text" onClick={() => setOpenDelete(false)}>
//             Cancel
//           </Button>
//           <Button color="red" onClick={handleDelete}>
//             Delete
//           </Button>
//         </DialogFooter>
//       </Dialog>
//     </div>
//   );
// }

// export default Tables;

import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { fetchHandler } from "@/utils/Api";
import { GET_ALL_USERS, UPDATE_USER, DELETE_USER } from "@/utils/Endpoint";
import toast from "react-hot-toast";
import { useLoader } from "@/context/LoaderContext";
import { formatTimestamp } from "@/utils/Functions";

export function Tables() {
  const { setLoader } = useLoader();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Adjust this to change the number of users per page

  // Fetch users data
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchHandler(GET_ALL_USERS, "", true, setLoader, "GET");
        setUsers(response?.data?.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getData();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email} ${user.phone} ${user._id}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Get current users for the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, email, phone } = selectedUser;
      const response = await fetchHandler(
        UPDATE_USER,
        { id: selectedUser._id, name, email, phone },
        true,
        setLoader,
        "PUT"
      );
      toast.success(response.data.message);
      setOpen(false);
      setUsers((prev) =>
        prev.map((user) => (user._id === selectedUser._id ? selectedUser : user))
      );
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    try {
      const response = await fetchHandler(
        DELETE_USER,
        { user_id: selectedUser._id },
        true,
        setLoader,
        "DELETE"
      );
      toast.success(response.data.message);
      setUsers((prev) => prev.filter((user) => user._id !== selectedUser._id));
      setOpenDelete(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  const confirmDelete = (userId) => {
    setSelectedUser({ _id: userId });
    setOpenDelete(true);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex flex-col md:flex-row justify-between item-center">
            <Typography variant="h6" color="white">
              Users Table
            </Typography>
            <div className="flex items-center gap-2">
              <Typography variant="body2" color="white">
                Search:
              </Typography>
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-white"
                style={{ backgroundColor: "#1f2937" }}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["ID", "User", "Phone", "Started", "Actions"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map(({ _id, name, email, phone, createdAt }) => (
                  <tr key={_id}>
                    <td className="py-3 px-5">{_id}</td>
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-4">
                        <div>
                          <Typography className="font-semibold">{name}</Typography>
                          <Typography className="text-xs text-blue-gray-500">
                            {email}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5">{phone}</td>
                    <td className="py-3 px-5">{formatTimestamp(createdAt)}</td>
                    <td className="py-3 px-5 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleEdit({ _id, name, email, phone, createdAt })
                        }
                      >
                        Edit
                      </Button>
                      <Button size="sm" color="red" onClick={() => confirmDelete(_id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-3 px-5 text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => paginate(currentPage - 1)}
        >
          Prev
        </Button>
        <Typography variant="body2">{`Page ${currentPage}`}</Typography>
        <Button
          disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
          onClick={() => paginate(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      {/* Popup for editing user */}
      <Dialog open={open} handler={setOpen}>
        <DialogHeader>Edit User</DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <div className="flex flex-col gap-4">
              <Input
                label="Name"
                name="name"
                value={selectedUser?.name || ""}
                onChange={handleChange}
                required
              />
              <Input
                label="Email"
                name="email"
                value={selectedUser?.email || ""}
                onChange={handleChange}
                required
              />
              <Input
                label="Phone"
                name="phone"
                value={selectedUser?.phone || ""}
                onChange={handleChange}
                required
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="text" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              Save
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Delete Confirmation Popup */}
      <Dialog open={openDelete} handler={setOpenDelete}>
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody>
          Are you sure you want to delete this user? This action cannot be undone.
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setOpenDelete(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Tables;
