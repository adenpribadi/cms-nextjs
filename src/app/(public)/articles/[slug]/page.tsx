import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await db.article.findUnique({
    where: { slug }
  });

  if (!article) return {};

  const siteTitle = "Arta Furniture & Craft";
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || 
    article.content.replace(/<[^>]*>/g, '').substring(0, 160) + "...";

  return {
    title: `${title} | ${siteTitle}`,
    description: description,
    keywords: article.seoKeywords,
    openGraph: {
      title: title,
      description: description,
      images: article.coverImage ? [article.coverImage] : [],
      type: 'article',
      publishedTime: article.createdAt.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: article.coverImage ? [article.coverImage] : [],
    }
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await db.article.findUnique({
    where: { slug }
  });

  if (!article || !article.published) {
    notFound();
  }

  return (
    <div className="article-detail">
      <article className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <Link href="/articles" style={{ color: 'var(--accent)', marginBottom: '32px', display: 'inline-block' }}>
            &larr; Kembali ke Daftar Artikel
          </Link>
          
          <span style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            {new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <h1 className="font-heading" style={{ fontSize: '3rem', marginBottom: '40px', lineHeight: 1.2 }}>{article.title}</h1>
          
          {article.coverImage && (
            <div style={{ width: '100%', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: '40px', boxShadow: 'var(--shadow)' }}>
              <img src={article.coverImage} alt={article.title} style={{ width: '100%', display: 'block' }} />
            </div>
          )}

          <div 
            className="prose"
            style={{ fontSize: '1.2rem', color: 'var(--text-primary)', lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </article>
    </div>
  );
}
