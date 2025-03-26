import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../integrations/supabase/blogPosts';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WeatherWidget from '../components/WeatherWidget';
import PageTitle from '@/components/PageTitle';

const BlogPostTemplate: React.FC = () => {
  const { title } = useParams<{ title: string }>();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('title', decodeURIComponent(title.replace(/-/g, ' ')))
          .single();

        if (error) {
          console.error('Error fetching blog post:', error);
        } else {
          setBlogPost(data);
        }
      } catch (error) {
        console.error('Unexpected error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [title]);

  if (loading) {
    return (
      <div>
        <PageTitle title="Loading Blog Post" description="Please wait while we load the blog post" />
        <div>Loading...</div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div>
        <PageTitle title="Blog Post Not Found" description="The requested blog post could not be found" />
        <div>Blog post not found</div>
      </div>
    );
  }

  return (
    <div>
      <PageTitle title={blogPost.title} description={blogPost.excerpt} />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <article className="blog-post-content">
              <h1 className="text-3xl font-bold mb-4">{blogPost.title}</h1>
              <p className="text-gray-600 mb-4">{blogPost.excerpt}</p>
              {blogPost.featured_image && (
                <img
                  src={blogPost.featured_image}
                  alt={`Featured image for ${blogPost.title}`}
                  className="w-full h-auto mb-4"
                />
              )}
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />
            </article>
          </div>
          <aside className="sidebar">
            <h2 className="text-xl font-bold mb-4">About the Author</h2>
            <p className="text-gray-600 mb-4">Author details here...</p>
            <WeatherWidget />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostTemplate;
