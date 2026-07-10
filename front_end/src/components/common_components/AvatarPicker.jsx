import { useRef } from 'react'
import { User } from 'lucide-react'

// Shared avatar picker — used by SignUp (creating an account) and now
// ProfileSummaryCard (editing an existing one).
//
// Props:
//   frontendImage  — blob URL for a newly-picked file, highest priority (preview)
//   existingImage  — already-saved image URL (e.g. userData.profileImage) —
//                     shown when no new file has been picked yet. Not used by
//                     SignUp (nothing exists yet), used by Profile.
//   onImageChange  — callback (file, previewUrl) → called when user picks a file
//   initial        — fallback text (e.g. first letter of a name) shown when
//                     there's no image at all. SignUp doesn't pass this and
//                     falls back to a generic User icon, same as before.
//   size           — 'md' (default, 56px — SignUp) | 'lg' (80px — Profile)

function AvatarPicker({
    frontendImage,
    existingImage = null,
    onImageChange,
    initial = null,
    size = 'md',
}) {
    const fileRef = useRef(null)

    const handleChange = (e) => {
        const selectedFile = e.target.files[0]
        if (!selectedFile) return
        const previewUrl = URL.createObjectURL(selectedFile)
        onImageChange(selectedFile, previewUrl)
    }

    const dimensions = size === 'lg' ? 'w-20 h-20' : 'w-14 h-14'
    const imageToShow = frontendImage || existingImage

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
                className={`${dimensions} rounded-full bg-emerald-500 bg-opacity-20 border-2 border-emerald-500 flex items-center justify-center cursor-pointer overflow-hidden flex-shrink-0 hover:border-emerald-400 transition-colors duration-200`}
            >
                {imageToShow ? (
                    <img
                        src={imageToShow}
                        className='w-full h-full object-cover'
                        alt='profile preview'
                    />
                ) : initial ? (
                    <span className='text-emerald-400 font-semibold text-2xl'>{initial}</span>
                ) : (
                    <User size={24} className='text-emerald-400' />
                )}
            </div>
        </>
    )
}

export default AvatarPicker