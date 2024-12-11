"use client";
import ShowContentCard from "@/app/_components/show/ShowContentCard";
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
  // Support for intercepted photos, comments, etc.
  const tab = activeTab(pathname);
  return (
    <>
      <Tabs value={tab} aria-label="nav tabs" role="navigation">
        <LinkTab
          label="Overview"
          value="overview"
          selected={tab === "overview"}
          href={`${props.basePath}`}
        />
        <LinkTab
          label="Comments"
          value="comments"
          selected={tab === "comments"}
          href={`${props.basePath}/comments`}
        />
        <LinkTab
          label="Photos"
          value="photos"
          selected={tab === "photos"}
          href={`${props.basePath}/photos`}
        />
      </Tabs>
      <ShowContentCard>{props.children}</ShowContentCard>
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

function activeTab(pathname: string): TabViews {
  if (pathname.includes("photos")) return "photos";
  if (pathname.includes("comments")) return "comments";
  return "overview";
}
