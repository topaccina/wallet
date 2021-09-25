import { configureStore } from '@reduxjs/toolkit'
import { fireEvent, render } from '@testing-library/react-native'
import * as Clipboard from 'expo-clipboard'
import * as React from 'react'
import { Provider } from 'react-redux'
import { RootState } from '@store'
import { wallet } from '@store/wallet'
import { ReceiveScreen } from './ReceiveScreen'

jest.mock('../../../../../contexts/WalletContext', () => ({
  useWalletContext: () => {
    return {
      address: 'bcrt1q6np0fh47ykhznjhrtfvduh73cgjg32yac8t07d'
    }
  }
}))

jest.mock('expo-clipboard', () => ({
  setString: jest.fn()
}))

jest.mock('../../../../../contexts/ThemeProvider')

describe('receive page', () => {
  it('should match snapshot', async () => {
    const initialState: Partial<RootState> = {
      wallet: {
        utxoBalance: '77',
        tokens: [],
        poolpairs: []
      }
    }
    const store = configureStore({
      preloadedState: initialState,
      reducer: { wallet: wallet.reducer }
    })
    const component = (
      <Provider store={store}>
        <ReceiveScreen />
      </Provider>
    )
    const rendered = render(component)
    expect(rendered.toJSON()).toMatchSnapshot()
  })

  it('should trigger copy', async () => {
    const initialState: Partial<RootState> = {
      wallet: {
        utxoBalance: '77',
        tokens: [],
        poolpairs: []
      }
    }
    const store = configureStore({
      preloadedState: initialState,
      reducer: { wallet: wallet.reducer }
    })
    const component = (
      <Provider store={store}>
        <ReceiveScreen />
      </Provider>
    )
    const spy = jest.spyOn(Clipboard, 'setString')
    const rendered = render(component)
    const copyButton = await rendered.findByTestId('copy_button')
    fireEvent.press(copyButton)
    expect(spy).toHaveBeenCalled()
  })

  it('should trigger share', async () => {
    const initialState: Partial<RootState> = {
      wallet: {
        utxoBalance: '77',
        tokens: [],
        poolpairs: []
      }
    }
    const store = configureStore({
      preloadedState: initialState,
      reducer: { wallet: wallet.reducer }
    })
    const component = (
      <Provider store={store}>
        <ReceiveScreen />
      </Provider>
    )
    const spy = jest.spyOn(Clipboard, 'setString')
    const rendered = render(component)
    const shareButton = await rendered.findByTestId('share_button')
    fireEvent.press(shareButton)
    expect(spy).toHaveBeenCalled()
  })
})