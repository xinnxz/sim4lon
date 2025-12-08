import { useState, useRef } from 'react'

interface Rotation {
  rotateX: number
  rotateY: number
}

export function use3DTilt() {
  const [rotation, setRotation] = useState<Rotation>({ rotateX: 0, rotateY: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isHovering) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

// Increase tilt strength for more pronounced Apple-like effect
    const rotateXValue = (mouseY / (rect.height / 2)) * -12
    const rotateYValue = (mouseX / (rect.width / 2)) * 12

    setRotation({
      rotateX: rotateXValue,
      rotateY: rotateYValue
    })
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setRotation({ rotateX: 0, rotateY: 0 })
  }

  return {
    cardRef,
    rotation,
    isHovering,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
getTransform: () =>
      isHovering
        ? `rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg) translateZ(30px)`
        : 'rotateX(0deg) rotateY(0deg) translateZ(0px)'
  }
}