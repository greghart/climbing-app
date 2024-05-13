import { SearchResult } from "@/app/api/_operations/search";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import Link from "next/link";
import React, { MouseEvent } from "react";

interface Props {
  results?: Array<SearchResult>;
  onClick?: (r: SearchResult, e: MouseEvent<HTMLDivElement>) => void;
}

export default function SearchResultsList(props: Props) {
  if (!props.results) return false;

  return (
    <List
      component="div"
      disablePadding
      dense
      sx={{ width: "100%", maxWidth: "480px" }}
    >
      {props.results.map((r) => (
        <React.Fragment key={`${r.type}-${r.id}`}>
          {renderResult(r)}
        </React.Fragment>
      ))}
    </List>
  );
}

function renderResult(r: SearchResult) {
  switch (r.type) {
    case "area":
      return <AreaResult result={r} />;
    case "boulder":
      return <BoulderResult result={r} />;
    case "route":
      return <RouteResult result={r} />;
    default:
      return false;
  }
}

type ResultListItemProps = React.ComponentProps<typeof ListItemButton> & {
  href: string;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
};
function ResultListItem(props: ResultListItemProps) {
  return (
    <Link href={props.href}>
      <ListItem dense>
        <ListItemButton {...props} href={undefined} component="div">
          <ListItemText primary={props.primary} secondary={props.secondary} />
        </ListItemButton>
      </ListItem>
    </Link>
  );
}

function AreaResult({ result }: { result: SearchResult }) {
  return <ResultListItem href={`/areas/${result.id}`} primary={result.name} />;
}

function BoulderResult({ result }: { result: SearchResult }) {
  return (
    <ResultListItem
      href={`/boulders/${result.id}`}
      primary={result.name}
      secondary={result.parent!.name}
    />
  );
}

function RouteResult({ result }: { result: SearchResult }) {
  return (
    <ResultListItem
      href={`/routes/${result.id}`}
      primary={result.name}
      secondary={
        <>
          {result.parent!.parent!.name} | {result.parent!.name}
        </>
      }
    />
  );
}
