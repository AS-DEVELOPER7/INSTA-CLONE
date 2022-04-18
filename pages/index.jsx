import React, { useState } from 'react'
import Header from '../components/Header'
import Feed from '../components/Feed'
import Modal from '../components/Modal'
import { useSession } from 'next-auth/react'
import { getProviders, signIn } from 'next-auth/react'
const Home = ({ providers }) => {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  return (
    <div className="h-screen overflow-y-scroll bg-gray-50 scrollbar-hide ">
      <head>
        <title>Instagram-clone</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      {session ? (
        <>
          <Modal open={open} setOpen={setOpen} />
          <Header open={open} setOpen={setOpen} />
          <Feed />
        </>
      ) : (
        <>
          <div className="-mt-32 flex min-h-screen flex-col items-center justify-center py-2 px-14 text-center">
            <img
              className="w-80"
              src="https://links.papareact.com/ocw"
              alt=""
            />
            <p className="font-xs italic">
              This is not a REAL app, it is built for personal project only
            </p>
            <div className="mt-40">
              {Object.values(providers).map((provider) => (
                <div key={provider.name}>
                  <button
                    className="rounded-lg bg-blue-500 p-3 text-white"
                    onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                  >
                    Sign in with {provider.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Home
export async function getServerSideProps(context) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}
