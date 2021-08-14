/**
 * This file will be used for mainnet testing or smoke testing
 * It will only test core features that doesn't require balances (e.g, Create, Restore wallet etc.)
 * Tests included here are not that extensive compared to functional testing (e.g, Color, disable test or styling tests won't be added here)
 * The goal is to have run smoke testing in Mainnet
 * */

context('Mainnet - Wallet', () => {
  const recoveryWords: string[] = []
  const settingsRecoveryWords: string[] = []
  const localAddress = {
    address: ''
  }
  const mainnetAddress = {
    address: ''
  }

  beforeEach(() => {
    cy.restoreLocalStorage()
  })

  afterEach(() => {
    cy.saveLocalStorage()
  })

  it('should store values of local wallet', function () {
    cy.createEmptyWallet(true)
    cy.sendDFItoWallet()
      .sendDFITokentoWallet()
      .sendTokenToWallet(['BTC', 'DFI-ETH']).wait(10000)
    cy.verifyWalletAddress('regtest', localAddress)
  })

  it('should have MainNet', function () {
    cy.isNetworkConnected('Local')
    cy.switchNetwork('MainNet')
  })

  it('should start creation of mnemonic wallet', function () {
    cy.startCreateMnemonicWallet(recoveryWords)
  })

  it('should be able to select correct words', function () {
    cy.selectMnemonicWords(recoveryWords)
  })

  it('should be able to verify and set pincode', function () {
    cy.setupPinCode()
  })

  context('Settings - Mnemonic Verification', () => {
    it('should be able to verify mnemonic from settings page', function () {
      cy.verifyMnemonicOnSettingsPage(settingsRecoveryWords, recoveryWords)
    })
  })

  context('Restore - Mnemonic Verification', () => {
    it('should be able to restore mnemonic words', function () {
      cy.getByTestID('bottom_tab_settings').click()
      cy.getByTestID('setting_exit_wallet').click()
      cy.restoreMnemonicWords(settingsRecoveryWords)
    })
  })

  context('Wallet - Verify Wallet Address', () => {
    it('should be have selected valid network', function () {
      cy.getByTestID('bottom_tab_settings').click()
      cy.getByTestID('button_network_MainNet_check').should('exist')
    })

    it('should be have valid network address', function () {
      cy.verifyWalletAddress('mainnet', mainnetAddress)
      cy.getByTestID('bottom_tab_balances').click()
    })
  })

  context('Wallet - On Refresh', () => {
    it('should load selected network', function () {
      cy.reload()
      cy.isNetworkConnected('MainNet')
      cy.getByTestID('bottom_tab_balances').click()
      cy.getByTestID('balances_row_0_utxo').click()
      cy.getByTestID('receive_button').click()
      cy.getByTestID('address_text').then(($txt: any) => {
        const address = $txt[0].textContent
        expect(address).eq(mainnetAddress.address)
      })
    })
  })

  // In this test, there are Local and MainNet wallets existing
  context('Wallet - Network Switch', () => {
    it('should change network to Local', function () {
      cy.getByTestID('bottom_tab_settings').click()
      cy.getByTestID('button_network_Local').click()
    })

    it('should have correct balances', function () {
      cy.fetchWalletBalance()
      cy.getByTestID('bottom_tab_balances').click()
      cy.getByTestID('balances_list').should('exist')
      cy.getByTestID('balances_row_0_utxo_amount').contains(10)
      cy.getByTestID('balances_row_0_amount').contains(10)
      cy.getByTestID('balances_row_1_amount').contains(10)
      cy.getByTestID('balances_row_7_amount').contains(10)
    })

    it('should have correct poolpairs', function () {
      cy.getByTestID('bottom_tab_dex').click()
      cy.getByTestID('your_DFI-ETH').contains('10.00000000 DFI-ETH')
      cy.getByTestID('bottom_tab_balances').click()
    })

    it('should have correct address', function () {
      cy.getByTestID('bottom_tab_balances').click()
      cy.getByTestID('balances_row_0_utxo').click()
      cy.getByTestID('receive_button').click()
      cy.getByTestID('address_text').then(($txt: any) => {
        const address = $txt[0].textContent
        expect(address).eq(localAddress.address)
      })
    })
  })
})
