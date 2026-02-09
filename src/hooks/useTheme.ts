import {useCallback, useEffect, useState} from 'react'

type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'

function getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(resolved: 'light' | 'dark') {
    document.documentElement.classList.toggle('dark', resolved === 'dark')
}

function getStoredTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (stored === 'light' || stored === 'dark') return stored

    return 'system'
}

export default function useTheme() {
    const [theme, setTheme] = useState<Theme>(getStoredTheme)

    const resolved = theme === 'system' ? getSystemTheme() : theme

    useEffect(() => {
        applyTheme(resolved)
    }, [resolved])

    useEffect(() => {
        if (theme !== 'system') return

        const mq = window.matchMedia('(prefers-color-scheme: dark)')

        const handler = () => applyTheme(getSystemTheme())

        mq.addEventListener('change', handler)

        return () => mq.removeEventListener('change', handler)
    }, [theme])

    const toggle = useCallback(() => {
        setTheme(prev => {
            const next = (prev === 'system' ? getSystemTheme() : prev) === 'dark' ? 'light' : 'dark'

            localStorage.setItem(STORAGE_KEY, next)

            return next
        })
    }, [])

    return {theme, resolved, toggle} as const
}
