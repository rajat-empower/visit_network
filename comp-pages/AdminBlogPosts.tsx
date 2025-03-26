"use client";

function AdminBlogPosts() {
  return (
    <div>AdminBlogPosts</div>
  )
}

export default AdminBlogPosts
/*import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../integrations/supabase/blogPosts";
import PageTitle from "@/components/PageTitle";

export default function AdminBlogPosts() {
    // State management
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [keywords, setKeywords] = useState("");
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const navigate = useRouter();

    // Check if user is authenticated
    useEffect(() => {
        const checkAuth = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                navigate.push("/auth");
            } else {
                setIsAuthenticated(true);
            }
            setCheckingAuth(false);
        };

        checkAuth();
    }, [navigate]);

    // ✅ Handle image upload to Supabase Storage
    async function uploadImage(file: File) {
        if (!isAuthenticated) {
            alert("You must be logged in to upload images");
            return null;
        }

        const filePath = `articles/${file.name}`;

        try {
            const { data, error } = await supabase.storage
                .from("images") // Ensure this matches your bucket name
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: true, // Allow replacing existing files
                });

            if (error) {
                console.error("Error uploading image:", error);
                alert(`Upload failed: ${error.message || "Unknown error"}`);
                return null;
            }

            return data?.path ? `${supabase.storage.from("images").getPublicUrl(filePath).data.publicUrl}` : null;
        } catch (error: any) {
            console.error("Error uploading image:", error);
            alert(`Upload failed: ${error?.message || "Unknown error"}`);
            return null;
        }
    }

    // ✅ Handle form submission
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        if (!isAuthenticated) {
            alert("You must be logged in to add articles");
            setLoading(false);
            navigate.push("/auth");
            return;
        }

        // Ensure all fields are filled
        if (!title || !content || !author) {
            alert("Please fill in all fields.");
            setLoading(false);
            return;
        }

        let imageUrl = null;
        if (featuredImage) {
            imageUrl = await uploadImage(featuredImage);
        }

        // Demo implementation - no actual database insert
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log("Demo mode - Article data:", {
                title,
                content,
                author,
                keywords,
                image_url: imageUrl
            });
            
            alert("Demo mode: Article would be saved in a production environment");
            setTitle("");
            setContent("");
            setAuthor("");
            setKeywords("");
            setFeaturedImage(null);
        } catch (error: any) {
            console.error("Error in demo save:", error);
            alert(`Demo error: ${error?.message || "Unknown error"}`);
        }

        setLoading(false);
    }

    if (checkingAuth) {
        return (
            <div className="p-6 max-w-lg mx-auto">
                <PageTitle title="Checking Authentication" description="Please wait while we verify your credentials" />
                Checking authentication...
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="p-6 max-w-lg mx-auto">
                <PageTitle title="Authentication Required" description="Please log in to access this page" />
                Please log in to access this page.
            </div>
        );
    }

    return (
        <div className="p-6 max-w-lg mx-auto">
            <PageTitle title="Add New Article" description="Create and publish a new blog post" />
            <h2 className="text-xl font-bold mb-4">Add New Article</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="file"
                    onChange={(e) => setFeaturedImage(e.target.files ? e.target.files[0] : null)}
                    className="w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {loading ? "Adding..." : "Add Article"}
                </button>
            </form>
        </div>
    );
}
*/