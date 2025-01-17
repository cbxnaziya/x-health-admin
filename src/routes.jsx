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
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Users",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Categories",
        path: "/categories",
        element: <Categories />,
      },
    ],
  },

  
  {
    title: "",
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
