import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-800 py-5">
      <div className="container mx-auto px-6">
        <div className="flex justify-between">
          <div>
            <h2 className="font-bold">Porfolio</h2>
            <p>Cebu, City</p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="font-bold mb-4">Quick Links</h2>
            <ul className="flex flex-col gap-2">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/projects">Projects</Link></li>
            </ul>
          </div>

          {/* Blog Links */}
          <div>
            <h2 className="font-bold mb-4">Blogs</h2>
            <ul className="flex flex-col gap-2">
              <li><Link href="/">Blog 1</Link></li>
              <li><Link href="/about">Blog 2</Link></li>
              <li><Link href="/projects">Blog 3</Link></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h2 className="font-bold mb-4">Contact Info</h2>
            <ul className="flex flex-col gap-2">
              <li>Phone: <Link href="/">+63 999 9999</Link></li>
              <li>Email: <Link href="/about">email@test.com</Link></li>
              <li><Link href="/projects">Visit Github</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
