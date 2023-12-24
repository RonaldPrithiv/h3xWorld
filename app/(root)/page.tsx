import { UserButton } from "@clerk/nextjs";
import { fetchPosts } from "@/lib/actions/post.actions";
import { currentUser } from "@clerk/nextjs";
import PostCard from "@/components/cards/PostCard";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";


export default async function Home() {
  const posts = await fetchPosts(1, 30);
  
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  console.log(posts);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex-col gap-10">
        {posts.posts.length === 0 ? (
          <p className="no-result">...</p>
        ):(
          <>
            {posts.posts.map((post) => (
              <>
              {post.image != null ? (
                <PostCard 
                  key={post._id} 
                  id={post.id} 
                  currentUserId={user.id}
                  parentId={post.parentId}
                  content={post.text}
                  author={post.author}
                  community={post.community}
                  createdAt={post.createdAt}
                  comments={post.children}
                  image={post.image}
                />
              ):(
                <PostCard 
                  key={post._id} 
                  id={post.id} 
                  currentUserId={user.id}
                  parentId={post.parentId}
                  content={post.text}
                  author={post.author}
                  community={post.community}
                  createdAt={post.createdAt}
                  comments={post.children}
                />
                )}
              </>
            ))}
          </>
        )}
      </section>
    </>
  );
}