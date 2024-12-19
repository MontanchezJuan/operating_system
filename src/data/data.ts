import {
  LiaBrushSolid,
  LiaLanguageSolid,
  LiaLaptopSolid,
  LiaTableSolid,
  LiaUser,
  LiaUserFriendsSolid,
  LiaUserLockSolid,
} from "react-icons/lia";
import { AccountsItem } from "../components/apps/settings/items/Accounts.Item";
import { AppsItem } from "../components/apps/settings/items/Apps.Item";
import { LanguageItem } from "../components/apps/settings/items/Language.Item";
import { MyAccountItem } from "../components/apps/settings/items/MyAccount.Item";
import { PermissionsItem } from "../components/apps/settings/items/Permissions.Item";
import { PersonalizationItem } from "../components/apps/settings/items/Personalization.Item";
import { SystemItem } from "../components/apps/settings/items/System.Item";
import { MenuItemInterface } from "../interfaces/apps/Settings.interface";
import {
  Color,
  GlobalColor,
  Type,
} from "../interfaces/context/Config.interface";

export const globalColors: Record<Type, Record<Color, GlobalColor>> = {
  bg: {
    blue: {
      base: "bg-blue-400 dark:bg-blue-600",
      darkHover: "hover:bg-blue-700 dark:hover:bg-blue-800",
      lightHover: "hover:bg-blue-200 dark:hover:bg-blue-400",
    },
    cyan: {
      base: "bg-cyan-400 dark:bg-cyan-600",
      darkHover: "hover:bg-cyan-700 dark:hover:bg-cyan-800",
      lightHover: "hover:bg-cyan-200 dark:hover:bg-cyan-400",
    },
    green: {
      base: "bg-green-400 dark:bg-green-600",
      darkHover: "hover:bg-green-700 dark:hover:bg-green-800",
      lightHover: "hover:bg-green-200 dark:hover:bg-green-400",
    },
    orange: {
      base: "bg-orange-400 dark:bg-orange-600",
      darkHover: "hover:bg-orange-700 dark:hover:bg-orange-800",
      lightHover: "hover:bg-orange-200 dark:hover:bg-orange-400",
    },
    pink: {
      base: "bg-pink-400 dark:bg-pink-600",
      darkHover: "hover:bg-pink-700 dark:hover:bg-pink-800",
      lightHover: "hover:bg-pink-200 dark:hover:bg-pink-400",
    },
    purple: {
      base: "bg-purple-400 dark:bg-purple-600",
      darkHover: "hover:bg-purple-700 dark:hover:bg-purple-800",
      lightHover: "hover:bg-purple-200 dark:hover:bg-purple-400",
    },
    red: {
      base: "bg-red-400 dark:bg-red-600",
      darkHover: "hover:bg-red-700 dark:hover:bg-red-800",
      lightHover: "hover:bg-red-200 dark:hover:bg-red-400",
    },
    yellow: {
      base: "bg-yellow-400 dark:bg-yellow-600",
      darkHover: "hover:bg-yellow-700 dark:hover:bg-yellow-800",
      lightHover: "hover:bg-yellow-200 dark:hover:bg-yellow-400",
    },
  },
  border: {
    blue: {
      base: "border-blue-400 dark:border-blue-600",
      darkHover: "hover:border-blue-600 dark:hover:border-blue-800",
      lightHover: "hover:border-blue-200 dark:hover:border-blue-400",
    },
    cyan: {
      base: "border-cyan-400 dark:border-cyan-600",
      darkHover: "hover:border-cyan-600 dark:hover:border-cyan-800",
      lightHover: "hover:border-cyan-200 dark:hover:border-cyan-400",
    },
    green: {
      base: "border-green-400 dark:border-green-600",
      darkHover: "hover:border-green-600 dark:hover:border-green-800",
      lightHover: "hover:border-green-200 dark:hover:border-green-400",
    },
    orange: {
      base: "border-orange-400 dark:border-orange-600",
      darkHover: "hover:border-orange-600 dark:hover:border-orange-800",
      lightHover: "hover:border-orange-200 dark:hover:border-orange-400",
    },
    pink: {
      base: "border-pink-400 dark:border-pink-600",
      darkHover: "hover:border-pink-600 dark:hover:border-pink-800",
      lightHover: "hover:border-pink-200 dark:hover:border-pink-400",
    },
    purple: {
      base: "border-purple-400 dark:border-purple-600",
      darkHover: "hover:border-purple-600 dark:hover:border-purple-800",
      lightHover: "hover:border-purple-200 dark:hover:border-purple-400",
    },
    red: {
      base: "border-red-400 dark:border-red-600",
      darkHover: "hover:border-red-600 dark:hover:border-red-800",
      lightHover: "hover:border-red-200 dark:hover:border-red-400",
    },
    yellow: {
      base: "border-yellow-400 dark:border-yellow-600",
      darkHover: "hover:border-yellow-600 dark:hover:border-yellow-800",
      lightHover: "hover:border-yellow-200 dark:hover:border-yellow-400",
    },
  },
  text: {
    blue: {
      base: "text-blue-400 dark:text-blue-600",
      darkHover: "hover:text-blue-700 dark:hover:text-blue-800",
      lightHover: "hover:text-blue-200 dark:hover:text-blue-400",
    },
    cyan: {
      base: "text-cyan-400 dark:text-cyan-600",
      darkHover: "hover:text-cyan-700 dark:hover:text-cyan-800",
      lightHover: "hover:text-cyan-200 dark:hover:text-cyan-400",
    },
    green: {
      base: "text-green-400 dark:text-green-600",
      darkHover: "hover:text-green-700 dark:hover:text-green-800",
      lightHover: "hover:text-green-200 dark:hover:text-green-400",
    },
    orange: {
      base: "text-orange-400 dark:text-orange-600",
      darkHover: "hover:text-orange-700 dark:hover:text-orange-800",
      lightHover: "hover:text-orange-200 dark:hover:text-orange-400",
    },
    pink: {
      base: "text-pink-400 dark:text-pink-600",
      darkHover: "hover:text-pink-700 dark:hover:text-pink-800",
      lightHover: "hover:text-pink-200 dark:hover:text-pink-400",
    },
    purple: {
      base: "text-purple-400 dark:text-purple-600",
      darkHover: "hover:text-purple-700 dark:hover:text-purple-800",
      lightHover: "hover:text-purple-200 dark:hover:text-purple-400",
    },
    red: {
      base: "text-red-400 dark:text-red-600",
      darkHover: "hover:text-red-700 dark:hover:text-red-800",
      lightHover: "hover:text-red-200 dark:hover:text-red-400",
    },
    yellow: {
      base: "text-yellow-400 dark:text-yellow-600",
      darkHover: "hover:text-yellow-700 dark:hover:text-yellow-800",
      lightHover: "hover:text-yellow-200 dark:hover:text-yellow-400",
    },
  },
};

