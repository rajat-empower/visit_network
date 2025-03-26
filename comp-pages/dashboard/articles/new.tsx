import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PageTitle from '@/components/PageTitle';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { slugify } from '@/utils/slugify';

type FormValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  seoKeyword: string;
  metaTitle: string;
  metaDescription: string;
  customGpt: string;
  openRouterApiKey: string;
  llmModel: string;
  customPrompt: string;
  sitemap: string;
};

const NewArticlePage: React.FC = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      seoKeyword: '',
      metaTitle: '',
      metaDescription: '',
      customGpt: '',
      openRouterApiKey: '',
      llmModel: '',
      customPrompt: '',
      sitemap: '',
    }
  });

  const onSubmit = (data: FormValues) => {
    console.log('Submitting article:', data);
    // Handle form submission
  };

  // Auto-generate slug from title
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title') {
        const newSlug = slugify(value.title || '');
        form.setValue('slug', newSlug);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="space-y-6">
<h1 className="text-2xl font-bold">Create Article</h1>
      <PageTitle
        title="Create New Article"
        description="Create and manage travel articles"
      />

      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="ai">AI Prompting</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Article Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Best Places to Visit in Dubai..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="best-places-dubai"
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Short preview text for article listings..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Article Content</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="## Detailed travel guide..."
                          rows={12}
                          className="font-mono"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">SEO Optimization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="seoKeyword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Focus Keyword</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="main search term" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <FormLabel>SEO Score</FormLabel>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-green-500"
                              style={{ width: '75%' }}
                            />
                          </div>
                          <span className="text-sm font-medium text-green-600">Good</span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name="metaTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Meta Title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={2}
                              placeholder="Search engine result preview text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai" className="space-y-4">
                <FormField
                  control={form.control}
                  name="customGpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom GPT</FormLabel>
                      <Select>
                        <FormControl>
                          <SelectTrigger {...field}>
                            <SelectValue placeholder="Select a custom GPT" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="custom-prompt">Custom prompt for new Visi.tNetwork article</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="openRouterApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OpenRouter API Key</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="sk-..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="llmModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LLM Model</FormLabel>
                      <Select>
                        <FormControl>
                          <SelectTrigger {...field}>
                            <SelectValue placeholder="Select an LLM" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="gpt-3.5">GPT 3.5</SelectItem>
                          <SelectItem value="claude-sonnet">Claude Sonnet 3.7</SelectItem>
                          <SelectItem value="deepseek-r1">DeepSeek R1</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customPrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Write a detailed travel guide..."
                          rows={6}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sitemap"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sitemap</FormLabel>
                      <Select>
                        <FormControl>
                          <SelectTrigger {...field}>
                            <SelectValue placeholder="Select a sitemap" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tours">Tours</SelectItem>
                          <SelectItem value="places">Places to Stay</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Content to Refer</FormLabel>
                  <div className="flex items-center space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1.5">
                      <p className="text-sm font-medium leading-none">Tours</p>
                      <p className="text-sm text-muted-foreground">Number of pages: [Count]</p>
                    </div>
                    <Checkbox id="tours-checkbox" />
                  </div>
                  <div className="flex items-center space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1.5">
                      <p className="text-sm font-medium leading-none">Places to Stay</p>
                      <p className="text-sm text-muted-foreground">Number of pages: [Count]</p>
                    </div>
                    <Checkbox id="places-checkbox" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard/articles">
                  Cancel
                </Link>
              </Button>
              <Button type="submit">
                Create Article
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewArticlePage;
