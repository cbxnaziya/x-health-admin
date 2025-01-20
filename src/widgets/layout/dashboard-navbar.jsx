import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const navigate = useNavigate();

  // State for logout confirmation modal
  const [openModal, setOpenModal] = useState(false);

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setOpenModal(false); // Close modal
    navigate("/auth/sign-in"); // Redirect to Sign In page
  };

  const toggleModal = () => setOpenModal(!openModal);

  return (
    <>
      <Navbar
        color={fixedNavbar ? "white" : "transparent"}
        className={`rounded-xl transition-all ${
          fixedNavbar
            ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
            : "px-0 py-1"
        }`}
        fullWidth
        blurred={fixedNavbar}
      >
        <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
          <div className="capitalize">
            <Breadcrumbs
              className={`bg-transparent p-0 transition-all ${
                fixedNavbar ? "mt-1" : ""
              }`}
            >
              <Link to={`/${layout}`}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
                >
                  {layout}
                </Typography>
              </Link>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {page}
              </Typography>
            </Breadcrumbs>
            <Typography variant="h6" color="blue-gray">
              {page}
            </Typography>
          </div>
          <div className="flex items-center">
            {/* <div className="mr-auto md:mr-4 md:w-56">
              <Input label="Search" />
            </div> */}
            <IconButton
              variant="text"
              color="blue-gray"
              className="grid xl:hidden"
              onClick={() => setOpenSidenav(dispatch, !openSidenav)}
            >
              <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
            </IconButton>
            {token ? (
              <Button
                variant="text"
                color="blue-gray"
                className="hidden items-center gap-1 px-4 xl:flex normal-case"
                onClick={toggleModal}
              >
                <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                Logout
              </Button>
            ) : (
              <Link to="/auth/sign-in">
                <Button
                  variant="text"
                  color="blue-gray"
                  className="hidden items-center gap-1 px-4 xl:flex normal-case"
                >
                  <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                  Sign In
                </Button>
              </Link>
            )}
            {/* <IconButton
              variant="text"
              color="blue-gray"
              onClick={() => setOpenConfigurator(dispatch, true)}
            >
              <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
            </IconButton>
            */}
          </div> 
        </div>
      </Navbar>

      {/* Confirmation Modal */}
      <Dialog open={openModal} handler={toggleModal}>
        <DialogHeader>Logout Confirmation</DialogHeader>
        <DialogBody>
          Are you sure you want to log out? You will need to sign in again to
          access your account.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={toggleModal}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            color="red"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
