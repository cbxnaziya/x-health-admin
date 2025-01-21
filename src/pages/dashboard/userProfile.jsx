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
  import {  UPDATE_USER, DELETE_USER,  GET_ALL_USERS_PROFILE } from "@/utils/Endpoint";
  import toast from "react-hot-toast";
  import { useLoader } from "@/context/LoaderContext";
  import { formatTimestamp } from "@/utils/Functions";
import axios from "axios";
  
  export function UserProfile() {
    const { setLoader } = useLoader();
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
  
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(5); // Default number of users per page
  
    // Fetch users data
    const getData = async () => {
      try {
 
        // const response = await axios.get(GET_ALL_USERS_PROFILE);
        const response = await fetchHandler(GET_ALL_USERS_PROFILE, "", false, setLoader, "GET");
        setUsers(response?.data?.profiles || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
  
      }
    };
    useEffect(() => {
      getData()
    }, []);
  
  
    const filteredUsers = users.filter((user) =>
      `${user.name} ${user.email} ${user.phone} ${user._id}`
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
        const { name, email, phone, gender, preferred_language } = selectedUser;
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
  
    const placeholderImage = "/img/user.jpg";
  
    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex flex-col md:flex-row justify-between item-center">
              <Typography variant="h6" color="white">
                Users Profile Table
              </Typography>
              <div className="flex items-center gap-2">
                <Typography variant="body2" color="white">
                  Search:
                </Typography>
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value) }}
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
                  {[ "U-Id", "Mood", "Emotion", "Feeling", "goal","experience", "Actions"].map((el) => (
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
                  currentUsers.map(({ _id, name, email, phone, createdAt, profile_image, gender, preferred_language, country_code, userId,nickname, mood ,emotion,feeling,goal,experience,trauma,religion,religious}) => (
                    <tr key={_id}>
                      {/* <td className="py-3 px-3 ">
                        <img
                          src={profile_image || placeholderImage}
                          alt="Profile Image "
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            display: "block", // Ensures it behaves as a block element
                            // margin: "auto", // Centers the image
                          }}
                        />
                      </td> */}
  
                      <td className="py-3 px-5">{userId}</td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography className="font-semibold">{mood}</Typography>
                            {/* <Typography className="text-xs text-blue-gray-500">{email}</Typography> */}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-5">{emotion}</td>
                      <td className="py-3 px-5">{feeling}</td>
                      <td className="py-3 px-5">{goal}</td>
                      <td className="py-3 px-5">{experience}</td>
                      {/* <td className="py-3 px-5">{formatTimestamp(createdAt)}</td> */}
                      <td className="py-3 px-5 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEdit({ _id, name, email, phone, createdAt, gender, preferred_language, country_code,userId,nickname, mood ,emotion,feeling,goal,experience,trauma,religion,religious })}
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
              {[10, 20, 30].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
  
          {/* Pagination buttons */}
          {/* Pagination buttons */}
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
              <Typography variant="body2">{`Page ${currentPage}`}</Typography>
              <Button
                disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                onClick={() => paginate(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
  
        </div>
  
  
        {/* Popup for editing user */}
        <Dialog open={open} handler={setOpen}>
          <DialogHeader>Edit User</DialogHeader>
          <form onSubmit={handleSubmit}>
            <DialogBody>
              <div className="flex flex-col gap-4">
                <Input
                  label="Nickname"
                  name="nickname"
                  value={selectedUser?.nickname || ""}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Mood"
                  name="mood"
                  value={selectedUser?.mood || ""}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Emotion"
                  name="emotion"
                  value={selectedUser?.emotion || ""}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Feeling"
                  name="feeling"
                  value={selectedUser?.feeling || ""}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Goal"
                  name="goal"
                  value={selectedUser?.goal || ""}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Experience"
                  name="experience"
                  value={selectedUser?.experience || ""}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Trauma"
                  name="trauma"
                  value={selectedUser?.trauma || ""}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Religion"
                  name="religion"
                  value={selectedUser?.religion || ""}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Religious"
                  name="religious"
                  value={selectedUser?.religious || ""}
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
  
  export default UserProfile;
  