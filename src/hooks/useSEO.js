import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function useSEO({ title, description, canonical, schema }) {
  const location = useLocation()

  // Si no se pasa canonical explícito, usar la URL actual
  const canonicalUrl = canonical || `https://www.agendaya.online${location.pathname}`

  useEffect(() => {
    document.title = title

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.content = description

    // Canonical — dinámico basado en la URL actual
    let linkCanonical = document.querySelector('link[rel="canonical"]')
    if (!linkCanonical) {
      linkCanonical = document.createElement('link')
      linkCanonical.rel = 'canonical'
      document.head.appendChild(linkCanonical)
    }
    linkCanonical.href = canonicalUrl

    // JSON-LD schema — usa data-page para identificarlo y limpiarlo
    if (schema) {
      let scriptLD = document.querySelector('script[type="application/ld+json"][data-page]')
      if (!scriptLD) {
        scriptLD = document.createElement('script')
        scriptLD.type = 'application/ld+json'
        scriptLD.setAttribute('data-page', 'true')
        document.head.appendChild(scriptLD)
      }
      scriptLD.textContent = JSON.stringify(schema)
    }

    return () => {
      const scriptLD = document.querySelector('script[type="application/ld+json"][data-page]')
      if (scriptLD) scriptLD.remove()
    }
  }, [title, description, canonicalUrl, schema]) // eslint-disable-line
}
