import React, { useEffect, useRef, useState } from 'react'
import { black, white } from 'tailwindcss/colors'
import logo from './logo.svg'
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  TextField,
} from '@mui/material'
import {
  Add,
  ArrowBack,
  ArrowForward,
  Clear,
  Delete,
  FileDownload,
  UploadFileOutlined,
} from '@mui/icons-material'
import { getFonts } from './utils/getFonts'
import { Document, Font, pdf } from '@react-pdf/renderer'
import fetchFontFromGoogle from './utils/fetchFontFromGoogle'
import PdfPage from './components/PdfPage'

function App() {
  const [carouselSize, setCarouselSize] = useState({
    width: 512,
    height: 512,
  })
  const [content, setContent] = useState([''])

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

  const [contentFontSize, setContentFontSize] = useState(16)

  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  const [downloadingPdf, setDownloadingPdf] = useState(false)

  useEffect(() => {
    getFonts().then((value) => {
      setAvailableFontFamilies(value)
    })
  }, [])

  function getPage(index: number, fontUrl: string | null) {
    const fontFamilyName = fontUrl !== null ? fontFamily : undefined

    return PdfPage(
      carouselSize,
      fontFamilyName,
      bgColor,
      contentColor,
      name,
      profileImage,
      content[index],
      contentFontSize,
      index,
    )
  }

  async function downloadPdf() {
    if (downloadingPdf) {
      return
    }
    setDownloadingPdf(true)
    const source = window.document.getElementById('carousel')
    let fontUrl: string | null = null
    if (fontFamily) {
      fontUrl = await fetchFontFromGoogle(fontFamily)
    }
    if (fontUrl) {
      Font.register({
        family: fontFamily,
        src: fontUrl,
        fontStyle: 'normal',
      })
    }
    if (source) {
      const doc = (
        <Document pageMode='useNone'>
          {content.map((value, index) => getPage(index, fontUrl))}
        </Document>
      )
      const asPdf = pdf()
      asPdf.updateContainer(doc)
      const blob = await asPdf.toBlob()
      window.open(URL.createObjectURL(blob), '_blank')
      setDownloadingPdf(false)
    }
  }

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

  const handleAddContent = () => {
    const newContent = [...content]
    newContent.push('')
    setContent(newContent)
    setCurrentPageIndex(newContent.length - 1)
  }

  const handleNext = () => {
    if (currentPageIndex < content.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
    }
  }

  const handleRemovePage = () => {
    if (content.length > 1) {
      const newContent = [...content]
      newContent.splice(currentPageIndex, 1)
      setContent(newContent)
      setCurrentPageIndex(Math.max(0, currentPageIndex - 1))
    }
  }

  return (
    <div className='flex flex-1 flex-col gap-4 p-3'>
      <div className='mx-auto mb-3 flex flex-col items-center gap-3'>
        <div className='flex items-center gap-3'>
          <img src={logo} width={48} height={48} />
          <p className='text-2xl font-bold'>Carousel Gen</p>
        </div>
        <p className='text-xs'>Generate simple PDF carousels for Linkedin.</p>
      </div>
      <div className='flex w-full flex-wrap justify-center overflow-x-auto p-3'>
        <div className='flex flex-col gap-3 p-2'>
          {/* Add and delete button */}
          <div className='flex w-full flex-row justify-between'>
            <Button
              variant='contained'
              onClick={handleAddContent}
              aria-label='Add page'
              title='Add page'
              endIcon={<Add fontSize='small' />}
              disabled={content.length >= 15}
            >
              <p className='flex-nowrap whitespace-nowrap text-sm'>Add page</p>
            </Button>

            {content.length > 1 && (
              <Button
                variant='contained'
                color='error'
                aria-label='Remove page'
                title='Remove page'
                endIcon={<Delete fontSize='small' />}
                onClick={handleRemovePage}
              >
                <p className='flex-nowrap whitespace-nowrap text-sm'>
                  Remove page {currentPageIndex + 1}
                </p>
              </Button>
            )}
          </div>
          <div className='border-2 border-solid border-gray-100'>
            {/* Carousel Starts here */}
            <div
              id='carousel'
              aria-label='carousel'
              style={{
                width: carouselSize.width,
                flexBasis: carouselSize.width,
                height: carouselSize.height,
                backgroundColor: bgColor,
                flexShrink: 0,
                flexGrow: 0,
                display: 'flex',
                padding: 12,
                flexDirection: 'column',
                justifyContent: 'start',
                alignItems: 'start',
              }}
            >
              {(profileImage || name) && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  {profileImage && (
                    <img
                      aria-label='carousel-profile-image'
                      src={URL.createObjectURL(profileImage)}
                      width={36}
                      height={36}
                      style={{
                        height: 36,
                        width: 36,
                        borderRadius: 99999,
                        marginRight: 12,
                      }}
                    />
                  )}
                  {name && (
                    <p
                      aria-label='carousel-name'
                      style={{
                        color: contentColor,
                        fontSize: 14,
                      }}
                    >
                      {name}
                    </p>
                  )}
                </div>
              )}
              <p
                aria-label='carousel-content'
                style={{
                  color: contentColor,
                  fontSize: contentFontSize,
                }}
              >
                {content[currentPageIndex]}
              </p>
            </div>
            {/* Carousel Ends here */}
          </div>

          {/* Navigation Starts here */}
          <div className='flex w-full flex-row items-center'>
            <Button
              size='small'
              aria-label='Prev page'
              title='Prev page'
              variant='contained'
              disabled={currentPageIndex === 0}
              onClick={handlePrev}
              startIcon={<ArrowBack fontSize='small' />}
            >
              <p className='text-sm'>Prev</p>
            </Button>
            <p className='mx-auto text-sm font-bold'>
              Page {currentPageIndex + 1} / {content.length}
            </p>
            <Button
              size='small'
              aria-label='Next page'
              title='Next page'
              variant='contained'
              disabled={currentPageIndex === content.length - 1}
              onClick={handleNext}
              endIcon={<ArrowForward fontSize='small' />}
            >
              <p className='text-sm'>Next</p>
            </Button>
          </div>
          {/* Navigation ends here */}
        </div>
        {/*  */}
        <div className='flex flex-col gap-4 px-4 py-3'>
          <TextField
            onChange={(e) => {
              const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
              if (e.target.value === '') {
                setBgColor(black.toString())
                setBgColorError(false)
                return
              }
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
            inputProps={{ maxLength: 7 }}
          />
          <TextField
            onChange={(e) => {
              const newContent = [...content]
              newContent[currentPageIndex] = e.target.value
              setContent(newContent)
            }}
            value={content[currentPageIndex]}
            label='Content'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <Clear
                    aria-label='Clear content'
                    fontSize='small'
                    cursor='pointer'
                    onClick={() => {
                      const newContent = [...content]
                      newContent[currentPageIndex] = ''
                      setContent(newContent)
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
              if (e.target.value === '') {
                setContentColor(white.toString())
                setContentColorError(false)
                return
              }
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
            inputProps={{ maxLength: 7 }}
          />
          <Button
            variant='outlined'
            component='label'
            size='large'
            className='gap-3'
            endIcon={
              profileImage ? (
                <IconButton
                  size='small'
                  aria-label='Clear profile image'
                  onClick={removeProfileImage}
                >
                  <Clear fontSize='small' />
                </IconButton>
              ) : (
                <UploadFileOutlined />
              )
            }
          >
            {profileImage ? profileImage.name : 'No profile image selected'}
            <input
              type='file'
              aria-label='Profile Image'
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
                    aria-label='Clear name'
                    fontSize='small'
                    cursor='pointer'
                    onClick={() => {
                      setName('')
                    }}
                  />
                </InputAdornment>
              ),
            }}
            inputProps={{ maxLength: 20 }}
          />
          {availableFontFamilies.length > 0 && (
            <FormControl fullWidth>
              <InputLabel id='font-family-select-label'>Font Family</InputLabel>
              <Select
                labelId='font-family-select-label'
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
          <div className='flex flex-col gap-1'>
            <InputLabel id='font-size'>Font size</InputLabel>
            <Slider
              aria-labelledby='font-size'
              valueLabelDisplay='on'
              size='small'
              max={32}
              min={7}
              step={1}
              value={contentFontSize}
              onChange={(e, value) => {
                setContentFontSize(value as number)
              }}
            />
          </div>
          <Button
            size='medium'
            onClick={() => downloadPdf()}
            variant='contained'
            endIcon={!downloadingPdf && <FileDownload fontSize='small' />}
          >
            {!downloadingPdf ? (
              <p className='text-sm'>Download PDF</p>
            ) : (
              <CircularProgress color='inherit' size={28} thickness={4.5} />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App
