

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
import {
  ADD_PROFILE_QUESTIONS,
  GET_PROFILE_QUESTIONS,
  UPDATE_PROFILE_QUESTIONS,
} from "@/utils/Endpoint";
import toast from "react-hot-toast";
import { useLoader } from "@/context/LoaderContext";
import imageCompression from "browser-image-compression";

export default function ProfileQuestions() {
  const { setLoader } = useLoader();
  const [profiles, setProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Fetch profiles data
  const getData = async () => {
    try {
      const response = await fetchHandler(GET_PROFILE_QUESTIONS, "", false, setLoader, "GET");
      setProfiles(response?.data || []);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredProfiles = profiles.filter((profile) =>
    `${profile?.question} ${profile?.meta} ${profile?._id}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase().trim())
  );

  const handleEdit = (profile) => {
    setSelectedProfile(profile);
    setOpen(true);
  };


  const compressImages = async (options) => {
    if (!Array.isArray(options)) return [];
  
    const compressedOptions = await Promise.all(
      options.map(async (option) => {
        // Ensure image exists and is of type File
        if (option.image && option.image instanceof File) {
          try {
            const compressedFile = await imageCompression(option.image, {
              maxSizeMB: 1,
              maxWidthOrHeight: 800,
              useWebWorker: true,
            });
  
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
              reader.onload = () => {
                resolve({ ...option, image: reader.result });
              };
              reader.onerror = reject;
              reader.readAsDataURL(compressedFile);
            });
          } catch (error) {
            console.error("Image compression failed", error);
            return option; // Return original option if compression fails
          }
        }
        return option; // Return the option as is if no image exists
      })
    );
  
    return compressedOptions;
  };
  
  

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);

      const { question, meta, options, status } = selectedProfile;
      const compressedOptions = await compressImages(options);

      const response = await fetchHandler(
        ADD_PROFILE_QUESTIONS,
        {  question, meta, options: compressedOptions, status },
        true,
        setLoader,
        "POST"
      );

      toast.success(response.data.message);
      setProfiles((prev) =>
        prev.map((profile) =>
          profile._id === selectedProfile._id ? { ...selectedProfile, options: compressedOptions } : profile
        )
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response.data.error);
    } finally {
      setLoader(false);
      setAddOpen(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);

      const { question, meta, options, status } = selectedProfile;
      const compressedOptions = await compressImages(options);

      const response = await fetchHandler(
        UPDATE_PROFILE_QUESTIONS,
        { id: selectedProfile._id, question, meta, options: compressedOptions, status },
        true,
        setLoader,
        "PUT"
      );

      toast.success(response.data.message);
      setProfiles((prev) =>
        prev.map((profile) =>
          profile._id === selectedProfile._id ? { ...selectedProfile, options: compressedOptions } : profile
        )
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoader(false);
      setOpen(false);
    }
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...selectedProfile.options];
    updatedOptions[index][field] = value;
    setSelectedProfile((prev) => ({ ...prev, options: updatedOptions }));
  };

  const handleAddOption = () => {
    const newOption = { name: "", image: "", remark: "" };
    setSelectedProfile((prev) => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
  };


  const handleRemoveOption = (index) => {
    const updatedOptions = selectedProfile.options.filter((_, i) => i !== index);
    setSelectedProfile((prev) => ({ ...prev, options: updatedOptions }));
  };

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      handleOptionChange(index, "image", reader.result); // Update with base64 string
    };
    if (file) reader.readAsDataURL(file);
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



  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex justify-between items-center flex-col sm:flex-row">
            <Typography variant="h6" color="white">
              Profile Questions Table
            </Typography>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-white"
              />

               {/* Add Category Button */}
      {/* <Button
        size="sm"
        color="green"
        className="ml-4"
        onClick={() => setAddOpen(true)} 
      >
       + Add Question
      </Button> */}
            </div>
          </div>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0">
          <table className="w-full table-auto">
            <thead>
              <tr>
                {["S no.", "Question", "Meta", "Options", "Status", "Actions"].map((el) => (
                  <th key={el} className="py-3 px-3 text-left border-b border-blue-gray-50">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody >
              {filteredProfiles.length > 0 ? (
                filteredProfiles?.map(({ _id, question, meta, options, status }, index) => (
                  <tr key={_id}>
                    <td className="py-3 px-5">{index + 1}</td>
                    <td className="py-3 px-5">{question}</td>
                    <td className="py-3 px-5">{meta}</td>
                    <td className="py-3 px-5">{options?.length}</td>
                    <td className="py-3 px-5">{status || "Active"}</td>
                    <td className="py-3 px-5">
                      <Button size="sm" onClick={() => handleEdit({ _id, question, meta, options, status })}>
                        Edit
                      </Button>
                        {/* <Button size="sm" color="red" onClick={() => confirmDelete(_id)}>
                          Delete
                        </Button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No profiles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* add Profile Question Dialog */}
      <Dialog open={addOpen} handler={() => setAddOpen(false)} style={{ minWidth: '90vw' }}>
        <DialogHeader>Add Question</DialogHeader>
        <form onSubmit={handleAddQuestion}>
          <DialogBody>
            <div className="flex flex-col gap-8">
              <Input
              required
                label="Question"
                name="question"
                value={selectedProfile?.question || ""}
                onChange={(e) => setSelectedProfile({ ...selectedProfile, question: e.target.value })}
              />
              <Input
                label="Meta"
                name="meta"
                value={selectedProfile?.meta || ""}
                onChange={(e) => setSelectedProfile({ ...selectedProfile, meta: e.target.value })}
              />
              {selectedProfile?.options?.map((option, index) => (
                <div key={index} className="flex flex-col md:flex-row items-center gap-4">
                  <Input
                    label="Option Name"
                    required
                    value={option.name}
                    onChange={(e) => handleOptionChange(index, "name", e.target.value)}
                  />
                  <Input
                  readOnly
                    label="Remark"
                    value={option.remark}
                    onChange={(e) => handleOptionChange(index, "remark", e.target.value)}
                  />
                  <Input type="file" onChange={(e) => handleFileChange(index, e)} />
                  {option.image && (
                    <img
                      src={typeof option.image === "string" ? option.image : ""}
                      alt={`Option ${index + 1}`}
                      className="h-12 w-12 rounded-md border"
                    />
                  )}
                  <Button size="sm" color="red" onClick={() => handleRemoveOption(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button size="sm" onClick={handleAddOption}>
                + Add Option
              </Button>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="text" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              Save
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
      {/* Edit Profile Dialog */}
      <Dialog open={open} handler={() => setOpen(false)} style={{ minWidth: '90vw' }}>
        <DialogHeader>Edit Question</DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <div className="flex flex-col gap-8">
              <Input
              required
                label="Question"
                name="question"
                value={selectedProfile?.question || ""}
                onChange={(e) => setSelectedProfile({ ...selectedProfile, question: e.target.value })}
              />
              <Input
                label="Meta"
                name="meta"
                value={selectedProfile?.meta || ""}
                onChange={(e) => setSelectedProfile({ ...selectedProfile, meta: e.target.value })}
              />
              {selectedProfile?.options?.map((option, index) => (
                <div key={index} className="flex flex-col md:flex-row items-center gap-4">
                  <Input
                    label="Option Name"
                    required
                    value={option.name}
                    onChange={(e) => handleOptionChange(index, "name", e.target.value)}
                  />
                  <Input
                  readOnly
                    label="Remark"
                    value={option.remark}
                    onChange={(e) => handleOptionChange(index, "remark", e.target.value)}
                  />
                  <Input type="file" onChange={(e) => handleFileChange(index, e)} />
                  {option.image && (
                    <img
                      src={typeof option.image === "string" ? option.image : ""}
                      alt={`Option ${index + 1}`}
                      className="h-12 w-12 rounded-md border"
                    />
                  )}
                  <Button size="sm" color="red" onClick={() => handleRemoveOption(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button size="sm" onClick={handleAddOption}>
                + Add Option
              </Button>
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
