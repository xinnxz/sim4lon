/**
 * WelcomePopup - Fun interactive welcome modal after login
 * 
 * Features:
 * - Different messages based on user ROLE (ADMIN, OPERATOR, PANGKALAN)
 * - Fun emojis and animations
 * - Only shows once per session (uses sessionStorage)
 */

'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { authApi, type UserProfile } from '@/lib/api'
import SafeIcon from '@/components/common/SafeIcon'

// Fun messages based on user ROLE (reliable, from database)
const getPersonalizedMessage = (profile: UserProfile) => {
    const firstName = profile.name.split(' ')[0]
    const hour = new Date().getHours()

    // Time-based greeting
    let timeGreeting = 'Selamat Pagi'
    let timeEmoji = '🌅'
    if (hour >= 11 && hour < 15) {
        timeGreeting = 'Selamat Siang'
        timeEmoji = '☀️'
    } else if (hour >= 15 && hour < 18) {
        timeGreeting = 'Selamat Sore'
        timeEmoji = '🌤️'
    } else if (hour >= 18 || hour < 5) {
        timeGreeting = 'Selamat Malam'
        timeEmoji = '🌙'
    }

    // Role-based personalized messages
    switch (profile.role) {
        case 'ADMIN':
            return {
                greeting: `${timeEmoji} ${timeGreeting}, Boss ${firstName}!`,
                message: 'Dashboard lengkap sudah siap! Waktunya kita gaweee!',
                emoji: '👑',
                color: 'from-purple-500 to-indigo-600',
                tip: 'Silakan Cek DSS Pak utk insight hari ini!'
            }

        case 'OPERATOR':
            return {
                greeting: `${timeEmoji} ${timeGreeting}, ${firstName}!`,
                message: 'Yuk, semangat kerja hari ini! Ada pesanan menunggu diproses! 🚀',
                emoji: '💪',
                color: 'from-blue-500 to-cyan-600',
                tip: 'Quick tip: Gunakan voice order untuk input pesanan lebih cepat!'
            }

        case 'PANGKALAN':
            const pangkalanName = profile.pangkalans?.name || 'Pangkalan Anda'
            return {
                greeting: `${timeEmoji} ${timeGreeting}, ${firstName}!`,
                message: `Dashboard ${pangkalanName} siap! Pantau stok dan catat penjualan! 📊`,
                emoji: '🏪',
                color: 'from-orange-500 to-amber-600',
                tip: 'Cek laporan harian untuk monitor keuntungan Anda!'
            }

        default:
            // Fallback fun messages
            const defaultMessages = [
                {
                    greeting: `${timeEmoji} ${timeGreeting}, ${firstName}!`,
                    message: 'Semoga hari ini lancar dan penuh berkah! 🙏',
                    emoji: '✨',
                    color: 'from-primary to-primary/70',
                    tip: 'Jangan lupa cek notifikasi untuk update terbaru!'
                },
                {
                    greeting: `${timeEmoji} Hai ${firstName}!`,
                    message: 'Senang melihat Anda kembali! Dashboard sudah fresh! 🎉',
                    emoji: '👋',
                    color: 'from-pink-500 to-rose-600',
                    tip: 'Klik pada KPI Card untuk melihat detail lebih lanjut!'
                },
                {
                    greeting: `${timeEmoji} Welcome back, ${firstName}!`,
                    message: 'Ayo mulai hari yang produktif! LET\'S GO! 🔥',
                    emoji: '🚀',
                    color: 'from-amber-500 to-orange-600',
                    tip: 'Gunakan filter di daftar pesanan untuk pencarian cepat!'
                }
            ]

            return defaultMessages[Math.floor(Math.random() * defaultMessages.length)]
    }
}

interface WelcomePopupProps {
    forceShow?: boolean // For testing
}

export default function WelcomePopup({ forceShow = false }: WelcomePopupProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [personalizedMsg, setPersonalizedMsg] = useState<ReturnType<typeof getPersonalizedMessage> | null>(null)

    useEffect(() => {
        // Check if we already showed welcome this session
        const hasShownWelcome = sessionStorage.getItem('sim4lon_welcome_shown')

        if (hasShownWelcome && !forceShow) {
            return // Don't show again this session
        }

        // Fetch user profile and show popup
        const showWelcome = async () => {
            try {
                const profileData = await authApi.getProfile()
                setProfile(profileData)
                setPersonalizedMsg(getPersonalizedMessage(profileData))

                // Small delay for better UX (let dashboard load first)
                setTimeout(() => {
                    setIsOpen(true)
                    sessionStorage.setItem('sim4lon_welcome_shown', 'true')
                }, 800)
            } catch (error) {
                console.error('Failed to load profile for welcome:', error)
            }
        }

        showWelcome()
    }, [forceShow])

    if (!profile || !personalizedMsg) return null

    // Get role display
    const roleDisplay = profile.role === 'ADMIN' ? 'Administrator'
        : profile.role === 'PANGKALAN' ? 'Pangkalan'
            : 'Operator'

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-2xl">
                <div className={`relative bg-gradient-to-br ${personalizedMsg.color} p-6 text-white rounded-2xl`}>
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

                    {/* Big emoji */}
                    <div className="text-6xl mb-4 animate-bounce">{personalizedMsg.emoji}</div>

                    {/* Greeting */}
                    <h2 className="text-2xl font-bold mb-2">{personalizedMsg.greeting}</h2>
                    <p className="text-white/90 text-lg mb-4">{personalizedMsg.message}</p>

                    {/* Tip box */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 mb-6">
                        <div className="flex items-start gap-2">
                            <SafeIcon name="Lightbulb" className="h-5 w-5 text-yellow-300 shrink-0 mt-0.5" />
                            <p className="text-sm text-white/95">{personalizedMsg.tip}</p>
                        </div>
                    </div>

                    {/* Action button */}
                    <Button
                        onClick={() => setIsOpen(false)}
                        className="w-full bg-white text-gray-900 hover:bg-white/90 font-semibold py-6 text-lg rounded-xl shadow-lg"
                    >
                        <SafeIcon name="Zap" className="h-5 w-5 mr-2" />
                        Mulai Bekerja!
                    </Button>

                    {/* User info footer */}
                    <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <SafeIcon name="User" className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-medium text-sm">{profile.name}</p>
                            <p className="text-xs text-white/70">{roleDisplay} • {profile.email}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
