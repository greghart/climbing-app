"use client";
import TopoEditorStore, {
  TopoEditorStoreContext,
} from "@/app/_components/photos/topos/TopoEditorStore";
import { useTheme } from "@mui/material";
import { IPhoto } from "models";
import React from "react";

export default function TopoEditorStoreProvider({
  children,
  photo,
}: {
  children: React.ReactNode;
  photo: IPhoto;
}) {
  const theme = useTheme();
  const topogonOptions = {
    defaultLineColor: theme.palette.primary.main,
    defaultLineTension: 0.2,
  };
  const [store, setStore] = React.useState<TopoEditorStore>(
    new TopoEditorStore(photo, { topogonOptions })
  );
  React.useEffect(
    () => setStore(new TopoEditorStore(photo, { topogonOptions })),
    [photo]
  );
  return (
    <TopoEditorStoreContext.Provider value={store}>
      {children}
    </TopoEditorStoreContext.Provider>
  );
}

export function useTopoEditorStore() {
  return React.useContext(TopoEditorStoreContext);
}

// Optionally supply an id to only return store if the id matches
export function useTopogonEditorStore() {
  return useTopoEditorStore().topogonEditor;
}
