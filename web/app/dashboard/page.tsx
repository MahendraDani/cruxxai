import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server"
import {LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components"
import { redirect } from "next/navigation";

export default async function Page(){
  const {getUser,isAuthenticated} = getKindeServerSession();
  const isAuth = await isAuthenticated();
  if(!isAuth){
    redirect("/");
  }

  const user = await getUser();
  
  // TODO : Eliminate this, becuase this runs every time when /dashboard is rendered 
  // check if user is already in db
  const res = await fetch(`http://localhost:8787/cruxx/users/${user.id}`);
  const response = await res.json();
  if(!response.user){
    // add user to database
    const res = await fetch(`http://localhost:8787/cruxx/users`,{
      method : "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        id : user.id,
        email : user.email || "",
        firstName : user.given_name || "",
        lastName : user.family_name || "",
        picture : user.picture || "",
      }),

    })
    const response = await res.json();
    console.log(response);
  }

  return (
    <div>
      <p>You are authenticated</p>
      <pre>{JSON.stringify(user,null,2)}</pre>
      {isAuth && <LogoutLink >Logout</LogoutLink>}
    </div>
  )
}
