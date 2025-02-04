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
import { GET_CONTENTS } from "@/utils/Endpoint";
import toast from "react-hot-toast";
import { useLoader } from "@/context/LoaderContext";
import { formatTimestamp } from "@/utils/Functions";

export function Content() {
  const { setLoader } = useLoader();
  const [profiles, setProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [newProfile, setNewProfile] = useState({
      category: "",
      content: [{ title: "", plan: [] }],
      status: "active", // Default status
  });
  const [selectedContent, setselectedContent] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [profilesPerPage, setProfilesPerPage] = useState(10); // Default 10 items per page

  // Fetch profiles data 
  const getData = async () => {
      try {
          const response = await fetchHandler(GET_CONTENTS, "", false, setLoader, "GET");
          setProfiles(response?.data?.profiles || []);
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

  // Handle change in "Content per Page"
  const handleContentPerPageChange = (e) => {
      setProfilesPerPage(Number(e.target.value));
      setCurrentPage(1); // Reset to first page
  };

  const handleEdit = (profile) => {
      setSelectedProfile(profile);
      setOpen(true);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const { category, content, status } = selectedProfile;
          const response = await fetchHandler(
              UPDATE_CATEGORIES,
              { id: selectedProfile._id, category, content, status },
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
          setOpen(false); // Close the dialog
          setLoader(false); // Hide loader after API call is complete
      }
  };

  const handleAddProfileInput = (e) => {
      const { name, value } = e.target;
      setNewProfile((prev) => ({ ...prev, [name]: value }));
  };
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleDayClick = (idx) => {
    setSelectedDay(selectedDay === idx ? null : idx); // Toggle day selection
    setSelectedPlan(null); // Reset plan selection when changing day
  };

  const handlePlanClick = (idx) => {
    setSelectedPlan(selectedPlan === idx ? null : idx); // Toggle plan selection
  };

  const handleContentChange = (e, dayIdx, planIdx, fiel) => {
    // Handle change for plan fields (e.g., title, content)
    const updatedContent = [...selectedProfile.content];
    updatedContent[dayIdx].plan[planIdx][field] = e.target.value;
    // Assuming you have a way to update the content in the state (or backend)
    // Update the state with the modified content
    // For example:
    // setSelectedProfile({ ...selectedProfile, content: updatedContent });
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
                          <Button size="sm" color="green" className="ml-4" onClick={() => setOpen(true)}>
                              + Add Profile
                          </Button>
                      </div>
                  </div>
              </CardHeader>

              <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                  <table className="w-full min-w-[640px] table-auto">
                      <thead>
                          <tr>
                              {[ "Content Title", "Status", "Levels", "Created At", "Actions"].map((el) => (
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
                              currentProfiles.map(({ _id, category, content, status, review, createdAt,name }, index) => (
                                  <tr key={_id}>
                                      {/* <td className="py-3 px-5">{index + 1}</td> */}
                                      {/* <td className="py-3 px-5">{category}</td> */}
                                      <td className="py-3 px-5">{name}</td>
                                      {/* <td className="py-3 px-5">{content[index]?.title}</td> */}
                                      <td className="py-3 px-5">{status ? "Active":"Inactive"}</td>
                                      <td className="py-3 px-5">{content?.length}</td>
                                      <td className="py-3 px-5">{formatTimestamp(createdAt)}</td>
                                      <td className="py-3 px-5 flex gap-2">
                                          <Button size="sm" onClick={() => handleEdit({ _id, category, content, status, review, createdAt ,name})}>
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
                                  <td colSpan="7" className="py-3 px-5 text-center">
                                      No profiles found
                                  </td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </CardBody>

              {/* Showing X–Y of Z */}

              {/* Pagination Controls */}
              <div className="flex justify-between items-center px-6 py-4">
     
                  <div className="flex items-center gap-2">
                      <Typography variant="body2" color="gray">
                          Content per page:
                      </Typography>
                      <select
                          value={profilesPerPage}
                          onChange={handleContentPerPageChange}
                          className="border border-gray-300 rounded p-2"
                      >
                        {[10,20,30].map((option)=>(
                          <option key={option} value={option}>{option}</option>
                        ))}
                 
                      </select>
                  </div>
                  <div className="px-6 py-4">
                  <Typography variant="body2" color="gray">
                      {`Showing ${indexOfFirstProfile + 1}–${Math.min(indexOfLastProfile, filteredProfiles.length)} of ${filteredProfiles.length}`}
                  </Typography>
              </div>
                  <div className="flex gap-2">
                      <Button
                          // size="sm"
                          // color="blue"
                          onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                          disabled={currentPage === 1}
                      >
                          Prev
                      </Button>
                      <Button
                          // size="sm"
                          // color="blue"
                          onClick={() => paginate(currentPage < Math.ceil(filteredProfiles.length / profilesPerPage) ? currentPage + 1 : currentPage)}
                          disabled={currentPage === Math.ceil(filteredProfiles.length / profilesPerPage)}
                      >
                          Next
                      </Button>
                  </div>
              </div>
          </Card>

          {/* Add Profile Dialog */}
          {/* Existing Dialogs for Add, Edit, and Delete remain unchanged */}

              {/* Popup for editing user */}


                
    {/* Popup for editing user */}
    <Dialog open={open} handler={setOpen}>
    <DialogHeader>Edit Category</DialogHeader>
    <form onSubmit={handleSubmit}>
        <DialogBody>
        <div className="flex flex-col gap-4">
            {/* Name input */}
            <Input
            label="Category"
            name="name"
            value={selectedProfile?.name || ""}
            onChange={handleChange}
            required
            />

            {/* Status Dropdown */}
            <div className="relative">
            <label className="text-sm font-semibold">Status</label>
            <select
                name="status"
                value={selectedProfile?.status || ""}
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

            {/* Category (if needed) */}
            {/* <Input
            label="Category"
            name="category"
            value={selectedProfile?.category || ""}
            onChange={handleChange}
            required
            /> */}

            {/* Content (subfields like title and plans) */}
            {/* {selectedProfile?.content?.map((contentItem, idx) => (
            <div key={idx} className="flex flex-col gap-2 border p-2">
         
                Day {idx+1}
                <Input
                label={`Title ${idx + 1}`}
                name={`title_${idx}`}
                value={contentItem?.title || ""}
                onChange={(e) => handleContentChange(e, idx)}
                required
                />
             
                <Input
                label={`Plan ${idx + 1}`}
                name={`plan_${idx}`}
                value={contentItem?.plan?.join(", ") || ""}
                onChange={(e) => handleContentChange(e, idx, 'plan')}
                />
            </div>
            ))} */}

<div className="flex flex-col gap-2">
      {selectedProfile?.content?.map((contentItem, dayIdx) => (
        <div key={dayIdx} className="border p-2 cursor-pointer">
          {/* Day Button */}
          <div
            className="font-bold border-b pb-1"
            onClick={() => handleDayClick(dayIdx)}
          >
            Day {dayIdx + 1}
          </div>

          {/* Show Content Only When Clicked */}
          {selectedDay === dayIdx && (
            <div className="mt-2 flex flex-col gap-2">
              <Input
                label={`Title ${dayIdx + 1}`}
                name={`title_${dayIdx}`}
                value={contentItem?.title || ""}
                onChange={(e) => handleContentChange(e, dayIdx, -1, "title")}
                required
              />

              {/* Plans List */}
              {contentItem?.plan?.map((planItem, planIdx) => (
                <div key={planIdx} className="border p-2 cursor-pointer">
                  {/* Plan Button */}
                  <div
                    className="font-semibold border-b pb-1"
                    onClick={() => handlePlanClick(planIdx)}
                  >
                    Plan {planIdx + 1}
                  </div>

                  {/* Show Plan Content Only When Clicked */}
                  {selectedPlan === planIdx && (
                    <div className="mt-2 flex flex-col gap-2">
                      <div className="mb-2">
                        <strong>Plan Title:</strong>
                        <Input
                          value={planItem.title || ""}
                          onChange={(e) => handleContentChange(e, dayIdx, planIdx, "title")}
                          placeholder="Enter Plan Title"
                        />
                      </div>
                      <div className="mb-2">
                        <strong>Name:</strong>
                        <Input
                          value={planItem.name || ""}
                          onChange={(e) => handleContentChange(e, dayIdx, planIdx, "name")}
                          placeholder="Enter Plan Name"
                        />
                      </div>
                      <div className="mb-2">
                        <strong>Type:</strong>
                        <Input
                          value={planItem.type || ""}
                          onChange={(e) => handleContentChange(e, dayIdx, planIdx, "type")}
                          placeholder="Enter Plan Type"
                        />
                      </div>
                      <div className="mb-2">
                        <strong>Content:</strong>
                        <Input
                          value={planItem.content || ""}
                          onChange={(e) => handleContentChange(e, dayIdx, planIdx, "content")}
                          placeholder="Enter Plan Content"
                          multiline
                        />
                      </div>
                      <div className="mb-2">
                        <strong>Duration:</strong>
                        <Input
                          value={planItem.duration || ""}
                          onChange={(e) => handleContentChange(e, dayIdx, planIdx, "duration")}
                          placeholder="Enter Duration"
                        />
                      </div>
                      {planItem.image && (
                        <div className="mb-2">
                          <strong>Image:</strong>
                          <img
                            src={planItem.image}
                            alt={planItem.title}
                            className="w-full h-auto mt-2"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
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


      </div>
  );
}

export default Content;
