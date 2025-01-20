import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Tooltip,
  Button,
  Input,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { platformSettingsData, conversationsData, projectsData } from "@/data";
import { GET_USER, UPDATE_USER } from "@/utils/Endpoint";
import { fetchHandler } from "@/utils/Api";
import { useLoader } from "@/context/LoaderContext";

export function Profile() {
  const {setLoader} = useLoader()
  const [adminData, setAdminData] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    country_code: "",
    phone: "",
    gender: "",
    role: "",
  });

  // // Fetch admin data on component mount
  // useEffect(() => {
  //   // Replace with your API call
  //   fetch(GET_USER)
  //     .then((response) => response.json())
  //     .then((data) => setAdminData(data))
  //     .catch((error) => console.error("Error fetching admin data:", error));
  // }, []);


    // Fetch users data
    const getData = async () => {
      try {
        const response = await fetchHandler(GET_USER, "", true, setLoader, "GET");
        console.log(response);
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
      });
    }
    setIsEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
     console.log(adminData._id,"adminData");
     

     try{
const response = await fetchHandler(UPDATE_USER, editForm, true, setLoader, "PUT")
    //  setAdminData(response?.data?.user || []);
    getData()
     toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to update user. Please try again.");
      console.error("Error fetching users:", error);
    } finally{
      setIsEditOpen(false);
    }


  };
  const placeholderImage = "/img/user.jpg";

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src={adminData?.avatar || placeholderImage}
                alt={adminData?.name || "Admin"}
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {adminData?.name || "Admin Name"}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  {adminData?.role || "Admin Role"}
                </Typography>
              </div>
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
              "Country" :` + ${adminData?.country_code || "N/A"} `,
              Phone: adminData?.phone || "N/A",
              Gender: adminData?.gender || "N/A",
              Role: adminData?.role || "N/A",
            }}
            // action={
            //   <Tooltip content="Edit Profile">
            //     <PencilIcon
            //       className="h-4 w-4 cursor-pointer text-blue-gray-500"
            //       onClick={handleEditClick}
            //     />
            //   </Tooltip>
            // }
          />
        </CardBody>
      </Card>

      {/* Edit Profile Modal */}
      <Dialog open={isEditOpen} handler={setIsEditOpen}>
            <DialogHeader>Edit Profile</DialogHeader>
        <DialogBody className="space-y-4 ">

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
          <Button variant="gradient" onClick={handleEditSave}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Profile;

