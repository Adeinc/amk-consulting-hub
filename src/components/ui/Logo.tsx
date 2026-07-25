/**
 * The AMK mark and "Consulting Hub" subtitle as two separately-sized images
 * (split from the client's original logo file) so the subtitle can run bigger
 * relative to the mark than the source artwork's own proportions.
 */
export function Logo({
  amkClassName = "h-9",
  subtitleClassName = "h-4",
  gap = "gap-1",
}: {
  amkClassName?: string;
  subtitleClassName?: string;
  gap?: string;
}) {
  return (
    <span role="img" aria-label="AMK Consulting Hub" className={`inline-flex flex-col items-start ${gap}`}>
      <img src="/logo-amk.png" alt="" className={`${amkClassName} w-auto`} />
      <img src="/logo-subtitle.png" alt="" className={`${subtitleClassName} w-auto`} />
    </span>
  );
}
