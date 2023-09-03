import React from 'react'

import App from './App'
import { render, screen } from '@testing-library/react'

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
})
