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
  topogonEntitiesPool,
}: {
  children: React.ReactNode;
  photo: IPhoto;
  topogonEntitiesPool?: TopogonEntitiesPool;
}) {
  const topogonOptions = {
    defaultColor: theme.palette.green.dark,
    defaultFillColor: "#ffffff",
    defaultLineTension: 0.4,
    defaultLabelText: "",
  };
  const [store, setStore] = React.useState<TopoEditorStore>(
    new TopoEditorStore(photo, { topogonEntitiesPool, topogonOptions })
  );
  React.useEffect(
    () =>
      setStore(
        new TopoEditorStore(photo, { topogonEntitiesPool, topogonOptions })
      ),
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
