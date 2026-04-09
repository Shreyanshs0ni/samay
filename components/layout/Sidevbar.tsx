import Image from 'next/image';
import Link from 'next/link';

const navItems = [
  { name: 'Tracking', href: '/tracking' },
  { name: 'Events', href: '/events' },
  { name: 'Timeline', href: '/timeline' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Settings', href: '/settings' },
];

export function Sidebar() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <Image src="/logo.png" alt="logo" width="50" height="50" className="invert" />
        <h1 className="text-xl font-semibold">SAMAY</h1>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="px-3 py-2 rounded-lg hover:bg-white/10 transition"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
