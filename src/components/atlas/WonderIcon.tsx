type IconSource = {
  emoji: string;
  title: string;
  image?: string;
};

/**
 * Renders a wonder's visual: its custom image when it has one (for wonders
 * with no good emoji), otherwise the emoji. Sized by the parent's font-size.
 */
export default function WonderIcon({
  wonder,
  className = "",
}: {
  wonder: IconSource;
  className?: string;
}) {
  if (wonder.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={wonder.image}
        alt={wonder.title}
        className={`inline-block w-[1.2em] h-[1.2em] align-middle ${className}`}
        draggable={false}
      />
    );
  }
  return <span className={className}>{wonder.emoji}</span>;
}
