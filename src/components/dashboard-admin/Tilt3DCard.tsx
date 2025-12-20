import type { ReactNode } from 'react'
import { use3DTilt } from '@/hooks/use3DTilt'
import { Card } from '@/components/ui/card'

interface Tilt3DCardProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  id?: string
}

export default function Tilt3DCard({ children, className = '', style = {}, id }: Tilt3DCardProps) {
  const { cardRef, isHovering, handleMouseMove, handleMouseEnter, handleMouseLeave, getTransform } = use3DTilt()

  return (
    <div
      id={id}
      ref={cardRef}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        ...style
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full"
    >
      <div
        style={{
          transform: getTransform(),
          transformStyle: 'preserve-3d',
          transition: isHovering ? 'none' : 'transform 0.5s cubic-bezier(0.23, 1, 0.320, 1)'
        }}
      >
        <Card
          className={`border border-border shadow-sm transition-shadow duration-300 ease-out bg-card dark:bg-card ${className}`}
          style={{
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            transition: 'box-shadow 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
            pointerEvents: 'auto'
          }}
        >
          {children}
        </Card>
      </div>
    </div>
  )
}