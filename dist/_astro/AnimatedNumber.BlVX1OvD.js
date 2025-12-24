import { jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
function useCountUp(target, duration = 1200, startDelay = 0) {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef(null);
  const frameRef = useRef(null);
  useEffect(() => {
    setCount(0);
    startTimeRef.current = null;
    if (target === 0) return;
    const startAnimation = () => {
      const animate = (timestamp) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }
        const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
        const easeProgress = 1 - Math.pow(2, -10 * progress);
        setCount(Math.floor(easeProgress * target));
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };
      frameRef.current = requestAnimationFrame(animate);
    };
    const timeoutId = setTimeout(startAnimation, startDelay);
    return () => {
      clearTimeout(timeoutId);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      startTimeRef.current = null;
    };
  }, [target, duration, startDelay]);
  return count;
}
function formatNumber(num) {
  return new Intl.NumberFormat("id-ID").format(num);
}
function formatCurrency(num) {
  return `Rp ${formatNumber(Math.round(num))}`;
}
function AnimatedNumber({
  value,
  delay = 0,
  className = "",
  isCurrency = false,
  prefix = "",
  suffix = "",
  duration = 1200
}) {
  const animatedValue = useCountUp(value, duration, delay);
  const formattedValue = isCurrency ? formatCurrency(animatedValue) : formatNumber(animatedValue);
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: `animate-countUp ${className}`,
      style: { animationDelay: `${delay}ms` },
      children: [
        prefix,
        formattedValue,
        suffix
      ]
    }
  );
}
export {
  AnimatedNumber as A
};
