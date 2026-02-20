import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import TrackablePhoneLink from "@/components/TrackablePhoneLink";
import { blogPosts, categories, type BlogPost } from "@/data/blogPosts";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    let posts = blogPosts;

    // Filter by category
    if (selectedCategory !== "All Posts") {
      posts = posts.filter(post => post.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    return posts;
  }, [selectedCategory, searchQuery]);

  const featuredPost = blogPosts.find(post => post.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <Helmet>
        <title>Foreclosure Prevention Blog | Expert Guidance for Texas Homeowners</title>
        <meta name="description" content="Expert foreclosure prevention advice, actionable guides, and real-world strategies to help Texas homeowners avoid foreclosure and protect their homes." />
        <meta property="og:title" content="Foreclosure Prevention Blog | Expert Guidance for Texas Homeowners" />
        <meta property="og:description" content="Expert foreclosure prevention advice, actionable guides, and real-world strategies to help Texas homeowners avoid foreclosure." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src="/enteractdfw-logo.png" alt="EnterActDFW" className="h-10" />
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/knowledge-base">
                <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  Knowledge Base
                </span>
              </Link>
              <Link href="/blog">
                <span className="text-sm font-medium text-primary transition-colors cursor-pointer">
                  Blog
                </span>
              </Link>
              <Link href="/resources">
                <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  Resources
                </span>
              </Link>
              <Link href="/faq">
                <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  FAQ
                </span>
              </Link>
              <Button variant="outline" size="sm" asChild>
                <TrackablePhoneLink phoneNumber="832-346-9569" showIcon>
                  Call Now
                </TrackablePhoneLink>
              </Button>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
          <div className="container max-w-6xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Foreclosure Prevention Blog
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Expert guidance, actionable strategies, and real-world advice to help Texas homeowners avoid foreclosure and protect their homes.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles by keyword, topic, or tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-6 border-b bg-muted/20">
          <div className="container max-w-6xl">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && selectedCategory === "All Posts" && !searchQuery && (
          <section className="py-12 bg-muted/10">
            <div className="container max-w-6xl">
              <div className="mb-6">
                <Badge variant="default" className="mb-2">Featured Article</Badge>
                <h2 className="text-2xl font-bold text-foreground">Must-Read Guide</h2>
              </div>
              <Card className="overflow-hidden border-2 border-primary hover:shadow-xl transition-shadow">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto">
                    <img
                      src={featuredPost.featuredImage}
                      alt={featuredPost.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="secondary">{featuredPost.category}</Badge>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(featuredPost.publishedDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {featuredPost.readTime}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      {featuredPost.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {featuredPost.excerpt}
                    </p>
                    <div>
                      <Button asChild size="lg">
                        <Link href={`/blog/${featuredPost.slug}`}>
                          <span className="flex items-center gap-2">
                            Read Full Article
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="py-12">
          <div className="container max-w-6xl">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground mb-4">
                  No articles found matching your search.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Posts");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    {selectedCategory === "All Posts" ? "All Articles" : selectedCategory}
                    <span className="text-muted-foreground font-normal ml-2">
                      ({filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"})
                    </span>
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </span>
                        </div>
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          <Link href={`/blog/${post.slug}`}>
                            <span className="cursor-pointer">{post.title}</span>
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.publishedDate)}
                          </span>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/blog/${post.slug}`}>
                              <span className="flex items-center gap-1">
                                Read More
                                <ArrowRight className="h-4 w-4" />
                              </span>
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-gradient-to-b from-background to-primary/5">
          <div className="container max-w-4xl">
            <Card className="border-2 border-primary shadow-lg">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Need Immediate Help with Foreclosure?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Don't wait until it's too late. Contact EnterActDFW for a free consultation and learn your options to avoid foreclosure.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" asChild>
                    <TrackablePhoneLink phoneNumber="832-346-9569" showIcon>
                      Call (832) 346-9569 Now
                    </TrackablePhoneLink>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/timeline-calculator">
                      <span>Calculate Your Timeline</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-muted/30 py-12">
          <div className="container">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <img src="/enteractdfw-logo.png" alt="EnterActDFW" className="h-10 mb-4" />
                <p className="text-sm text-muted-foreground">
                  Licensed Texas real estate brokerage specializing in foreclosure prevention and distressed property solutions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/knowledge-base"><span className="hover:text-primary cursor-pointer">Knowledge Base</span></Link></li>
                  <li><Link href="/blog"><span className="hover:text-primary cursor-pointer">Blog</span></Link></li>
                  <li><Link href="/timeline-calculator"><span className="hover:text-primary cursor-pointer">Timeline Calculator</span></Link></li>
                  <li><Link href="/resources"><span className="hover:text-primary cursor-pointer">Free Resources</span></Link></li>
                  <li><Link href="/faq"><span className="hover:text-primary cursor-pointer">FAQ</span></Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/about"><span className="hover:text-primary cursor-pointer">About Us</span></Link></li>
                  <li><Link href="/success-stories"><span className="hover:text-primary cursor-pointer">Success Stories</span></Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Contact</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>(832) 346-9569</li>
                  <li>info@enteractdfw.com</li>
                  <li>4400 State Hwy 121, Suite 300</li>
                  <li>Lewisville, TX 75056</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
