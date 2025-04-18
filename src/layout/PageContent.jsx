export default function PageContent({ children }) {
  return (
    <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-theme(spacing.32))]">
      {children}
    </main>
  );
}