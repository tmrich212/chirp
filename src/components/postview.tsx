import type { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
    const {post, author} = props;
  
    return (
      <div key={post.id} className="border-b border-slate-200 p-4 gap-3 flex">
        <Image
        src={author.profileImageUrl} 
        alt="Profile Image" 
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
        />
        <div className="flex flex-col">
          <div className="flex text-slate-200 font-thin gap-2">
            <Link href={`/@${author.username}`}>
              <span className="font-bold">{`@${author.username}`}</span>
            </Link>
            <Link href={`/post/${post.id}`}>
              <span>{`· ${dayjs(
                post.createdAt
                ).fromNow()}`}</span>
            </Link>
          </div>
          <span className="text-2xl">{post.content}</span>
        </div>
    </div>
    )
  }