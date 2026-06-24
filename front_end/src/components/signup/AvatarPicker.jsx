import React, { useRef } from 'react'
import { User } from 'lucide-react'

// Handles the profile image picker shown in the SignUp header
// Props:
//   frontendImage  — blob URL for preview (null when nothing picked yet)
//   onImageChange  — callback (file, previewUrl) → called when user picks a file

function AvatarPicker({ frontendImage, onImageChange }) {
    const fileRef = useRef(null)

    const handleChange = (e) => {
        const selectedFile = e.target.files[0]
        if (!selectedFile) return
        const previewUrl = URL.createObjectURL(selectedFile)
        onImageChange(selectedFile, previewUrl)
    }

    return (
        <>
            {/* Hidden file input */}
            <input
                type='file'
                hidden
                ref={fileRef}
                onChange={handleChange}
                accept='image/*'
            />

            {/* Clickable avatar circle */}
            <div
                onClick={() => fileRef.current.click()}
                className='w-14 h-14 rounded-full bg-emerald-500 bg-opacity-20 border-2 border-emerald-500 flex items-center justify-center cursor-pointer overflow-hidden flex-shrink-0 hover:border-emerald-400 transition-colors duration-200'
            >
                {frontendImage ? (
                    <img
                        src={frontendImage}
                        className='w-full h-full object-cover'
                        alt='profile preview'
                    />
                ) : (
                    <User size={24} className='text-emerald-400' />
                )}
            </div>
        </>
    )
}

export default AvatarPicker
