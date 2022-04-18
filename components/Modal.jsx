import { Dialog, Transition } from '@headlessui/react'
import { CameraIcon } from '@heroicons/react/outline'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { useSession } from 'next-auth/react'
import React, { Fragment, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { modalState } from '../atoms/modelAtom'
import {db,storage}from'../firebase'

const Modal = ({ open, setOpen }) => {
  // const [open, setOpen] = useRecoilState(modalState)
  const captionRef = useRef(null)
  const filePickerRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading,setLoading]=useState(false)
  const {data:session}=useSession()
const uploadPost=async()=>{
  if(loading)return
  setLoading(true)

// 1) create a post and add to firebase 'posts'collection

const docRef=await addDoc(collection(db,'posts'),{
username:session.user.username,
caption:captionRef.current.value,
profileImg:session.user.image,
timestamp:serverTimestamp()
})

// 2) get the post id for the newly created post

console.log('new doc added with id',docRef.id)

// 3) upload the image to firebase strogae with the post id

const imageRef=ref(storage,`posts/${docRef.id}/image`);
await uploadString(imageRef,selectedFile,'data_url').then(async snapshot=>{
  const downloadURL=await getDownloadURL(imageRef)

  // 4) get a download udl from fb storage and update the original post with image

  await updateDoc(doc(db,'posts',docRef.id),{
    image:downloadURL
  })
})

setOpen(false);
setLoading(false);
setSelectedFile(null)

}

  const addImageToPost = (e) => {
    const reader = new FileReader()
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0])
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result)
    }
  }
  return (
    <Transition show={open} as={Fragment}>
      {/* it is used to deploy modal */}
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto "
        onClose={() => setOpen(false)}
      >
        {/* it is background of modal */}
        <div className="flex min-h-[800px] items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:min-h-screen sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          {/* this element is to trick browser into centering the modal contents */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          {/* it is an actual modal */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-center align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
              <div className="">
                {selectedFile ? (
                  <img
                    className="w-full cursor-pointer object-contain"
                    src={selectedFile}
                    onClick={() => setSelectedFile(null)}
                  />
                ) : (
                  <div
                    onClick={() => filePickerRef.current.click()}
                    className="mx-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-red-100"
                  >
                    <CameraIcon className="h-6 w-6 text-red-600" />
                  </div>
                )}
                <div className="">
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Upload a photo
                    </Dialog.Title>
                    <div className="">
                      <input
                        ref={filePickerRef}
                        type="file"
                        name=""
                        hidden
                        onChange={addImageToPost}
                      />
                    </div>
                    <div className="mt-2">
                      <input
                        ref={captionRef}
                        type="text"
                        className="w-full border-none text-center focus:ring-0"
                        placeholder="Please enter a caption..."
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button onClick={uploadPost}
                  disabled={!selectedFile } className="focus:outine-none inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700  disabled:cursor-not-allowed disabled:bg-gray-300 hover:disabled:bg-gray-300 sm:text-sm">
                    {loading?'Uploading....':'Upload Post'}
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal
