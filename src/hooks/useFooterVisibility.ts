/**
 * useFooterVisibility - Hook to control app footer visibility during loading
 * 
 * Usage:
 * useFooterVisibility(isLoading)
 * 
 * This hook hides the AdminFooter (#app-footer) when isLoading is true
 * and shows it again when loading is complete.
 */

import { useEffect } from 'react'

export function useFooterVisibility(isLoading: boolean) {
    useEffect(() => {
        const footer = document.getElementById('app-footer')
        if (footer) {
            footer.style.display = isLoading ? 'none' : ''
        }
    }, [isLoading])
}

export default useFooterVisibility
