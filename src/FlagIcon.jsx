const sharedProps = {
  viewBox: '0 0 24 16',
  width: 24,
  height: 16,
  focusable: 'false',
  'aria-hidden': 'true',
}

export function FlagIcon({ code, className = '' }) {
  const props = { ...sharedProps, className: `flag-icon ${className}`.trim() }

  if (code === 'nl') {
    return (
      <svg {...props}>
        <rect width="24" height="16" fill="#fff" />
        <rect width="24" height="5.34" fill="#ae1c28" />
        <rect y="10.66" width="24" height="5.34" fill="#21468b" />
      </svg>
    )
  }

  if (code === 'de') {
    return (
      <svg {...props}>
        <rect width="24" height="16" fill="#dd0000" />
        <rect width="24" height="5.34" fill="#000" />
        <rect y="10.66" width="24" height="5.34" fill="#ffce00" />
      </svg>
    )
  }

  if (code === 'fr') {
    return (
      <svg {...props}>
        <rect width="24" height="16" fill="#fff" />
        <rect width="8" height="16" fill="#0055a4" />
        <rect x="16" width="8" height="16" fill="#ef4135" />
      </svg>
    )
  }

  if (code === 'lb') {
    return (
      <svg {...props}>
        <rect width="24" height="16" fill="#fff" />
        <rect width="24" height="5.34" fill="#ef3340" />
        <rect y="10.66" width="24" height="5.34" fill="#00a3e0" />
      </svg>
    )
  }

  if (code === 'en') {
    return (
      <svg {...props}>
        <rect width="24" height="16" fill="#012169" />
        <path d="M0 0 24 16M24 0 0 16" stroke="#fff" strokeWidth="4" />
        <path d="M0 0 24 16M24 0 0 16" stroke="#c8102e" strokeWidth="1.7" />
        <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="5" />
        <path d="M12 0v16M0 8h24" stroke="#c8102e" strokeWidth="2.7" />
      </svg>
    )
  }

  return (
    <svg {...props}>
      <rect width="24" height="16" fill="#fff" />
      <path d="M10.3 0h3.4v6.3H24v3.4H13.7V16h-3.4V9.7H0V6.3h10.3Z" fill="#ff0000" />
      <path d="M4.25 1.25h1.5v1.5h1.5v1.5h-1.5v1.5h-1.5v-1.5h-1.5v-1.5h1.5Zm14 0h1.5v1.5h1.5v1.5h-1.5v1.5h-1.5v-1.5h-1.5v-1.5h1.5Zm-14 9h1.5v1.5h1.5v1.5h-1.5v1.5h-1.5v-1.5h-1.5v-1.5h1.5Zm14 0h1.5v1.5h1.5v1.5h-1.5v1.5h-1.5v-1.5h-1.5v-1.5h1.5Z" fill="#ff0000" />
    </svg>
  )
}
