import { DeFiAddress } from '@defichain/jellyfish-address'
import { NetworkName } from '@defichain/jellyfish-network'
import { CTransactionSegWit, TransactionSegWit } from '@defichain/jellyfish-transaction/dist'
import { AddressToken } from '@defichain/whale-api-client/dist/api/address'
import { WhaleWalletAccount } from '@defichain/whale-api-wallet'
import { StackActions, useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import BigNumber from 'bignumber.js'
import React, { Dispatch, useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import NumberFormat from 'react-number-format'
import { useDispatch, useSelector } from 'react-redux'
import { Logging } from '../../../../../api'
import { Text } from '../../../../../components'
import { Button } from '../../../../../components/Button'
import { SectionTitle } from '../../../../../components/SectionTitle'
import { useNetworkContext } from '../../../../../contexts/NetworkContext'
import { useTokensAPI } from '../../../../../hooks/wallet/TokensAPI'
import { RootState } from '../../../../../store'
import { hasTxQueued, transactionQueue } from '../../../../../store/transaction_queue'
import { tailwind } from '../../../../../tailwind'
import { translate } from '../../../../../translations'
import { BalanceParamList } from '../BalancesNavigator'

type Props = StackScreenProps<BalanceParamList, 'SendConfirmationScreen'>

export function SendConfirmationScreen ({ route }: Props): JSX.Element {
  const network = useNetworkContext()
  const { destination, amount, fee } = route.params
  const [token, setToken] = useState(route.params.token)
  const tokens = useTokensAPI()
  const hasPendingJob = useSelector((state: RootState) => hasTxQueued(state.transactionQueue))
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigation = useNavigation()
  const [isOnPage, setIsOnPage] = useState<boolean>(true)
  const postAction = (): void => {
    if (isOnPage) {
      navigation.dispatch(StackActions.popToTop())
    }
  }

  useEffect(() => {
    setIsOnPage(true)
    return () => {
      setIsOnPage(false)
    }
  }, [])

  async function onSubmit (): Promise<void> {
    if (hasPendingJob) {
      return
    }
    setIsSubmitting(true)
    await send({
      address: destination,
      token,
      amount,
      networkName: network.networkName
    }, dispatch, postAction)
    setIsSubmitting(false)
  }

  function onCancel (): void {
    if (!isSubmitting) {
      navigation.navigate('Send')
    }
  }

  useEffect(() => {
    const t = tokens.find((t) => t.id === token.id)
    if (t !== undefined) {
      setToken({ ...t })
    }
  }, [JSON.stringify(tokens)])

  return (
    <ScrollView style={tailwind('bg-gray-100 pb-4')}>
      <View style={tailwind('flex-col bg-white px-4 py-8 mb-4 justify-center items-center border-b border-gray-300')}>
        <Text style={tailwind('text-xs text-gray-500')}>
          {translate('screens/SendConfirmationScreen', 'YOU ARE SENDING')}
        </Text>
        <NumberFormat
          value={amount.toFixed(8)} decimalScale={8} thousandSeparator displayType='text' suffix={` ${token.symbol}`}
          renderText={(value) => (
            <Text
              testID='text_send_amount'
              style={tailwind('text-2xl font-bold flex-wrap')}
            >{value}
            </Text>
          )}
        />
      </View>
      <SectionTitle
        text={translate('screens/SendConfirmationScreen', 'TRANSACTION DETAILS')}
        testID='title_transaction_detail'
      />
      <TextRow
        lhs={translate('screens/SendConfirmationScreen', 'Address')}
        rhs={{ value: destination, testID: 'text_destination' }}
      />
      <TextRow
        lhs={translate('screens/SendConfirmationScreen', 'Network')}
        rhs={{ value: network.network, testID: 'text_network' }}
      />
      <NumberRow
        lhs={translate('screens/SendConfirmationScreen', 'Amount')}
        rhs={{ value: amount.toFixed(8), suffix: ` ${token.symbol}`, testID: 'text_amount' }}
      />
      <NumberRow
        lhs={translate('screens/SendConfirmationScreen', 'Estimated fee')}
        rhs={{ value: fee.toFixed(8), suffix: ' DFI (UTXO)', testID: 'text_fee' }}
      />
      <NumberRow
        lhs={translate('screens/SendConfirmationScreen', 'Remaining balance')}
        rhs={{
          value: BigNumber.maximum(new BigNumber(token.amount).minus(amount.toFixed(8)).minus(fee.toFixed(8)), 0).toFixed(8),
          suffix: ` ${token.symbol}`,
          testID: 'text_balance'
        }}
      />
      <Button
        testID='button_confirm_send'
        disabled={isSubmitting || hasPendingJob}
        label={translate('screens/SendConfirmationScreen', 'SEND')}
        title='Send' onPress={onSubmit}
      />
      <Button
        testID='button_cancel_send'
        disabled={isSubmitting || hasPendingJob}
        label={translate('screens/SendConfirmationScreen', 'CANCEL')}
        title='CANCEL' onPress={onCancel}
        fill='flat'
        margin='m-4 mt-0'
      />
    </ScrollView>
  )
}

function TextRow (props: { lhs: string, rhs: { value: string, testID: string } }): JSX.Element {
  return (
    <View style={tailwind('bg-white p-4 border-b border-gray-200 flex-row items-start w-full')}>
      <View style={tailwind('flex-1')}>
        <Text style={tailwind('font-medium')}>{props.lhs}</Text>
      </View>
      <View style={tailwind('flex-1')}>
        <Text testID={props.rhs.testID} style={tailwind('font-medium text-right text-gray-500')}>{props.rhs.value}</Text>
      </View>
    </View>
  )
}

function NumberRow (props: { lhs: string, rhs: { value: string | number, suffix?: string, testID: string } }): JSX.Element {
  return (
    <View style={tailwind('bg-white p-4 border-b border-gray-200 flex-row items-start w-full')}>
      <View style={tailwind('flex-1')}>
        <Text style={tailwind('font-medium')}>{props.lhs}</Text>
      </View>
      <View style={tailwind('flex-1')}>
        <NumberFormat
          value={props.rhs.value} decimalScale={8} thousandSeparator displayType='text'
          suffix={props.rhs.suffix}
          renderText={(val: string) => (
            <Text
              testID={props.rhs.testID}
              style={tailwind('flex-wrap font-medium text-right text-gray-500')}
            >{val}
            </Text>
          )}
        />
      </View>
    </View>
  )
}

interface SendForm {
  amount: BigNumber
  address: string
  token: AddressToken
  networkName: NetworkName
}

async function send ({
  address,
  token,
  amount,
  networkName
}: SendForm, dispatch: Dispatch<any>, postAction: () => void): Promise<void> {
  try {
    const to = DeFiAddress.from(networkName, address).getScript()

    const signer = async (account: WhaleWalletAccount): Promise<CTransactionSegWit> => {
      const script = await account.getScript()
      const builder = account.withTransactionBuilder()

      let signed: TransactionSegWit
      if (token.symbol === 'DFI') {
        signed = await builder.utxo.send(amount, to, script)
      } else {
        signed = await builder.account.accountToAccount({
          from: script,
          to: [{ script: to, balances: [{ token: +token.id, amount }] }]
        }, script)
      }
      return new CTransactionSegWit(signed)
    }

    dispatch(transactionQueue.actions.push({
      sign: signer,
      title: `${translate('screens/SendScreen', 'Sending')} ${token.symbol}`,
      description: `${translate('screens/SendScreen', `Sending ${amount.toFixed(8)} ${token.symbol}`)}`,
      postAction
    }))
  } catch (e) {
    Logging.error(e)
  }
}