import { database, auth } from '@/firebaseConfig'
import { ref, set, get, update} from "firebase/database";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { SubjectStopWatch } from './components/Subject';


const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const pieChartColors = [
'#1f77b4',
'#ff7f0e',
'#2ca02c',
'#d62728',
'#9467bd',
'#8c564b',
'#e377c2',
'#7f7f7f',
'#bcbd22',
'#17becf'
];

const get_color = (index)=>{
    return pieChartColors[index % pieChartColors.length];
}

/* API used to communicate with Firebase DB */


// 0. Register / Login / Logout

export async function API_firebase_register(nickname, email, password){
    //console.log(nickname, email, password);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Register Send SUCCESSFUL");
        const user = auth.currentUser;
        await updateProfile(user, {
            displayName: nickname,
        });

        const db_ref = ref(database, 'users/' + user.uid); // database의 users/<user_id>로 접근
        set(db_ref, 
        {
            username: user.displayName,
            email : user.email,
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
        const db_ref = ref(database, 'users/' + user.uid); // database의 users/<user_id>로 접근
        update(db_ref, 
        {
            username: user.displayName,
            email : user.email,
        }); 
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

// Get Ranking Data 
export async function API_get_ranking(){
    const user = auth.currentUser;
    const db_ref = ref(database, 'users/'); 
}

// Get Stat Data

export async function API_get_lastweek_stats(year, month, day){
    const seconds = [];
    const labels = [];
    const subjects = [];
    const today = new Date(year, month-1, day);
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (6-i));
        
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1 해줌
        const day = date.getDate();
        
        const data = await API_get_stats(year, month, day);
        if (data) {
            seconds.push(data.seconds);
            labels.push(`${month}/${day}`);
            subjects.push(data.subjects);
            //results.push({ x: `${year}-${month}-${day}`, y: data });
        } else{
            seconds.push(0);
            labels.push(`${month}/${day}`);
            subjects.push(null);
            //results.push({ x: `${year}-${month}-${day}`, y: 0 });
        }
    }

    // Subject Data
    const subject = subjects[6];
    const sub = subject? 
    (
        subject.map(
        (subject, index) => ({
            name: subject.subject, // 과목 이름
            seconds: subject.seconds, 
            color: get_color(index)
        }))
    ):
    (null);

    console.log(sub);
    // return results;
    return {labels: labels, data: seconds , subjects:sub};
}

export async function API_get_stats(year, month, day){ // date : YYYY-MM-DD form string
    console.log(year, month, day);
    const uid = auth.currentUser.uid;
    
    const path = 'users/' + uid + '/data/' + year.toString() + '/' + month.toString() + '/' + day.toString() +'/'
    const db_ref = ref(database, path);

    try {
        const snapshot = await get(db_ref);
        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log("DATA", data);
            return data;
        } else {
            //console.log("No data available");
            return null;
        }
    } catch (error) {
        console.error("Error getting data:", error);
        throw error;
    }
}