import React, { useRef, useState } from 'react'
import { black, white } from 'tailwindcss/colors'
import logo from './logo.svg'
import { Button, TextField } from '@mui/material'
import { UploadFileOutlined } from '@mui/icons-material'

function App() {
  const [carouselSize, setCarouselSize] = useState({
    width: 512,
    height: 512,
  })

  const [bgColor, setBgColor] = useState(black.toString())
  const [bgColorError, setBgColorError] = useState(false)

  const [contentColor, setContentColor] = useState(white.toString())
  const [contentColorError, setContentColorError] = useState(false)

  const [profileImage, setProfileImage] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profileImageRef = useRef<any>()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0].name)
    }
  }

  const removeProfileImage = () => {
    if (profileImageRef.current) {
      profileImageRef.current.value = ''
      setProfileImage('')
    }
  }

  const [content, setContent] = useState('')

  return (
    <div className='flex flex-1 flex-col gap-4 p-3'>
      <div className='mx-auto flex items-center gap-3'>
        <img src={logo} width={48} height={48} />
        <p className='text-2xl font-bold'>Carousel Gen</p>
      </div>
      <div className='flex w-full flex-wrap gap-4 overflow-x-auto p-3'>
        <div className='border-2 border-solid border-gray-100'>
          <div
            className='flex flex-shrink-0 flex-grow-0 flex-col p-4'
            id='carousel'
            style={{
              width: carouselSize.width,
              flexBasis: carouselSize.width,
              height: carouselSize.height,
              backgroundColor: bgColor,
            }}
          >
            <p className='text-base' style={{ color: contentColor }}>
              {content}
            </p>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <TextField
            onChange={(e) => {
              const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
              if (regex.test(e.target.value)) {
                setBgColor(e.target.value)
                setBgColorError(false)
              } else {
                setBgColorError(true)
              }
            }}
            error={bgColorError}
            helperText={bgColorError ? 'Invalid color' : null}
            label='Background Color'
            placeholder='#000'
            type='text'
          />
          <TextField
            onChange={(e) => {
              setContent(e.target.value)
            }}
            value={content}
            label='Content'
            type='text'
          />
          <TextField
            onChange={(e) => {
              const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
              if (regex.test(e.target.value)) {
                setContentColor(e.target.value)
                setContentColorError(false)
              } else {
                setContentColorError(true)
              }
            }}
            type='text'
            error={contentColorError}
            helperText={contentColorError ? 'Invalid color' : null}
            label='Content Color'
            placeholder='#000'
          />
          <div className='flex flex-row items-center justify-center gap-4'>
            <Button
              variant='contained'
              component='label'
              className='gap-3'
              endIcon={profileImage.length === 0 && <UploadFileOutlined />}
            >
              Profile image {profileImage.length > 0 && '- ' + profileImage}
              <input
                type='file'
                hidden
                accept='image/*'
                ref={profileImageRef}
                onChange={handleFileUpload}
              />
            </Button>
            <Button variant='outlined' onClick={removeProfileImage}>
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
