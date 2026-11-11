export function BrandMark({ className }: { className?: string }): React.ReactNode {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path
        fillRule="evenodd"
        d="M3 0h4a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3zM3 2h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z"
      />
      <rect x="3.5" y="3.5" width="3" height="3" rx="1" />
      <path
        fillRule="evenodd"
        d="M17 0h4a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3zM17 2h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z"
      />
      <rect x="17.5" y="3.5" width="3" height="3" rx="1" />
      <path
        fillRule="evenodd"
        d="M3 14h4a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3zM3 16h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z"
      />
      <rect x="3.5" y="17.5" width="3" height="3" rx="1" />
      <rect x="14" y="14" width="4" height="4" rx="1.25" />
      <rect x="20" y="20" width="4" height="4" rx="1.25" />
    </svg>
  );
}
