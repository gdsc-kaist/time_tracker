import { database, auth } from '@/firebaseConfig'
import { ref, set } from "firebase/database";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";

/* API used to communicate with Firebase DB */

// 0. Register / Login / Logout

export async function API_firebase_register(nickname, email, password){
    //console.log(nickname, email, password);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Register Send SUCCESSFUL");
        await updateProfile(auth.currentUser, {
            displayName: nickname,
        });
        console.log("Register SUCCESSFUL");
        return { success: true };
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Register FAILED");
        return { success: false, errorCode, errorMessage };
    }
}

export async function API_firebase_login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Login SUCCESSFUL");
        return { success: true, user };
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Login FAILED");
        return { success: false, errorCode, errorMessage };
    }
}

export async function API_firebase_logout() {
    try {
        await signOut(auth);
        console.log("Logout SUCCESSFUL");
        return true;
    } catch (error) {
        console.log("Logout FAILED");
        return false;
    }
}


// 1. User Registration 
export function API_register(user_id, name){ 
    const db_ref = ref(database, 'users/' + user_id); // database의 users/<user_id>로 접근
    set(db_ref, 
    {
        username: name,
    });
}

export function API_get_ranking(){
}