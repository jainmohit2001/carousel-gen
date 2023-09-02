import React, { useEffect, useRef, useState } from 'react'
import { black, white } from 'tailwindcss/colors'
import logo from './logo.svg'
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material'
import { CancelOutlined, Clear, UploadFileOutlined } from '@mui/icons-material'
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profileImageRef = useRef<any>()

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

  const removeProfileImage = () => {
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
      <div className='flex w-full flex-wrap gap-4 overflow-x-auto p-3'>
        <div className='border-2 border-solid border-gray-100'>
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
          <div className='flex flex-row items-center justify-center gap-4'>
            <Button
              variant='contained'
              component='label'
              className='gap-3'
              endIcon={!profileImage && <UploadFileOutlined />}
            >
              Profile image {profileImage && '- ' + profileImage.name}
              <input
                type='file'
                hidden
                accept='image/*'
                ref={profileImageRef}
                onChange={handleProfileImageUpload}
              />
            </Button>
            <Button variant='outlined' onClick={removeProfileImage}>
              Remove
            </Button>
          </div>
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
