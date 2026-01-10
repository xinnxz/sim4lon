import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useRef, useCallback } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog.CPYDtIdC.js";
import { S as SafeIcon, B as Button } from "./AuthGuard.Cq_0lvUi.js";
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}
function AvatarCropperModal({
  open,
  onOpenChange,
  imageSrc,
  onCropComplete
}) {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef(null);
  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }, []);
  const getCroppedImg = useCallback(async () => {
    const image = imgRef.current;
    if (!image || !completedCrop) return null;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const outputSize = 300;
    canvas.width = outputSize;
    canvas.height = outputSize;
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      outputSize,
      outputSize
    );
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        "image/jpeg",
        0.9
        // 90% quality
      );
    });
  }, [completedCrop]);
  const handleSave = async () => {
    console.log("handleSave called, completedCrop:", completedCrop);
    setIsProcessing(true);
    try {
      const blob = await getCroppedImg();
      console.log("getCroppedImg result:", blob, blob?.size);
      if (blob) {
        onCropComplete(blob);
        onOpenChange(false);
      } else {
        console.error("Blob is null - crop failed");
      }
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleCancel = () => {
    onOpenChange(false);
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md sm:max-w-lg", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(SafeIcon, { name: "Crop", className: "h-5 w-5 text-primary" }),
        "Crop Foto Profil"
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { children: "Sesuaikan area foto yang ingin digunakan sebagai avatar" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center overflow-hidden rounded-lg bg-muted p-2 max-h-[400px]", children: /* @__PURE__ */ jsx(
      ReactCrop,
      {
        crop,
        onChange: (c) => setCrop(c),
        onComplete: (c) => setCompletedCrop(c),
        aspect: 1,
        circularCrop: true,
        className: "max-h-[380px]",
        children: /* @__PURE__ */ jsx(
          "img",
          {
            ref: imgRef,
            src: imageSrc,
            alt: "Crop preview",
            onLoad: onImageLoad,
            className: "max-h-[380px] object-contain",
            crossOrigin: "anonymous"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxs("p", { className: "text-xs text-center text-muted-foreground", children: [
      /* @__PURE__ */ jsx(SafeIcon, { name: "Info", className: "inline h-3 w-3 mr-1" }),
      "Drag untuk memindahkan, resize sudut untuk mengubah ukuran"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: handleCancel,
          disabled: isProcessing,
          className: "flex-1",
          children: "Batal"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          onClick: handleSave,
          disabled: isProcessing || !completedCrop,
          className: "flex-1 bg-primary hover:bg-primary/90",
          children: isProcessing ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Loader2", className: "mr-2 h-4 w-4 animate-spin" }),
            "Memproses..."
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(SafeIcon, { name: "Check", className: "mr-2 h-4 w-4" }),
            "Gunakan Foto"
          ] })
        }
      )
    ] })
  ] }) });
}
export {
  AvatarCropperModal as A
};
