/* eslint-disable @next/next/no-img-element */
import { SignInButton, useUser } from "@clerk/nextjs";
import Head from "next/head";

import { api } from "~/utils/api";



import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";

import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";



const CreatePostWizard = () => {
  const { user } = useUser();

  const ctx = api.useContext()

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0])
      } else {
        toast.error("Failed to post! Try again later.")
      }
    }
  });
  
  const [input, setInput] = useState("");

  // console.log(user);

  if(!user) return null;

  return( 
  <div className="flex gap-3 w-full">
    <Image
    width={56}
    height={56}
    src={user.profileImageUrl} 
    alt="Profile Image"
    className="h-14 w-14 rounded-full" />

    <input 
    placeholder="Type some emojis!" 
    className="grow bg-transparent outline-none"
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}

    onKeyDown={(e) => {
      if(e.key === "Enter"){
        e.preventDefault();
        if(input !== ""){
          mutate({ content: input })
        }
      }
    }}
    disabled={isPosting}
    />

    {input !== "" &&  !isPosting && (
    <button onClick={() => mutate({ content: input })}>Post</button>
    )}

    {isPosting && (
    <div className="flex items-center justify-center">
      <LoadingSpinner size={20}/>
    </div>)}
  </div>)
}


const Feed = () => {
  const {data, isLoading: postsLoading} = api.posts.getAll.useQuery();

  if(postsLoading) return <LoadingPage />

  if(!data) return <div>Something went wrong</div>

  return (
    <div className="flex flex-col">
            {data?.map((fullPost) => (
                <PostView {...fullPost} key={fullPost.post.id}/>
            ))}
          </div>
  )
}

export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  //start fetching data asap
  api.posts.getAll.useQuery();

  //Return empty div if user isn't loaded yet
  if(!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>Chirp</title>
        <meta name="description" content="💭" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <div className="flex border-b border-slate-200 p-4">
        {!isSignedIn && <div className="flex justify-center"><SignInButton /></div>}
        {isSignedIn && <CreatePostWizard />}
        </div>

          <Feed />
      </PageLayout>
    </>
  );
}
