import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { VscHome, VscPerson, VscSignIn, VscSignOut } from "react-icons/vsc";

export function SideNav() {
    const session = useSession()
    const user = session.data?.user
    return <nav className="sticky text-white top-0 px-2 py-4">
        <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
            <li className="hover:bg-slate-800 rounded-full w-full">
                <Link href="/">
                    <div className="hover:bg-slate-800 rounded-full p-2">
                        <span className=" flex items-center gap-4">
                            <VscHome className="h-6 w-6" />
                            <span className="hidden text-md md:inline">
                                Ana Sayfa
                            </span>
                        </span>
                    </div>
                </Link>
            </li>
            {/*user != null && (
                <li className="hover:bg-slate-800 rounded-full w-full">
                    <Link href={`/profile/${user.id}`}>
                        <div className="hover:bg-slate-800 rounded-full p-2">
                            <span className="flex items-center gap-4">
                                <VscPerson className="h-6 w-6" />
                                <span className="hidden text-md md:inline">
                                    Profil
                                </span>
                            </span>
                        </div>
                    </Link>
                </li>
            )*/}
            {user == null ? (
                <li className="hover:bg-slate-800 rounded-full w-full">
                    <button onClick={() => signIn()}>
                        <div className="hover:bg-slate-800 rounded-full p-2">
                            <span className=" flex items-center gap-4">
                                <VscSignIn className="h-6 w-6" />
                                <span className="hidden text-md md:inline">
                                    Giriş Yap
                                </span>
                            </span>
                        </div>
                    </button>
                </li>
            ) : (
                <li className="hover:bg-slate-800 rounded-full w-full">
                    <button onClick={() => signOut()}>
                        <div className="hover:bg-slate-800 rounded-full p-2">
                            <span className=" flex items-center gap-4">
                                <VscSignOut className="h-6 w-6" />
                                <span className="hidden text-md md:inline">
                                    Çıkış Yap
                                </span>
                            </span>
                        </div>
                    </button>
                </li>
            )}
        </ul>
    </nav>
}