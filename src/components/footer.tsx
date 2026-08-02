import { Logo } from './logo';

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <Logo className="text-foreground" />
        <p>Secure. Verifiable. Powered by Stellar.</p>
        <p>&copy; {new Date().getFullYear()} StellarTickets</p>
      </div>
    </footer>
  );
}
