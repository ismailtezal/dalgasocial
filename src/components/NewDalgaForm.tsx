import { useSession } from "next-auth/react";
import { Button } from "~/components/Button";
import { ProfileImage } from "~/components/ProfileImage";
import { useState, useLayoutEffect, useRef, useCallback, FormEvent } from "react"
import { api } from "~/utils/api";


function updateTextAreSize(textArea?: HTMLTextAreaElement) {
    if (textArea == null) return
    textArea.style.height = "0"
    textArea.style.height = `${textArea.scrollHeight}px`
}

export function NewDalgaForm() {
    const session = useSession()

    if (session.status !== "authenticated") return

    return <Form />
}


function Form() {
    const session = useSession()
    const [inputValue, setInputValue] = useState("")
    const textAreaRef = useRef<HTMLTextAreaElement>()
    const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
        updateTextAreSize(textArea)
        textAreaRef.current = textArea
    }, [])

    const trpcUtils = api.useContext();

    useLayoutEffect(() => {
        updateTextAreSize(textAreaRef.current)
    }, [inputValue])



    const createDalga = api.dalga.create.useMutation({
        onSuccess: newDalga => {
            setInputValue("");
            if (session.status !== "authenticated") return;

            trpcUtils.dalga.infiniteFeed.setInfiniteData({}, (oldData) => {
                if (oldData == null || oldData.pages[0] == null) return;

                const newCacheDalga = {
                    ...newDalga,
                    likeCount: 0,
                    likedByMe: false,
                    user: {
                        id: session.data.user.id,
                        name: session.data.user.name || null,
                        image: session.data.user.image || null,
                    },
                };

                return {
                    ...oldData,
                    pages: [
                        {
                            ...oldData.pages[0],
                            dalgas: [newCacheDalga, ...oldData.pages[0].dalgas],
                        },
                        ...oldData.pages.slice(1),
                    ],
                };
            });
        },
    })

    if (session.status !== "authenticated") return null;

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        createDalga.mutate({ content: inputValue })


    }

    return <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-b border-slate-800 px-4 py-2">
        <div className="flex gap-4">
            <ProfileImage className="ring-4" src={session.data.user.image} />
            <textarea
                ref={inputRef}
                style={{ height: 0 }}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Dalga geç gitsin!"
                className={`flex-grow bg-[#101010] text-white rounded-sm 
            resize-none overflow-hidden p-4 text-lg outline-none`} />
        </div>
        <Button className="self-end"></Button>
    </form>
}