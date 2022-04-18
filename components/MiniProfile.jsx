import { signOut, useSession } from 'next-auth/react'


const MiniProfile = () => {
  const { data: session } = useSession()
  console.log(session)
  return (
    <div className="mt-14 ml-10 flex items-center justify-between ">
      <img
        className="h-16 w-16 rounded-full border p-[2px]"
        src={session?.user.image}
        alt=""
      />
      <div className="mx-4 flex-1">
        <h2 className="font-bold">{session?.user.username}</h2>
        <h3 className="text-gray text-sm">Welcome to Instagram</h3>
      </div>
      <button className="text-sm font-semibold text-blue-400" onClick={()=>signOut({callbackUrl:'/auth/signin'})}>
        Sign Out
      </button>
    </div>
  )
}

export default MiniProfile
