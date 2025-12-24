import { jsx } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { C as Card } from "./card.xR1H4xxx.js";
function use3DTilt() {
  const [rotation, setRotation] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!cardRef.current || !isHovering) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const rotateXValue = mouseY / (rect.height / 2) * -12;
    const rotateYValue = mouseX / (rect.width / 2) * 12;
    setRotation({
      rotateX: rotateXValue,
      rotateY: rotateYValue
    });
  };
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ rotateX: 0, rotateY: 0 });
  };
  return {
    cardRef,
    rotation,
    isHovering,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    getTransform: () => isHovering ? `rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg) translateZ(30px)` : "rotateX(0deg) rotateY(0deg) translateZ(0px)"
  };
}
function Tilt3DCard({ children, className = "", style = {}, id }) {
  const { cardRef, isHovering, handleMouseMove, handleMouseEnter, handleMouseLeave, getTransform } = use3DTilt();
  return /* @__PURE__ */ jsx(
    "div",
    {
      id,
      ref: cardRef,
      style: {
        perspective: "1000px",
        transformStyle: "preserve-3d",
        ...style
      },
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      className: "w-full",
      children: /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            transform: getTransform(),
            transformStyle: "preserve-3d",
            transition: isHovering ? "none" : "transform 0.5s cubic-bezier(0.23, 1, 0.320, 1)"
          },
          children: /* @__PURE__ */ jsx(
            Card,
            {
              className: `border border-border shadow-sm transition-shadow duration-300 ease-out bg-card dark:bg-card ${className}`,
              style: {
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                transition: "box-shadow 0.3s cubic-bezier(0.23, 1, 0.320, 1)",
                pointerEvents: "auto"
              },
              children
            }
          )
        }
      )
    }
  );
}
export {
  Tilt3DCard as T
};
