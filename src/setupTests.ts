// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { TextDecoder, TextEncoder } from 'util'

Object.assign(global, { TextDecoder, TextEncoder })

// fonts property is not supported in jsdom.
// We have to mock it manually.
Object.defineProperty(document, 'fonts', {
  value: {
    ready: Promise.resolve({}),
    check(font, text) {
      return Math.random() > 0.5
    },
  } as FontFaceSet,
})

// Mocking URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', { value: jest.fn() })
