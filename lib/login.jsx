import { fireApp } from "@/importnat/firebase";
import { collection, getDocs } from "firebase/firestore";
import { comparePassword } from "./encryption";

export const loginAccount = async(data)=>{
    const { log_username, log_password } = data;
    const collectionSnap = await getDocs(collection(fireApp, "accounts"));

    let status = false;
    let userId = "";

    collectionSnap.forEach((credential)=>{
        const data = credential.data();
        userId = credential.id
        const { username, password, mySalt } = data;

        if ( log_username === username ) {
            const passwordsMatch = comparePassword(log_password, password, mySalt);

            if (passwordsMatch) {
                status = true;
            }
        }
    });
    return {status, userId};
}