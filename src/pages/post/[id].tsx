/* eslint-disable @next/next/no-img-element */
import { type NextPage } from "next";
import Head from "next/head";

const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <main className="flex h-screen justify-center">
       <div>
         Single Post Page
       </div>
      </main>
    </>
  );
}

export default SinglePostPage;
