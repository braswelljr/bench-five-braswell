import { useEffect, useRef, useState } from 'react'
import useIsomorphicLayoutEffect from '~/hooks/useIsomorphicLayoutEffect'

function update() {
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark', 'changing-theme')
  } else {
    document.documentElement.classList.remove('dark', 'changing-theme')
  }
  window.setTimeout(() => {
    document.documentElement.classList.remove('changing-theme')
  })
}

/**
 * useTheme hook - to determine and switch theme
 * @returns {string} theme (theme) - system | light | dark.
 * @returns {Function} setTheme - used to set | update the theme
 */
export default function useTheme() {
  const [theme, setTheme] = useState('system')
  const initial = useRef(true)

  useIsomorphicLayoutEffect(() => {
    const theme: string = localStorage.theme
    if (theme === 'light' || theme === 'dark') {
      setTheme(theme)
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (theme === 'system') {
      localStorage.removeItem('theme')
    } else if (theme === 'light' || theme === 'dark') {
      localStorage.theme = theme
    }
    if (initial.current) {
      initial.current = false
    } else {
      update()
    }
  }, [theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener('change', update)
    } else {
      mediaQuery.addListener(update)
    }

    function onStorage() {
      update()
      const theme = localStorage.theme
      if (theme === 'light' || theme === 'dark') {
        setTheme(theme)
      } else {
        setTheme('system')
      }
    }
    window.addEventListener('storage', onStorage)

    return () => {
      if (mediaQuery?.removeEventListener) {
        mediaQuery.removeEventListener('change', update)
      } else {
        mediaQuery.removeListener(update)
      }

      window.removeEventListener('storage', onStorage)
    }
  }, [])

  return { theme, setTheme } as const
}
