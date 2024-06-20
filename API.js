import { database } from '@/firebaseConfig'
import { ref, set, onValue } from "firebase/database";

/* API used to communicate with Firebase DB */


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