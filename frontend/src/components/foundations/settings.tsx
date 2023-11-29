import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import {
  HamburgerMenuIcon,
  ExitIcon,
  Pencil1Icon,
  GlobeIcon,
  MagicWandIcon,
  SunIcon,
  MoonIcon,
} from "@radix-ui/react-icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

const DROPDOWN_ICON_CLASSES = "w-5 mr-2";

function toggleThemeLight() {
  const htmlElement = document.documentElement;
  htmlElement.classList.remove("dark");
}

function toggleThemeDark() {
  const htmlElement = document.documentElement;
  htmlElement.classList.add("dark");
}

function logOut() {
  localStorage.clear();
  alert("logging out...");
  window.location.href = "/";
}

const changeLanguage = (lng: string) => {
  i18next.changeLanguage(lng);
};

function Settings() {
  return (
    <div className="top-7 right-7 fixed">
      <DropdownMenu>
        <DropdownMenuTrigger asChild aria-label="Customize options">
          <HamburgerMenuIcon className="w-6 h-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          
          <DropdownMenuSeparator />

          <Link to="/account">
            <DropdownMenuItem>{i18next.t("setting.account")}</DropdownMenuItem>
          </Link>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {i18next.t("setting.theme")}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={toggleThemeLight}>
                  <SunIcon className={DROPDOWN_ICON_CLASSES} />
                  {i18next.t("setting.themeL")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleThemeDark}>
                  <MoonIcon className={DROPDOWN_ICON_CLASSES} />
                  {i18next.t("setting.themeD")}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {i18next.t("setting.lang")}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => changeLanguage("nl")}>
                  <SunIcon className={DROPDOWN_ICON_CLASSES} />
                  {i18next.t("lang.nl")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("en")}>
                  <MoonIcon className={DROPDOWN_ICON_CLASSES} />
                  {i18next.t("lang.en")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}} disabled>
                  <MoonIcon className={DROPDOWN_ICON_CLASSES}/>
                  {i18next.t("lang.pl")}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={logOut}>
            {i18next.t("setting.logOut")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default Settings;
