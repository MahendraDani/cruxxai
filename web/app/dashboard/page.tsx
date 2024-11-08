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
  // api call to add user to database
  return (
    <div>
      <p>You are authenticated</p>
      <pre>{JSON.stringify(user,null,2)}</pre>
      {isAuth && <LogoutLink >Logout</LogoutLink>}
    </div>
  )
}
