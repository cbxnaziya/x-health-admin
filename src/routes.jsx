import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import Categories from "./pages/categories/categories";
import UserProfile from "./pages/dashboard/userProfile";
import ProfileQuestions from "./pages/dashboard/profileQuestions";
import Content from "./pages/dashboard/content";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "My profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Users",
        path: "/users",
        element: <Tables />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "User profile",
        path: "/user-profile",
        element: <UserProfile />,
      },
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "notifications",
      //   path: "/notifications",
      //   element: <Notifications />,
      // },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Profile Questions",
        path: "/Profile-questions",
        element: <ProfileQuestions />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Categories",
        path: "/categories",
        element: <Categories />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Content",
        path: "/content",
        element: <Content />,
      },
    ],
  },

  
  {

    layout: "auth",
    pages: [
      {
        // icon: <ServerStackIcon {...icon} />,
        name: "",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        // icon: <RectangleStackIcon {...icon} />,
        name: "",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
