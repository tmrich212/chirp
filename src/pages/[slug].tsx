/* eslint-disable @next/next/no-img-element */
import type { GetStaticProps,NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";


const ProfileFeed = (props: { userId: string }) => {
  const {data, isLoading} = api.posts.getPostsByUserId.useQuery({ userId: props.userId})

  if(isLoading) return <LoadingPage />
  if(!data || data.length === 0) return <div>User has not posted</div> 

  return (
  <div className="flex flex-col">
    {data.map((fullPost) => (
     <PostView {...fullPost} key={fullPost.post.id} />
    ))}
  </div>)
}

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if(!data) return <div>404</div>
  console.log(username)

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="h-36 border-slate-200 bg-slate-600 relative">
          <Image 
          src={data.profileImageUrl} 
          alt={`${data.username} profile image`}
          width={128}
          height={128}
          className="-mb-[64px] absolute bottom-0 left-0 ml-4 rounded-full border-4 border-black bg-black"
           />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${data.username}`}</div>
        <div className="w-full border-b border-slate-200"></div>
        <ProfileFeed userId={data.id}/>
      </PageLayout>
    </>
  );
}

import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from "~/server/api/root";
import superjson from 'superjson';
import { prisma } from "~/server/db";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postview";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  const slug = context.params?.slug;
  if(typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "")

  await ssg.profile.getUserByUsername.prefetch({ username: slug })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  }
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking"
  }
}
 export default ProfilePage;