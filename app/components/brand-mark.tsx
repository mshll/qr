export function BrandMark({ className }: { className?: string }): React.ReactNode {
  return (
    <svg viewBox="0 0 7 7" aria-hidden className={className} fill="currentColor">
      <path fillRule="evenodd" d="M0 0h7v7H0zM1 1v5h5V1z" />
      <path d="M2 2h3v3H2z" />
    </svg>
  );
}
