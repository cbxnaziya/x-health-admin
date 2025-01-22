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
import { GET_ALL_USERS, UPDATE_USER, DELETE_USER, GET_ALL_CATEGORIES, UPDATE_CATEGORIES, REMOVE_CATEGORIES, ADD_CATEGORIES } from "@/utils/Endpoint";
import toast from "react-hot-toast";
import { useLoader } from "@/context/LoaderContext";
import { formatTimestamp } from "@/utils/Functions";

export function Categories() {
  const { setLoader } = useLoader();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openAdd, setOpenAdd] = useState(false); 
   const [newCategory, setNewCategory] = useState({
    name: "",
    status: "active", // Default status
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10); // Default 10 items per page
  

  // Fetch users data
  const getData = async () => {
    try {
      const response = await fetchHandler(GET_ALL_CATEGORIES, "", false, setLoader, "GET");
      console.log("res", response.data);
      
      setUsers(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const filteredUsers = users.filter((user) =>
    `${user?.name} ${user?.email} ${user?.phone} ${user?._id} ${user?.status}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase().trim())
  );
  
  // Adjust current page if the filtered list is smaller
  useEffect(() => {
    if (currentPage > Math.ceil(filteredUsers.length / usersPerPage)) {
      setCurrentPage(1);
    }
  }, [filteredUsers.length, currentPage, usersPerPage]);
  
  // Paginate filtered users
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
      const { name, status } = selectedUser;
      const response = await fetchHandler(
        UPDATE_CATEGORIES,
        { id: selectedUser._id, status,name },
        true,
        setLoader,
        "PUT"
      );
      toast.success(response.data.message);
      setUsers((prev) =>
        prev.map((user) => (user._id === selectedUser._id ? selectedUser : user))
      );
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    } finally {
      setOpen(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    try {
  
      
      const response = await fetchHandler(
        REMOVE_CATEGORIES,
        { category_id: selectedUser._id },
        true,
        setLoader,
        "DELETE"
      );
      toast.success(response.data.message);
      setUsers((prev) => prev.filter((user) => user._id !== selectedUser._id));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    } finally {
      setOpenDelete(false);
    }
  };

  const confirmDelete = (userId) => {
    setSelectedUser({ _id: userId });
    setOpenDelete(true);
  };

  // const handleAddCategory = async () => {
  //   try {
  //     const response = await fetchHandler(ADD_CATEGORIES, newCategory, true, setLoader, "POST");
  //     toast.success(response.data.message);
  //     setUsers((prev) => [...prev, response.data.data]); // Add new category to the list
  //     setOpenAdd(false); // Close the dialog
  //   } catch (error) {
  //     console.error("Error adding category:", error);
  //     toast.error("Failed to add category. Please try again.");
  //   }
  // };

  const handleAddCategory = async () => {
    try {
      setLoader(true); // Show loader while API call is in progress
      const response = await fetchHandler(ADD_CATEGORIES, newCategory, true, setLoader, "POST");

  toast.success(response?.data?.message);
  if (response?.data?.status) {
    setNewCategory({   
      name: "",
      status: "active", })
    getData();
    // setUsers((prev) => [...prev, response.data]);
  } 

    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category. Please try again.");
    } finally {
      setOpenAdd(false); // Close the dialog
      setLoader(false); // Hide loader after API call is complete
    }
  };
  
  const handleAddCategoryInput = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };
  
  

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
      <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
  <div className="flex flex-col md:flex-row justify-between items-center">
    <Typography variant="h6" color="white">
      Categories Table
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
      {/* Add Category Button */}
      <Button
        size="sm"
        color="green"
        className="ml-4"
        onClick={() => setOpenAdd(true)} 
      >
       + Add Category
      </Button>
    </div>
  </div>
</CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Category ID", "Name", "Status", "Created", "Actions"].map((el) => (
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
              {currentUsers?.length > 0 ? (
                currentUsers?.map(({ _id, name, status, phone, createdAt }) => (
                  <tr key={_id}>
                    <td className="py-3 px-5">{_id}</td>
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-4">
                        <div>
                          <Typography className="font-semibold">{name}</Typography>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5">{status}</td>
                    <td className="py-3 px-5">{formatTimestamp(createdAt)}</td>
                    <td className="py-3 px-5 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleEdit({ _id, name, phone, status, createdAt })
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

      <div className="flex justify-between items-center gap-4 mt-4">
  {/* Users per page dropdown */}
  <div className="flex items-center">
    <Typography variant="body2" color="gray">
      Users per page:
    </Typography>
    <select
      value={usersPerPage}
      onChange={(e) => setUsersPerPage(Number(e.target.value))}
      className="ml-2 p-2 border border-gray-300 rounded bg-gray-800 text-white"
    >
      {[10,  20, 30].map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>

  {/* Pagination information and buttons */}
  <div className="flex items-center gap-4">
    {/* Display the dynamic "show X of Y" */}
    <Typography variant="body2" color="gray">
      {`Showing ${indexOfFirstUser + 1}–${Math.min(indexOfLastUser, filteredUsers.length)} of ${filteredUsers.length}`}
    </Typography>

    {/* Pagination navigation buttons */}
    <div className="flex items-center gap-2">
      <Button
        disabled={currentPage === 1}
        onClick={() => paginate(currentPage - 1)}
      >
        Prev
      </Button>
      <Typography variant="body2" color="gray">{`Page ${currentPage}`}</Typography>
      <Button
        disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
        onClick={() => paginate(currentPage + 1)}

      >
        Next
      </Button>
    </div>
  </div>
</div>


 {/* Add Category Dialog */}
 <Dialog open={openAdd} handler={setOpenAdd}>
        <DialogHeader>Add New Category</DialogHeader>
        <form onSubmit={(e) => e.preventDefault()}>
          <DialogBody>
            <div className="flex flex-col gap-4">
              <Input
                label="Category Name"
                name="name"
                value={newCategory.name}
                onChange={handleAddCategoryInput}
                required
              />
              <div className="relative">
                <label className="text-sm font-semibold">Status</label>
                <select
                  name="status"
                  value={newCategory.status}
                  onChange={handleAddCategoryInput}
                  className="w-full p-2 border border-gray-300 rounded bg-white"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="text" onClick={() => setOpenAdd(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" onClick={handleAddCategory}>
              Add Category
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

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
                 {/* Dropdown for status */}
      <div className="relative">
        <label className="text-sm font-semibold">Status</label>
        <select
          name="status"
          value={selectedUser?.status || ""}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded bg-white"
          required
        >
          <option value="" disabled>
            Select Status
          </option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

              {/* <Input
                label="Status"
                name="status"
                value={selectedUser?.email || ""}
                onChange={handleChange}
                required
              /> */}
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

export default Categories;
