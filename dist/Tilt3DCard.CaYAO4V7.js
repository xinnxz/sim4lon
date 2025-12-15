import { jsx } from "react/jsx-runtime";
import { u as use3DTilt } from "./use3DTilt.BtTfF2Rh.js";
import { C as Card } from "./card.9SjMqG_h.js";
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
              className: `border-2 border-border shadow-sm transition-shadow duration-300 ease-out bg-gradient-to-br from-card via-card to-card/70 ${className}`,
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
