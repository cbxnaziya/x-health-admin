

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
  import { GET_PROFILE_QUESTIONS, UPDATE_CATEGORIES, REMOVE_CATEGORIES, ADD_CATEGORIES, UPDATE_PROFILE_QUESTIONS } from "@/utils/Endpoint";
  import toast from "react-hot-toast";
  import { useLoader } from "@/context/LoaderContext";
  import { formatTimestamp } from "@/utils/Functions";
  
  export function ProfileQuestions() {
    const { setLoader } = useLoader();
    const [profiles, setProfiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [newProfile, setNewProfile] = useState({
      category: "",
      content: [{ title: "", plan: [] }],
      status: "active", // Default status
    });
    const [imagePreview, setImagePreview] = useState(null);
  
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [profilesPerPage, setProfilesPerPage] = useState(10); // Default 10 items per page
  
    // Fetch profiles data
    const getData = async () => {
      try {
        const response = await fetchHandler(GET_PROFILE_QUESTIONS, "", false, setLoader, "GET");
        console.log("response?.data",response?.data);
        setProfiles(response?.data || []);

      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };
  
    useEffect(() => {
      getData();
    }, []);
  
    const filteredProfiles = profiles.filter((profile) =>
      `${profile?.category} ${profile?.status} ${profile?._id}`.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  
    // Adjust current page if the filtered list is smaller
    useEffect(() => {
      if (currentPage > Math.ceil(filteredProfiles.length / profilesPerPage)) {
        setCurrentPage(1);
      }
    }, [filteredProfiles.length, currentPage, profilesPerPage]);
  
    // Paginate filtered profiles
    const indexOfLastProfile = currentPage * profilesPerPage;
    const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
    const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);
  
    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    const handleEdit = (profile) => {
      setSelectedProfile(profile);
      setOpen(true);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const { question, meta, options, status } = selectedProfile;
        const response = await fetchHandler(
          UPDATE_PROFILE_QUESTIONS,
          { id: selectedProfile._id,question, meta, options, status},
          true,
          setLoader,
          "PUT"
        );
        toast.success(response.data.message);
        setProfiles((prev) =>
          prev.map((profile) => (profile._id === selectedProfile._id ? selectedProfile : profile))
        );
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again.");
      } finally {
        setOpen(false);
      }
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setSelectedProfile((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleDelete = async () => {
      try {
        const response = await fetchHandler(
          REMOVE_CATEGORIES,
          { profile_id: selectedProfile._id },
          true,
          setLoader,
          "DELETE"
        );
        toast.success(response.data.message);
        setProfiles((prev) => prev.filter((profile) => profile._id !== selectedProfile._id));
      } catch (error) {
        console.error("Error deleting profile:", error);
        toast.error("Failed to delete profile. Please try again.");
      } finally {
        setOpenDelete(false);
      }
    };
  
    const confirmDelete = (profileId) => {
      setSelectedProfile({ _id: profileId });
      setOpenDelete(true);
    };
  
    const handleAddProfile = async () => {
      try {
        setLoader(true); // Show loader while API call is in progress
        const response = await fetchHandler(ADD_CATEGORIES, newProfile, true, setLoader, "POST");
  
        toast.success(response?.data?.message);
        if (response?.data?.status) {
          setNewProfile({ category: "", content: [{ title: "", plan: [] }], status: "active" });
          getData(); // Refresh data
        }
      } catch (error) {
        console.error("Error adding profile:", error);
        toast.error("Failed to add profile. Please try again.");
      } finally {
        setOpenAdd(false); // Close the dialog
        setLoader(false); // Hide loader after API call is complete
      }
    };
  
    const handleAddProfileInput = (e) => {
      const { name, value } = e.target;
      setNewProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (index, field, value) => {
      const updatedOptions = [...selectedProfile.options];
      updatedOptions[index][field] = value;
      setSelectedProfile((prev) => ({ ...prev, options: updatedOptions }));
    };
    
    const handleAddOption = () => {
      const newOption = {
        id: `option-${selectedProfile.options.length + 1}`,
        name: "",
        image: "",
        remark: "",
      };
      setSelectedProfile((prev) => ({
        ...prev,
        options: [...prev.options, newOption],
      }));
    };
    
    const handleRemoveOption = (index) => {
      const updatedOptions = selectedProfile.options.filter((_, i) => i !== index);
      setSelectedProfile((prev) => ({ ...prev, options: updatedOptions }));
    };

    const handleImageUpload = async (index, event) => {
      const file = event.target.files[0]; // Get the selected file
      if (file) {
        try {
          // Define compression options
          const options = {
            maxSizeMB: 1, // Maximum size in MB (adjust as needed)
            maxWidthOrHeight: 800, // Maximum width or height
            useWebWorker: true, // Use web worker for faster compression
          };
    
          // Compress the image
          const compressedFile = await imageCompression(file, options);
    
          const reader = new FileReader();
          reader.onload = (e) => {
            const compressedBase64 = e.target.result; // Compressed image in Base64
            handleOptionChange(index, "image", compressedBase64); // Save the Base64 to the respective option
          };
    
          reader.readAsDataURL(compressedFile); // Convert compressed file to Base64
        } catch (error) {
          console.error("Error compressing image:", error);
        }
      }
    };
  
    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <Typography variant="h6" color="white">
                Profile Questions Table
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
                {/* Add Profile Button */}
                <Button size="sm" color="green" className="ml-4" onClick={() => setOpenAdd(true)}>
                  + Add Question{open}v
                </Button>
              </div>
            </div>
          </CardHeader>
  
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["S no.", "Question", "Meta", "Options", "Status", "Actions"].map((el) => (
                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
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
                {currentProfiles.length > 0 ? (
                  currentProfiles.map(({ _id,question, meta, options, status },index) => (
                    <tr key={_id}>
                      <td className="py-3 px-5">{index+1}</td>
                      <td className="py-3 px-5">{question}</td>
                      <td className="py-3 px-5">{meta}</td>
                      <td className="py-3 px-5">{options?.length}</td>
                      <td className="py-3 px-5">{status || "Active"}</td>
                      {/* <td className="py-3 px-5">{content[0]?.title}</td>
                      <td className="py-3 px-5">{formatTimestamp(createdAt)}</td>
                      <td className="py-3 px-5 flex gap-2">
                      </td> */}
                        <Button size="sm" onClick={() => handleEdit({ _id,question, meta, options, status })}>
                          Edit
                        </Button>
                        <Button size="sm" color="red" onClick={() => confirmDelete(_id)}>
                          Delete
                        </Button>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-3 px-5 text-center">
                      No profiles found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
  
        {/* Add Profile Dialog */}
        <Dialog open={openAdd} handler={setOpenAdd}>
          <DialogHeader>Add New Profile</DialogHeader>
          <form onSubmit={(e) => e.preventDefault()}>
            <DialogBody>
              <div className="flex flex-col gap-4">
                <Input
                  label="Category ID"
                  name="category"
                  value={newProfile.category}
                  onChange={handleAddProfileInput}
                  required
                />
                <Input
                  label="Content Title"
                  name="content[0].title"
                  value={newProfile.content[0]?.title}
                  onChange={handleAddProfileInput}
                  required
                />
                <div className="relative">
                  <label className="text-sm font-semibold">Status</label>
                  <select
                    name="status"
                    value={newProfile.status}
                    onChange={handleAddProfileInput}
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
              <Button type="submit" variant="gradient" onClick={handleAddProfile}>
                Add Profile
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
  
        {/* Edit Profile Dialog */}
        {/* <Dialog open={open} handler={setOpen}>
          <DialogHeader>Edit Profile</DialogHeader>
          <form onSubmit={handleSubmit}>
            <DialogBody>
              <div className="flex flex-col gap-4">
                <Input
                  label="Question"
                  name="question"
                  value={selectedProfile?.question || ""}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="meta"
                  name="meta"
                  value={selectedProfile?.meta || ""}
                  onChange={handleChange}
                  required
                />
           
                <div className="relative">
                  <label className="text-sm font-semibold">Status</label>
                  <select
                    name="status"
                    value={selectedProfile?.status || ""}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded bg-white"
                    required
                  >
                    <option value="" disabled>Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
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
        </Dialog> */}
        {/* Edit Profile Dialog */}
<Dialog open={open} handler={setOpen}  style={{ minWidth: '90vw' }}>
  <DialogHeader>Edit Profile</DialogHeader>
  <form onSubmit={handleSubmit}>
    <DialogBody>
      <div className="flex flex-col gap-4">
        {/* Question Input */}
        <Input
          label="Question"
          name="question"
          value={selectedProfile?.question || ""}
          onChange={handleChange}
          required
        />

        {/* Meta Input */}
        <Input
          label="Meta"
          name="meta"
          value={selectedProfile?.meta || ""}
          onChange={handleChange}
          required
        />

  {/* Options Section */}
{/* Options Section */}
<div className="relative">
  <label className="text-sm font-semibold mb-2 block">Options</label>
  <div className="flex flex-col gap-4">
    {selectedProfile?.options?.map((option, index) => (
      <div
        key={option.id}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center border p-4"
      >
        {/* Name Input */}
        <div className="col-span-1">
          <Input
            label={`Option ${index + 1} Name`}
            name={`option-name-${index}`}
            value={option.name || ""}
            onChange={(e) => handleOptionChange(index, "name", e.target.value)}
            required
          />
        </div>

        {/* Image Input */}
        {/* <div className="col-span-">
          <Input
            type="text"
            label={`Option ${index + 1} Image`}
            name={`option-image-${index}`}
            value={option.image || ""}
            onChange={(e) => handleOptionChange(index, "image", e.target.value)}
            required
          />
        </div> */}
 
        <div className="col-span-1">
  <label className="block text-sm font-medium text-gray-700 ">
    {`Option ${index + 1} Image`}
  </label>

  <input
    type="file"
    accept="image/*"
    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer"
    onChange={(e) => handleImageUpload(index, e)}
  />

  {/* Display the image if it exists */}
  {imagePreview && (
    <div className="mt-2">
      <img
        src={imagePreview} // Image preview URL
        alt={`Option ${index + 1} preview`}
        className="w-full h-auto mt-2 rounded"
      />
    </div>
  )}
</div>


        {/* Remark Input */}
        <div className="col-span-1">
          <Input
          readOnly
            type="number"
            label={`Option ${index + 1} Remark`}
            name={`option-remark-${index}`}
            value={option.remark || ""}
            onChange={(e) => handleOptionChange(index, "remark", e.target.value)}
          />
        </div>

        {/* Remove Option Button */}
        <div className="col-span-1 text-center md:text-left">
          <Button
      
            color="red"
            onClick={() => handleRemoveOption(index)}
          >
            Remove
          </Button>
        </div>
      </div>
    ))}

    {/* Add Option Button */}
    <div className="mt-4">
      <Button
        variant="text"
        color="blue"
        onClick={handleAddOption}
      >
        Add Option
      </Button>
    </div>
  </div>
</div>

        {/* Status Select */}
        <div className="relative">
          <label className="text-sm font-semibold">Status</label>
          <select
            name="status"
            value={selectedProfile?.status || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded bg-white"
            required
          >
            <option value="" disabled>Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
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

  
        {/* Delete Confirmation Dialog */}
        <Dialog open={openDelete} handler={setOpenDelete}>
          <DialogHeader>Confirm Deletion</DialogHeader>
          <DialogBody>
            Are you sure you want to delete this profile? This action cannot be undone.
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
  
  export default ProfileQuestions;
  