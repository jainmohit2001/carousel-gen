import React from 'react'

import App from './App'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('App', () => {
  it('renders App component', async () => {
    render(<App />)
    expect(screen.getByText('Carousel Gen')).toBeInTheDocument()

    // Check for inputs
    expect(screen.getByLabelText('Background Color')).toBeInTheDocument()
    expect(screen.getByLabelText('Content')).toBeInTheDocument()
    expect(screen.getByText('No profile image selected')).toBeInTheDocument()
    expect(screen.getByLabelText('Content Color')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Font size')).toBeInTheDocument()
    expect(screen.getByLabelText('Width')).toBeInTheDocument()
    expect(screen.getByLabelText('Height')).toBeInTheDocument()

    // Check for Add page, Next page and Prev page button
    expect(screen.getByLabelText('Add page')).toBeInTheDocument()
    expect(screen.getByLabelText('Next page')).toBeInTheDocument()
    expect(screen.getByLabelText('Prev page')).toBeInTheDocument()

    // Wait for fonts to load and then check for font family input
    expect(await screen.findByLabelText('Font Family')).toBeInTheDocument()
  })

  it('Should update carousel size', async () => {
    render(<App />)
    const width = 1024,
      height = 1024
    // Update width and height
    // Check if the carousel has the updated width and height
    await act(async () => {
      // We need to clear default values before typing in new values
      userEvent.clear(screen.getByLabelText('Width'))
      userEvent.clear(screen.getByLabelText('Height'))
      userEvent.type(screen.getByLabelText('Width'), width.toString())
      userEvent.type(screen.getByLabelText('Height'), height.toString())
    })
    expect(await screen.findByLabelText('Width')).toHaveValue(width)
    expect(await screen.findByLabelText('Height')).toHaveValue(height)
    expect(await screen.findByLabelText('carousel')).toHaveStyle({
      width: `${width}px`,
      height: `${height}px`,
    })
  })

  it('should update background color', async () => {
    render(<App />)
    const color = '#f2f'

    // Type in color.
    // Cross check if the color is updated.
    await act(async () => {
      userEvent.type(screen.getByLabelText('Background Color'), color)
    })
    expect(await screen.findByLabelText('Background Color')).toHaveValue(color)
    expect(await screen.findByLabelText('carousel')).toHaveStyle({
      backgroundColor: color,
    })

    // Type in invalid color.
    // Check for invalid helper text.
    await act(async () => {
      userEvent.type(screen.getByLabelText('Background Color'), 'invalid')
    })
    expect(await screen.findByText('Invalid color')).toBeInTheDocument()

    // Clear the input.
    // Check if the carousel has the default background color
    await act(async () => {
      userEvent.clear(screen.getByLabelText('Background Color'))
    })
    expect(await screen.findByLabelText('Background Color')).toHaveValue('')
    expect(await screen.findByLabelText('carousel')).toHaveStyle({
      backgroundColor: '#000',
    })
  })

  it('should update and clear content', async () => {
    render(<App />)
    const content = 'Some content here'

    // Type in content.
    // Cross check if the content is updated.
    await act(async () => {
      userEvent.type(screen.getByLabelText('Content'), content)
    })
    expect(await screen.findByLabelText('Content')).toHaveValue(content)
    expect(await screen.findByLabelText('carousel-content')).toHaveTextContent(
      content,
    )

    // Clear the content using the clear button.
    // Check if the carousel-content is empty.
    await act(async () => {
      userEvent.click(screen.getByLabelText('Clear content'))
    })
    expect(await screen.findByLabelText('Content')).toHaveValue('')
    expect(
      await screen.findByLabelText('carousel-content'),
    ).toBeEmptyDOMElement()
  })

  it('should update content color', async () => {
    render(<App />)
    const color = '#f2f'

    // Type in color.
    // Cross check if the color is updated.
    await act(async () => {
      userEvent.type(screen.getByLabelText('Content Color'), color)
    })
    expect(await screen.findByLabelText('Content Color')).toHaveValue(color)
    expect(await screen.findByLabelText('carousel-content')).toHaveStyle({
      color: color,
    })

    // Type in invalid color.
    // Check for invalid helper text.
    await act(async () => {
      userEvent.type(screen.getByLabelText('Content Color'), 'invalid')
    })
    expect(await screen.findByText('Invalid color')).toBeInTheDocument()

    // Clear the input.
    // Check if the carousel has the default content color
    await act(async () => {
      userEvent.clear(screen.getByLabelText('Content Color'))
    })
    expect(await screen.findByLabelText('Content Color')).toHaveValue('')
    expect(await screen.findByLabelText('carousel-content')).toHaveStyle({
      color: '#fff',
    })
  })

  it('should update and clear name', async () => {
    render(<App />)
    const name = 'John Doe'

    // Type in name.
    // Cross check if the name is updated.
    await act(async () => {
      userEvent.type(screen.getByLabelText('Name'), name)
    })
    expect(await screen.findByLabelText('Name')).toHaveValue(name)
    expect(await screen.findByLabelText('carousel-name')).toHaveTextContent(
      name,
    )

    // Clear the name using the clear button.
    // Check if the carousel-name element is removed.
    await act(async () => {
      userEvent.click(screen.getByLabelText('Clear name'))
    })
    expect(await screen.findByLabelText('Name')).toHaveValue('')
    expect(screen.queryByLabelText('carousel-name')).not.toBeInTheDocument()
  })

  it('should upload and remove profile image', async () => {
    render(<App />)

    // Upload image.
    // Check if the image is uploaded and the name is displayed.
    // Check if the image is visible in the carousel.
    const file = new File(['Profile image'], 'profile.png', {
      type: 'image/png',
    })
    await act(async () => {
      userEvent.upload(screen.getByLabelText('Profile Image'), file)
    })
    expect(await screen.findByText('profile.png')).toBeInTheDocument()
    expect(
      await screen.findByLabelText('carousel-profile-image'),
    ).toBeInTheDocument()

    // Remove image by clicking on the remove button.
    // Check if the image is removed.
    await act(async () => {
      userEvent.click(screen.getByLabelText('Clear profile image'))
    })
    expect(
      await screen.findByText('No profile image selected'),
    ).toBeInTheDocument()
    expect(
      screen.queryByLabelText('carousel-profile-image'),
    ).not.toBeInTheDocument()
  })

  it('should update font family', async () => {
    render(<App />)

    // Wait for fonts to load.
    expect(await screen.findByLabelText('Font Family')).toBeInTheDocument()

    // Click on Font family input
    let fontFamily: string | null = null
    await act(async () => {
      userEvent.click(screen.getByLabelText('Font Family'))
    })

    // Get the first option with role='option' and click on it.
    await act(async () => {
      const firstOption = (await screen.findAllByRole('option'))[0]
      fontFamily = firstOption.textContent
      userEvent.click(firstOption)
    })

    // Check if the font family is updated in the input and carousel
    expect(fontFamily).not.toBeNull()
    if (fontFamily) {
      expect(await screen.findByText(fontFamily)).toBeInTheDocument()
      expect(await screen.findByLabelText('carousel')).toHaveStyle({
        fontFamily: fontFamily,
      })
    }
  })

  it('should open new window with pdf', async () => {
    render(<App />)

    // Mock window.open
    const windowOpenMock = jest.fn()
    Object.defineProperty(window, 'open', {
      writable: true,
      value: windowOpenMock,
    })

    // Click on download button.
    await act(async () => {
      userEvent.click(screen.getByText('Download PDF'))
    })

    // Check if window.open is called once.
    await waitFor(async () => {
      expect(windowOpenMock).toHaveBeenCalledTimes(1)
    })
  })

  it('should update content font size', async () => {
    render(<App />)
    const fontSize = '20'

    // Update slider value.
    // Check if the carousel-content has the updated font size.
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Font size'), {
        target: { value: fontSize },
      })
    })
    expect(await screen.findByLabelText('Font size')).toHaveValue(fontSize)
    expect(await screen.findByLabelText('carousel-content')).toHaveStyle({
      fontSize: fontSize,
    })
  })

  it('should add and remove page successfully with content', async () => {
    render(<App />)
    const content = ['Content 1', 'Content 2', 'Content 3']

    // Set content for Page 1
    await act(async () => {
      userEvent.type(screen.getByLabelText('Content'), content[0])
    })

    // Number of pages should be 1
    expect(screen.getByText('Page 1 / 1')).toBeInTheDocument()

    // Both prev and next button should be disabled
    expect(screen.getByLabelText('Prev page')).toBeDisabled()
    expect(screen.getByLabelText('Next page')).toBeDisabled()

    // Add page
    await act(async () => {
      userEvent.click(screen.getByLabelText('Add page'))
    })

    // Set content for Page 2
    await act(async () => {
      userEvent.type(screen.getByLabelText('Content'), content[1])
    })

    // The carousel-content should have content of Page 2
    expect(await screen.findByLabelText('carousel-content')).toHaveTextContent(
      content[1],
    )

    // Number of pages should increase
    expect(screen.getByText('Page 2 / 2')).toBeInTheDocument()

    // Prev button should be enabled, next button should be disabled
    expect(screen.getByLabelText('Prev page')).toBeEnabled()
    expect(screen.getByLabelText('Next page')).toBeDisabled()

    // Add page
    await act(async () => {
      userEvent.click(screen.getByLabelText('Add page'))
    })

    // Set content for Page 3
    await act(async () => {
      userEvent.type(screen.getByLabelText('Content'), content[2])
    })

    // The carousel-content should have content of Page 3
    expect(await screen.findByLabelText('carousel-content')).toHaveTextContent(
      content[2],
    )

    // Number of pages should increase
    expect(screen.getByText('Page 3 / 3')).toBeInTheDocument()

    // Prev button should be enabled, next button should be disabled
    expect(screen.getByLabelText('Prev page')).toBeEnabled()
    expect(screen.getByLabelText('Next page')).toBeDisabled()

    // Go back to Page 2
    await act(async () => {
      userEvent.click(screen.getByLabelText('Prev page'))
    })

    // The carousel-content should have content of Page 2
    expect(await screen.findByLabelText('carousel-content')).toHaveTextContent(
      content[1],
    )

    // Both prev and next button should be enabled
    expect(screen.getByLabelText('Prev page')).toBeEnabled()
    expect(screen.getByLabelText('Next page')).toBeEnabled()

    // Content text field should have content of Page 2
    expect(await screen.findByLabelText('Content')).toHaveValue(content[1])

    // Remove page 2
    await act(async () => {
      userEvent.click(screen.getByLabelText('Remove page'))
    })

    // The carousel-content should have content of Page 1
    expect(await screen.findByLabelText('carousel-content')).toHaveTextContent(
      content[0],
    )

    // Number of pages should decrease
    expect(screen.getByText('Page 1 / 2')).toBeInTheDocument()

    // Go to next page
    await act(async () => {
      userEvent.click(screen.getByLabelText('Next page'))
    })

    // The carousel-content should have content of Page 3
    expect(await screen.findByLabelText('carousel-content')).toHaveTextContent(
      content[2],
    )
  })
})
