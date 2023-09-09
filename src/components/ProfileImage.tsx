import Image from "next/image"

type ProfileImageProps = {
    src?: string | null
    className?: string
}

export function ProfileImage({ src, className = "" }: ProfileImageProps) {
    return <div className={`relative ring-blue-600 ring-2 h-12 w-12 overflow-hidden rounded-full ${className}`}>
        {src == null ? null : <Image src={src} alt="Profile Image" quality={100}
            fill />}
    </div>
} 