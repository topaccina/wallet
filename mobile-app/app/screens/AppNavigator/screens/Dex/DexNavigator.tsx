import { PoolPairData } from '@defichain/whale-api-client/dist/api/poolpairs'
import { createStackNavigator } from '@react-navigation/stack'
import BigNumber from 'bignumber.js'
import * as React from 'react'
import { HeaderFont } from '@components/Text'
import { HeaderTitle } from '@components/HeaderTitle'
import { translate } from '@translations'
import { NetworkDetails } from '../Settings/screens/NetworkDetails'
import { AddLiquidityScreen } from './DexAddLiquidity'
import { AddLiquiditySummary, ConfirmAddLiquidityScreen } from './DexConfirmAddLiquidity'
import { RemoveLiquidityConfirmScreen } from './DexConfirmRemoveLiquidity'
import { RemoveLiquidityScreen } from './DexRemoveLiquidity'
import { DexScreen } from './DexScreen'
import { ConfirmPoolSwapScreen, DexForm } from './PoolSwap/ConfirmPoolSwapScreen'
import { DerivedTokenState, PoolSwapScreen } from './PoolSwap/PoolSwapScreen'

export interface DexParamList {
  DexScreen: undefined
  PoolSwapScreen: { poolpair: PoolPairData }
  ConfirmPoolSwapScreen: {
    tokenA: DerivedTokenState
    tokenB: DerivedTokenState
    swap: DexForm
    fee: BigNumber
    pair: PoolPairData
    slippage: number
  }
  AddLiquidity: { pair: PoolPairData }
  ConfirmAddLiquidity: { pair: PoolPairData, summary: AddLiquiditySummary }
  RemoveLiquidity: { pair: PoolPairData }
  ConfirmRemoveLiquidity: { amount: BigNumber, fee: BigNumber, pair: PoolPairData, tokenAAmount: string, tokenBAmount: string }

  [key: string]: undefined | object
}

const DexStack = createStackNavigator<DexParamList>()

export function DexNavigator (): JSX.Element {
  const headerContainerTestId = 'dex_header_container'
  return (
    <DexStack.Navigator
      initialRouteName='DexScreen'
      screenOptions={{ headerTitleStyle: HeaderFont, headerBackTitleVisible: false }}
    >
      <DexStack.Screen
        component={DexScreen}
        name='DexScreen'
        options={{
          headerTitle: () => (
            <HeaderTitle
              text={translate('screens/DexScreen', 'Decentralized Exchange')}
              containerTestID={headerContainerTestId}
            />
          )
        }}
      />

      <DexStack.Screen
        component={AddLiquidityScreen}
        name='AddLiquidity'
        options={{
          headerTitle: () => (
            <HeaderTitle
              text={translate('screens/DexScreen', 'Add Liquidity')}
              containerTestID={headerContainerTestId}
            />
          )
        }}
      />

      <DexStack.Screen
        component={ConfirmAddLiquidityScreen}
        name='ConfirmAddLiquidity'
        options={{
          headerTitle: () => (
            <HeaderTitle
              text={translate('screens/DexScreen', 'Add Liquidity')}
              containerTestID={headerContainerTestId}
            />
          )
        }}
      />

      <DexStack.Screen
        component={RemoveLiquidityScreen}
        name='RemoveLiquidity'
        options={{
          headerTitle: () => (
            <HeaderTitle
              text={translate('screens/DexScreen', 'Remove Liquidity')}
              containerTestID={headerContainerTestId}
            />
          )
        }}
      />

      <DexStack.Screen
        component={RemoveLiquidityConfirmScreen}
        name='RemoveLiquidityConfirmScreen'
        options={{
          headerTitle: () => (
            <HeaderTitle
              text={translate('screens/DexScreen', 'Confirm removal')}
              containerTestID={headerContainerTestId}
            />
          )
        }}
      />

      <DexStack.Screen
        component={PoolSwapScreen}
        name='PoolSwap'
        options={{
          headerTitle: () => (
            <HeaderTitle
              text={translate('screens/DexScreen', 'Decentralized Exchange')}
              containerTestID={headerContainerTestId}
            />
          )
        }}
      />

      <DexStack.Screen
        component={ConfirmPoolSwapScreen}
        name='ConfirmPoolSwapScreen'
        options={{
          headerTitle: () => (
            <HeaderTitle
              text={translate('screens/DexScreen', 'Confirm swap')}
              containerTestID={headerContainerTestId}
            />
          )
        }}
      />

      <DexStack.Screen
        component={NetworkDetails}
        name='NetworkDetails'
        options={{
          headerTitle: translate('screens/NetworkDetails', 'Wallet Network'),
          headerBackTitleVisible: false
        }}
      />
    </DexStack.Navigator>
  )
}