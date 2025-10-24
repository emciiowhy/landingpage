// app/blogs/page.tsx (continued)
// Blogs listing page - Currently empty but ready for future content

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="section-container">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blogs</h1>
          <p className="text-lg text-gray-600 mb-12">
            Welcome to the blog section! Stay tuned for updates, articles, and insights.
          </p>

          {/* Empty State */}
          <div className="bg-white rounded-2xl p-12 md:p-16 shadow-sm border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">📝</div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900">
                No blog posts available yet. Check back soon!
              </h2>
              <p className="text-gray-600">
                I'm currently working on some exciting content. Subscribe to my newsletter 
                or follow me on social media to get notified when new posts are published.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}