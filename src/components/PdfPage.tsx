import React from 'react'

import { Page, View, Image, Text } from '@react-pdf/renderer'

function PdfPage(
  carouselSize: { width: number; height: number },
  fontFamilyName: string | undefined,
  bgColor: string,
  contentColor: string,
  name: string,
  profileImage: File | null,
  content: string,
) {
  return (
    <Page
      size={{ width: carouselSize.width, height: carouselSize.height }}
      style={{ fontFamily: fontFamilyName }}
      orientation='portrait'
      wrap
    >
      <View
        style={{
          backgroundColor: bgColor,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          display: 'flex',
          padding: 12,
          width: carouselSize.width,
          height: carouselSize.height,
          flexDirection: 'column',
          margin: 0,
        }}
        wrap
      >
        {(profileImage || name.length > 0) && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
            wrap
          >
            {profileImage && (
              <Image
                src={URL.createObjectURL(profileImage)}
                style={{
                  maxWidth: 36,
                  maxHeight: 36,
                  width: 36,
                  height: 36,
                  borderRadius: 99999,
                  marginRight: 12,
                }}
              />
            )}
            {name.length > 0 && (
              <Text
                style={{
                  color: contentColor,
                  fontSize: 14,
                }}
              >
                {name}
              </Text>
            )}
          </View>
        )}
        {content.length > 0 && (
          <Text
            style={{
              color: contentColor,
              fontSize: 16,
              flexShrink: 1,
              flexGrow: 0,
            }}
          >
            {content}
          </Text>
        )}
      </View>
    </Page>
  )
}

export default PdfPage
