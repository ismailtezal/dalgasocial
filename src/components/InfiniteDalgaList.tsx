import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component"
import { ProfileImage } from "./ProfileImage";
import { useSession } from "next-auth/react";
import { VscHeart, VscHeartFilled } from "react-icons/vsc"
import { IconHoverEffect } from "./IconHoverEffect";
import { api } from "~/utils/api";
type Dalga = {
    id: string,
    content: string,
    createdAt: Date,
    likeCount: number,
    likedByMe: boolean,
    user: { id: string; image: string | null; name: string | null }
}

type InfiniteDalgaListProps = {
    isLoading: boolean,
    isError: boolean,
    hasMore: boolean | undefined,
    fetchNewDalgas: () => Promise<unknown>
    dalgas?: Dalga[]
}

export function InfiniteDalgaList({ dalgas, isError, isLoading, fetchNewDalgas, hasMore }: InfiniteDalgaListProps) {
    if (isLoading) return <h1>Yükleniyor...</h1>
    if (isError) return <h1>Hata...</h1>
    if (dalgas == null) return null

    if (dalgas.length === 0 || dalgas == null) {
        return <h2 className="my-4 text-center text-2xl text-gray-500">Dalga Bulunamadı</h2>
    }

    return <ul>
        <InfiniteScroll
            dataLength={dalgas.length}
            next={fetchNewDalgas}
            hasMore={hasMore || false}
            loader={"Yükleniyor..."}
        >
            {dalgas.map((dalga) => {
                return <DalgaCard key={dalga.id} {...dalga} />
            })}
        </InfiniteScroll>
    </ul>
}

const dateTimeFormatter = Intl.DateTimeFormat(undefined, { dateStyle: "short" })

function DalgaCard({ id, user, content, createdAt, likeCount, likedByMe }: Dalga) {

    const trpcUtils = api.useContext()
    const toggleLike = api.dalga.toggleLike.useMutation({
        onSuccess: ({ addedLike }) => {
            const updateData: Parameters<
                typeof trpcUtils.dalga.infiniteFeed.setInfiniteData
            >[1] = (oldData) => {
                if (oldData == null) return;

                const countModifier = addedLike ? 1 : -1;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => {
                        return {
                            ...page,
                            dalgas: page.dalgas.map((dalga) => {
                                if (dalga.id === id) {
                                    return {
                                        ...dalga,
                                        likeCount: dalga.likeCount + countModifier,
                                        likedByMe: addedLike,
                                    };
                                }

                                return dalga;
                            }),
                        };
                    }),
                };

            };
            trpcUtils.dalga.infiniteFeed.setInfiniteData({}, updateData);
        }
    }
    );




    function handleToggleLike() {
        toggleLike.mutate({
            id
        })
    }


    return <li className="flex gap-4 border-b 
    border-slate-800 px-4 text-white py-4">

        <Link href={`/profile/${user.id}`}>
            <ProfileImage className="-z-10" src={user.image} />
        </Link>
        <div className="flex flex-grow flex-col">
            <div className="flex gap-1">
                <Link className="font-bold transition-colors focus-visible:text-blue-700 duration-200 hover:text-blue-400" href={`/profile/${user.id}`}>
                    {user.name}
                </Link>
                <span className="text-slate-500">-</span>
                <span className="text-slate-500">{dateTimeFormatter.format(createdAt)}</span>
            </div>
            <p className="whitespace-pre-wrap">{content}</p>
            <HeartButton onClick={handleToggleLike} isLoading={toggleLike.isLoading} likedByMe={likedByMe} likeCount={likeCount} />
        </div>
    </li>
}

type HeartButtonProps = {
    onClick: () => void,
    isLoading: boolean,
    likedByMe: boolean;
    likeCount: number;
}

function HeartButton({ isLoading, onClick, likedByMe, likeCount }: HeartButtonProps) {
    const session = useSession()
    const HeartIcon = likedByMe ? VscHeartFilled : VscHeart
    if (session.status !== "authenticated") {
        return

    }
    return <button disabled={isLoading} onClick={onClick} className={`group -ml-2 items-center gap-1 self-start flex transition-colors duration-200 ${likedByMe ? "text-red-500" : "text-slate-500 hover:text-red-500 focus-visible:text-red-500"}`}>
        <IconHoverEffect red>
            <HeartIcon className={`transition-colors duration-200 ${likedByMe ? "fill-red-500" : "fill-slate-500 group-hover:fill-red-500"} `} />
        </IconHoverEffect>
        <span>{likeCount}</span>
    </button>
}