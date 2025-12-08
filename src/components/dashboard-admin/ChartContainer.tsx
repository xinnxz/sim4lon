import { ReactNode } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

interface ChartContainerProps {
  children: (isVisible: boolean) => ReactNode
  animationDelay?: string
}

export default function ChartContainer({ 
  children, 
  animationDelay 
}: ChartContainerProps) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 })

  return (
    <div 
      ref={ref}
      style={animationDelay ? { animationDelay } : {}}
    >
      {children(isVisible)}
    </div>
  )
}