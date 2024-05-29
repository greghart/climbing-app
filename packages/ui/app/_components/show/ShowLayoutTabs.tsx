"use client";
import { Tab, Tabs } from "@mui/material";
import { usePathname } from "next/navigation";
import * as React from "react";

interface Props {
  basePath: string;
  // Delegate content to children
  children?: React.ReactNode;
}

type TabViews = "overview" | "comments" | "photos";

/**
 * Tabs section of a show layout page
 *
 * Each entity has an overview, comments, and photos.
 * This layout sets up:
 *  * top-level tabs for choosing which sub-page
 *  * assumes a common routing convention `/{entity}/{id}/{overview|comments|photos}?
 */
export default function ShowLayoutTabs(props: Props) {
  const pathname = usePathname();
  const activeToken = pathname.split("/")[3];
  const activeLink: TabViews =
    activeToken === "comments"
      ? "comments"
      : activeToken === "photos"
      ? "photos"
      : "overview";
  console.warn(
    {
      props,
      activeToken,
      activeLink,
    },
    "ShowLayoutTabs"
  );
  return (
    <>
      <Tabs value={activeLink} aria-label="nav tabs" role="navigation">
        <LinkTab
          label="Overview"
          value="overview"
          selected={activeLink === "overview"}
          href={`${props.basePath}/overview`}
        />
        <LinkTab
          label="Comments"
          value="comments"
          selected={activeLink === "comments"}
          href={`${props.basePath}/comments`}
        />
        <LinkTab
          label="Photos"
          value="photos"
          selected={activeLink === "photos"}
          href={`${props.basePath}/photos`}
        />
      </Tabs>
      {props.children}
    </>
  );
}

interface LinkTabProps {
  label?: string;
  href?: string;
  selected?: boolean;
  value: string;
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab component="a" aria-current={props.selected && "page"} {...props} />
  );
}
