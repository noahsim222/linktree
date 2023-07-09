"use client"
import { useDebounce } from "@/Local Hooks/useDebounce";
import fetchExistingCredentials from "@/lib/fetchExistingCredentials";
import { loginAccount } from "@/lib/login";
import { setSessionCookie } from "@/lib/session";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaCheck, FaEye, FaEyeSlash, FaX } from "react-icons/fa6"

export default function LoginForm() {
    const router = useRouter();
    const [seePassord, setSeePassord] = useState(true);
    const [username, setUsername]= useState("");
    const [existingUsernames, setExistingUsernames] = useState([]);
    const [password, setPassword]= useState("");
    const debouncepassword = useDebounce(username, 500);
    const [canProceed, setCanProceed] = useState(false);
    const [hasError, setHasError]= useState({
            username: 0,
            password: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async(e) =>{
        setIsLoading(true);
        e.preventDefault();
        if (canProceed && !isLoading) {
            const data = {
                log_username: username,
                log_password: password,
            }

            const status = await loginAccount(data);
            if (!status.status) {
                setHasError({ ...hasError, password: 1 });
                setIsLoading(false);
                setPassword("")
                setErrorMessage("You entered an `Incorrect passord`!");
                toast.error("Invalid Login credentials!");
                return;
            }
            
            toast.success(`Login Successfull`);
            setSessionCookie("adminLinker", `${status.userId}`, (60*5));
            
            setTimeout(() => {
                setIsLoading(false);
                router.push("/dashboard");
            }, 1000);
        }
    }

    useEffect(()=>{
        async function fetchData() {
            const fetchData = fetchExistingCredentials;
            const data = await fetchData();

            setExistingUsernames(data[1]);
        }
        
        fetchData();
    }, []);

    useEffect(()=>{
        if(username !== "") {
            if(!existingUsernames.includes(String(username).toLowerCase())){
                setHasError({...hasError, username: 1});
                setErrorMessage("This username is not registered to any user.");
                return;
            }
            
            setHasError({...hasError, username: 2});
            return;

        }else{
            setHasError({...hasError, username: 0});
        }
    }, [debouncepassword, existingUsernames]);

    useEffect(()=>{
        if(password !== "") {
            setHasError({...hasError, password: 2});
            return;
        }else{
            setHasError({...hasError, password: 0});
        }

    }, [password]);

    useEffect(()=>{
        if (hasError.username === 1) {
            setCanProceed(false);
            return;
        }
        
        if (hasError.password === 1) {
            setCanProceed(false);
            return;
        }

        setCanProceed(true);
    }, [hasError]);
    
    return (
        <div className="flex-1 sm:p-12 p-8 flex flex-col">
            <Link href={'/'}>
                <Image src={"https://linktree.sirv.com/Images/full-logo.svg"} alt="logo" height={150} width={100} className="w-[7.05rem]" />
            </Link>
            <section className="mx-auto py-10 w-full sm:w-5/6 md:w-3/4 lg:w-2/3 xl:w-1/2 flex-1 flex flex-col justify-center">
                <p className="text-2xl sm:text-5xl font-extrabold text-center">Log in to your Linktree</p>
                <form className="py-8 sm:py-12 flex flex-col gap-4 sm:gap-6 w-full" onSubmit={handleSubmit}>
                    <div className={`flex items-center py-2 sm:py-3 px-4 sm:px-6 rounded-md myInput ${hasError.username === 1 ? "hasError" : hasError.username === 2 ? "good" : ""} bg-black bg-opacity-5 text-base sm:text-lg w-full`}>
                        <label className="opacity-40">mylinktree/</label>
                        <input
                            type="text"
                            placeholder="fabiconcept"
                            className="outline-none border-none bg-transparent ml-1 py-3 flex-1 text-sm sm:text-base"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        {hasError.username === 1 ?
                            <FaX className="text-red-500 text-sm cursor-pointer" onClick={() => setUsername("")} />
                            :
                            hasError.username === 2 ?
                                <FaCheck className="text-themeGreen cursor-pointer" />
                                :
                                ""
                        }
                    </div>
                    <div className={`flex items-center relative py-2 sm:py-3 px-4 sm:px-6 rounded-md  ${hasError.password === 1 ? "hasError": hasError.password === 2 ? "good" : ""} bg-black bg-opacity-5 text-base sm:text-lg myInput`}>
                        <input
                            type={`${seePassord ? "password": "text"}`}
                            placeholder="Password"
                            className="peer outline-none border-none bg-transparent py-3 ml-1 flex-1 text-sm sm:text-base"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            required
                        />
                        {seePassord && <FaEyeSlash className="opacity-60 cursor-pointer" onClick={()=>setSeePassord(!seePassord)} />}
                        {!seePassord && <FaEye className="opacity-60 cursor-pointer text-themeGreen" onClick={()=>setSeePassord(!seePassord)} />}
                    </div>

                    <button type="submit" className="rounded-md py-4 sm:py-5 grid place-items-center bg-themeGreen mix-blend-screen font-semibold cursor-pointer active:scale-95 active:opacity-40 hover:scale-[1.025]">
                        {!isLoading && <span className="nopointer">submit</span>}
                        {isLoading && <Image src={"https://linktree.sirv.com/Images/gif/loading.gif"} width={25} height={25} alt="loading" className=" mix-blend-screen" />}
                    </button>

                    {!canProceed && <span className="text-sm text-red-500 text-center">{errorMessage}</span>}
                </form>
                <p className="text-center"><span className="opacity-60">Don&apos;t have an account?</span> <Link href={"/signup"} className="text-themeGreen">Sign up</Link> </p>
            </section>

        </div>
    )
}