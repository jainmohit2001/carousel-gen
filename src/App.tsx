import React, { useEffect, useRef, useState } from 'react'
import { black, white } from 'tailwindcss/colors'
import logo from './logo.svg'
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material'
import { Clear, UploadFileOutlined } from '@mui/icons-material'
import { getFonts } from './utils/getFonts'

function App() {
  const [carouselSize, setCarouselSize] = useState({
    width: 512,
    height: 512,
  })

  const [bgColor, setBgColor] = useState(black.toString())
  const [bgColorError, setBgColorError] = useState(false)

  const [contentColor, setContentColor] = useState(white.toString())
  const [contentColorError, setContentColorError] = useState(false)

  const [profileImage, setProfileImage] = useState(null as File | null)
  const profileImageRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')

  const [fontFamily, setFontFamily] = useState('')
  const [availableFontFamilies, setAvailableFontFamilies] = useState(
    [] as string[],
  )
  useEffect(() => {
    getFonts().then((value) => {
      setAvailableFontFamilies(value)
    })
  }, [])

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0])
    }
  }

  const removeProfileImage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault()

    if (profileImageRef.current) {
      profileImageRef.current.value = ''
      setProfileImage(null)
    }
  }

  const setFont = (e: SelectChangeEvent<string>) => {
    setFontFamily(e.target.value)
    const carousel = document.getElementById('carousel')
    if (carousel) {
      carousel.style.fontFamily = e.target.value
    }
  }

  const [content, setContent] = useState('')

  return (
    <div className='flex flex-1 flex-col gap-4 p-3'>
      <div className='mx-auto flex items-center gap-3'>
        <img src={logo} width={48} height={48} />
        <p className='text-2xl font-bold'>Carousel Gen</p>
      </div>
      <div className='flex w-full flex-wrap items-center justify-center overflow-x-auto p-3'>
        <div className='flex flex-col border-2 border-solid border-gray-100'>
          <div
            className='flex flex-shrink-0 flex-grow-0 flex-col gap-4 p-4'
            id='carousel'
            style={{
              width: carouselSize.width,
              flexBasis: carouselSize.width,
              height: carouselSize.height,
              backgroundColor: bgColor,
            }}
          >
            {(profileImage || name) && (
              <div className='flex items-center gap-3'>
                {profileImage && (
                  <img
                    src={URL.createObjectURL(profileImage)}
                    width={36}
                    height={36}
                    style={{ maxHeight: '36px', maxWidth: '36px' }}
                    className='rounded-full'
                  />
                )}
                {name && (
                  <p
                    className='text-sm font-medium'
                    style={{ color: contentColor }}
                  >
                    {name}
                  </p>
                )}
              </div>
            )}
            <p className='text-base' style={{ color: contentColor }}>
              {content}
            </p>
          </div>
        </div>
        <div className='flex flex-col gap-4 p-3'>
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
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <Clear
                    fontSize='small'
                    cursor='pointer'
                    onClick={() => {
                      setContent('')
                    }}
                  />
                </InputAdornment>
              ),
            }}
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
          <Button
            variant='outlined'
            component='label'
            size='large'
            className='gap-3'
            endIcon={
              profileImage ? (
                <IconButton size='small' onClick={removeProfileImage}>
                  <Clear fontSize='small' />
                </IconButton>
              ) : (
                <UploadFileOutlined />
              )
            }
          >
            {profileImage ? profileImage.name : 'No image selected'}
            <input
              type='file'
              hidden
              accept='image/*'
              ref={profileImageRef}
              onChange={handleProfileImageUpload}
            />
          </Button>
          <TextField
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
            type='text'
            label='Name'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <Clear
                    fontSize='small'
                    cursor='pointer'
                    onClick={() => {
                      setName('')
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
          {availableFontFamilies.length > 0 && (
            <FormControl fullWidth>
              <InputLabel id='font-family-select-label'>Font Family</InputLabel>
              <Select
                id='font-family-select'
                value={fontFamily}
                label='Font Family'
                onChange={setFont}
              >
                {availableFontFamilies.map((fontFamily, index) => (
                  <MenuItem value={fontFamily} key={index}>
                    {fontFamily}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
