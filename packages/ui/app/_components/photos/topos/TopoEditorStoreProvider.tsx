"use client";
import theme from "@/app/_components/photos/topos/theme";
import TopoEditorStore, {
  TopoEditorStoreContext,
} from "@/app/_components/photos/topos/TopoEditorStore";
import { TopogonEntitiesPool } from "@/app/api/_actions/getTopo";
import { IPhoto } from "models";
import React from "react";

export default function TopoEditorStoreProvider({
  children,
  photo,
  entityPool,
}: {
  children: React.ReactNode;
  photo: IPhoto;
  entityPool?: TopogonEntitiesPool;
}) {
  const topogonOptions = {
    defaultColor: theme.palette.green.dark,
    defaultFillColor: "#ffffff",
    defaultLineTension: 0.2,
    defaultLabelText: "New Label",
    entityPool,
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
