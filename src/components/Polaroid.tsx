export default function Polaroid({
  children,
  caption,
  tape,
  className = "",
  style,
}: {
  children: React.ReactNode;
  caption?: string;
  tape?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <figure className={`polaroid ${className}`} style={style}>
      {tape && <span className="tape" />}
      <div className="photo">{children}</div>
      {caption && <figcaption className="cap hand">{caption}</figcaption>}
    </figure>
  );
}
