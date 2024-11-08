import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server"
import {LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components"

export default async function Page(){
  const {getUser,isAuthenticated} = getKindeServerSession();
  const isAuth = await isAuthenticated();
  if(!isAuth){
    console.log("Not logged in");
  }

  const user = await getUser();
  console.log(user);
  return (
    <div>
      <p>You are authenticated</p>
      <pre>{JSON.stringify(user,null,2)}</pre>
      {isAuth && <LogoutLink>Logout</LogoutLink>}
    </div>
  )
}
