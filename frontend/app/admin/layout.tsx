export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="bg-red-300 h-screen">
      <header>Header</header>
      {children}
      <footer>Footer</footer>
    </main>
  );
}
