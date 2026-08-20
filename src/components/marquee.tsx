/** A seamless, CSS-only infinite scroll row — content is duplicated once and translated -50%. */
export function Marquee({
  items,
  reverse = false,
}: {
  items: { label: string; icon?: React.ComponentType<{ className?: string }> }[];
  reverse?: boolean;
}) {
  const track = (keyPrefix: string) => (
    <div className="flex shrink-0 gap-3 pr-3" aria-hidden={keyPrefix === 'dup'}>
      {items.map((item, i) => (
        <span
          key={`${keyPrefix}-${i}`}
          className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm whitespace-nowrap text-muted"
        >
          {item.icon && <item.icon className="h-3.5 w-3.5 text-violet" />}
          {item.label}
        </span>
      ))}
    </div>
  );

  return (
    <div className="mask-fade-x w-full overflow-hidden">
      <div className={`flex w-max ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
        {track('a')}
        {track('dup')}
      </div>
    </div>
  );
}
