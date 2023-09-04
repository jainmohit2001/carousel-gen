import React from 'react'

import App from './App'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('App', () => {
  it('renders App component', async () => {
    render(<App />)
    expect(screen.getByText('Carousel Gen')).toBeInTheDocument()

    // Check for inputs
    expect(screen.getByLabelText('Background Color')).toBeInTheDocument()
    expect(screen.getByLabelText('Content')).toBeInTheDocument()
    expect(screen.getByText('No image selected')).toBeInTheDocument()
    expect(screen.getByLabelText('Content Color')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()

    // Wait for fonts to load and then check for font family input
    expect(await screen.findByLabelText('Font Family')).toBeInTheDocument()
  })

  it('should update background color', async () => {
    render(<App />)
    const color = '#f2f'

    // Type in color
    await act(async () => {
      userEvent.type(screen.getByLabelText('Background Color'), color)
      expect(await screen.findByLabelText('Background Color')).toHaveValue(
        color,
      )
    })

    // Cross check if the carousel has the same background color
    expect(await screen.findByLabelText('carousel')).toHaveStyle({
      backgroundColor: color,
    })

    // Type in invalid color and check for invalid helper text
    await act(async () => {
      userEvent.type(screen.getByLabelText('Background Color'), 'invalid')
      expect(await screen.findByText('Invalid color')).toBeInTheDocument()
    })

    // Clear the input and check if the carousel has the default background color
    await act(async () => {
      userEvent.clear(screen.getByLabelText('Background Color'))
      expect(await screen.findByLabelText('Background Color')).toHaveValue('')
    })
    expect(await screen.findByLabelText('carousel')).toHaveStyle({
      backgroundColor: '#000',
    })
  })
})
