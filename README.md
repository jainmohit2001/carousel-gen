# Carousel gen - A simple PDF carousel generator

Create simple PDF carousel using [Create React App](https://create-react-app.dev/) and [react-pdf](https://react-pdf.org/). These PDFs can be used in social media posts.

The styling is done using [MUI](https://mui.com/) and [Tailwindcss](https://tailwindcss.com/).

This project is part of Coding challenges series by John Crickett https://codingchallenges.fyi/challenges/challege-licg.

## Installation

Install dependencies with the following command:

```bash
npm ci
```

## Tests

To run the tests use the following command:

```bash
npm test
```

## Support added

- Carousel size
- Background color
- Text color
- Profile image
- Profile name
- Content size
- Support for multiple pages (upto 15) with different content only
- Font family
  - **Note**: The Font family functionality only works on the devices that produce a .ttf file when calling the Google fonts API.
    Check out this stackoverflow discussion for more information: https://stackoverflow.com/a/27308229/21899409
