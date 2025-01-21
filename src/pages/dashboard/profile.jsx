import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Button,
  Input,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { CameraIcon } from "@heroicons/react/24/solid";
import { ProfileInfoCard } from "@/widgets/cards";
import { GET_USER, UPDATE_USER } from "@/utils/Endpoint";
import { fetchHandler } from "@/utils/Api";
import { useLoader } from "@/context/LoaderContext";
import imageCompression from "browser-image-compression";

export function Profile() {
  const { setLoader } = useLoader();
  const [adminData, setAdminData] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id:"",
    name: "",
    email: "",
    country_code: "",
    phone: "",
    gender: "",
    role: "",
    profile_image: "", // added  field to hold the image data
  });
  const [imagePreview, setImagePreview] = useState(null); // For previewing the image
  const [imageBase64, setImageBase64] = useState(""); // For storing the base64 image

  // Fetch user data
  const getData = async () => {
    try {
      const response = await fetchHandler(GET_USER, "", true, setLoader, "GET");
      setAdminData(response?.data?.user || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleEditClick = () => {
    if (adminData) {
      setEditForm({
        id: adminData._id,
        name: adminData.name,
        email: adminData.email,
        country_code: adminData.country_code,
        phone: adminData.phone,
        gender: adminData.gender,
        role: adminData.role,
        profile_image: adminData.profile_image || "", 
      });
    }
    setIsEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0]; // Get the selected file
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result); // Preview image
  //       setImageBase64(reader.result); // Set base64 image data
  //       setEditForm((prev) => ({ ...prev, profile_image: reader.result })); //  data to edit form
  //       handleEditSave();
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleImageChange = async (e) => {
    const file = e.target.files[0]; // Get the selected file
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
  
        reader.onloadend = () => {
          const compressedBase64 = reader.result; // Get compressed image in base64
          setImagePreview(compressedBase64); // Preview image
          setImageBase64(compressedBase64); // Set base64 image data
      
          setEditForm((prev) => ({ ...prev, id: adminData._id, profile_image: compressedBase64,    })); // Add compressed image to form
          console.log("test");
          
          handleEditSave({  id: adminData._id, profile_image: compressedBase64,    }); // Save the changes to the user
        };
  
        reader.readAsDataURL(compressedFile); // Convert the compressed file to base64
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  const handleEditSave = async (data) => {
    try {
      const response = await fetchHandler(
        UPDATE_USER,
        data,
        true,
        setLoader,
        "PUT"
      );
      getData();
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to update user. Please try again.");
      console.error("Error fetching users:", error);
    } finally {
      setIsEditOpen(false);
    }
  };

  const placeholderImage = "/img/user.jpg";
  
  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 p-4 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="relative">
              <Avatar
                src={adminData?.profile_image || placeholderImage}
                // src={imagePreview || adminData?.profile_image || placeholderImage}
                alt={adminData?.name || "Admin"}
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <button className="absolute bottom-1 right-1 bg-purple-500 text-white p-1 rounded-full shadow-md">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />
                <CameraIcon className="h-5 w-5" />
              </button>
            </div>
            <Button variant="gradient" onClick={handleEditClick}>
              Edit Profile
            </Button>
          </div>
          <ProfileInfoCard
            title="Profile Information"
            description="Manage your profile details here."
            details={{
              Name: adminData?.name || "N/A",
              Email: adminData?.email || "N/A",
              Country: `+${adminData?.country_code || "N/A"}`,
              Phone: adminData?.phone || "N/A",
              Gender: adminData?.gender || "N/A",
              Role: adminData?.role || "N/A",
            }}
          />
        </CardBody>
      </Card>

      <Dialog open={isEditOpen} handler={setIsEditOpen}>
        <DialogHeader>Edit Profile</DialogHeader>
        <DialogBody className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={editForm.name}
            onChange={handleEditChange}
          />
          <Input
            label="Email"
            name="email"
            value={editForm.email}
            onChange={handleEditChange}
          />
          <Input
            label="Country Code"
            name="country_code"
            value={editForm.country_code}
            onChange={handleEditChange}
          />
          <Input
            label="Phone"
            name="phone"
            value={editForm.phone}
            onChange={handleEditChange}
          />
          <Input
            label="Gender"
            name="gender"
            value={editForm.gender}
            onChange={handleEditChange}
          />
          <Input
            label="Role"
            name="role"
            value={editForm.role}
            onChange={handleEditChange}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setIsEditOpen(false)}>
            Cancel
          </Button>
          <Button variant="gradient" onClick={()=>handleEditSave(editForm)}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Profile;
