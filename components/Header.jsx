import React from 'react'
import Image from 'next/image'
import {
  HeartIcon,
  MenuIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
  SearchIcon,
  UserGroupIcon,
} from '@heroicons/react/outline'
import { HomeIcon } from '@heroicons/react/solid'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRecoilState } from 'recoil'
import { modalState } from '../atoms/modelAtom'
const Header = ({ open, setOpen }) => {
  const { data: session } = useSession()
  console.log(session)
  // const [open,setOpen]=useRecoilState(modalState)
  return (
    <div className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-5 flex max-w-6xl justify-between lg:mx-auto">
        {/* Left */}
        <div className="relative hidden w-24 cursor-pointer lg:inline-flex">
          <Image
            src="https://links.papareact.com/ocw"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="relative w-8 flex-shrink-0 cursor-pointer lg:hidden">
          <Image
            src="https://links.papareact.com/jjm"
            layout="fill"
            objectFit="contain"
          />
        </div>
        {/* Middle */}
        <div className="relative mt-1 rounded-md p-3 ">
          <div className="pointer-events-none absolute inset-y-0  flex items-center pl-3">
            <SearchIcon className="h-5 w-5 text-gray-500" />
          </div>
          <input
            className="bg-gary-50 block w-full rounded-md  border-gray-300 pl-10 focus:border-black focus:ring-black sm:text-sm"
            type="text"
            placeholder="Search"
          />
        </div>
        {/* Right */}
        <div className="flex items-center justify-end space-x-4 ">
          <HomeIcon className="navBtn" />
          {/* <MenuIcon className="h-10 cursor-pointer md:hidden" /> */}
          {session ? (
            <>
              <PaperAirplaneIcon className="navBtn" />
              <PlusCircleIcon
                className="h-[4.5em] md:h-6 cursor-pointer transition-all duration-150 ease-out hover:scale-125"
                onClick={() => setOpen(true)}
              />
              <UserGroupIcon className="navBtn" />
              <HeartIcon className="navBtn" />
              <img
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                src={session.user.image}
                alt=""
                className="h-10 w-10 cursor-pointer rounded-full"
              />
            </>
          ) : (
            <button onClick={signIn}>Sign In</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