export const initialRealTime = [
  {
    time: 0,
    value: 1,
  },
  {
    time: 1,
    value: 1,
  },
  {
    time: 2,
    value: 1,
  },
  {
    time: 3,
    value: 1,
  },
  {
    time: 4,
    value: 1,
  },
  {
    time: 5,
    value: 1,
  },
  {
    time: 6,
    value: 1,
  },
  {
    time: 7,
    value: 1,
  },
  {
    time: 8,
    value: 1,
  },
  {
    time: 9,
    value: 1,
  },
];

export const MenuItems: MenuItemInterface[] = [
  { name: "MyAccount", Icon: LiaUser, option: MyAccountItem, toAdmin: false },
  {
    name: "System",
    Icon: LiaLaptopSolid,
    option: SystemItem,
    toAdmin: false,
  },
  {
    name: "Apps",
    Icon: LiaTableSolid,
    option: AppsItem,
    toAdmin: false,
  },
  {
    name: "Personalization",
    Icon: LiaBrushSolid,
    option: PersonalizationItem,
    toAdmin: false,
  },
  {
    name: "Language",
    Icon: LiaLanguageSolid,
    option: LanguageItem,
    toAdmin: false,
  },
  {
    Icon: LiaUserFriendsSolid,
    name: "Accounts",
    option: AccountsItem,
    toAdmin: true,
  },
  {
    name: "Permissions",
    Icon: LiaUserLockSolid,
    option: PermissionsItem,
    toAdmin: true,
  },
];
