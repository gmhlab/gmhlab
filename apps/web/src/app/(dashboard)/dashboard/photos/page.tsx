"use client";

import { PhotoLibrary, toast } from "@gmhlab/blocks";
import { usePhotos } from "@gmhlab/data";
import { ModuleGate } from "@/components/module-gate";
import { PROJECT_OPTIONS } from "@/content/dashboard-workspace";

export default function PhotosRoute() {
  const { photos, upload, remove } = usePhotos();
  return (
    <ModuleGate id="photos">
      {(account) => (
        <PhotoLibrary
          photos={photos}
          canUpload
          canModerate={account.tier === "admin"}
          uploaderName={account.name}
          suggestedTags={["Field work", "Training", "Community", ...PROJECT_OPTIONS.map((p) => p.name)]}
          onUpload={async (photo) => {
            await upload(photo);
            toast("Photo added", photo.caption);
          }}
          onRemove={remove}
          note="Demo library: photos are stored in this browser only."
        />
      )}
    </ModuleGate>
  );
}
