    import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', {
    state: () => ({
        currentAccountId: 0,
        currentAccount: {},
        changeUserAccountName: '',
        mailCountMap: {}
    }),
    actions: {
        updateMailCount(map) {
            this.mailCountMap = { ...this.mailCountMap, ...map }
        },
        decrementUnread(accountId) {
            const item = this.mailCountMap[accountId]
            if (item && item.unread > 0) {
                this.mailCountMap[accountId] = { ...item, unread: item.unread - 1 }
            }
        },
        incrementUnread(accountId) {
            const item = this.mailCountMap[accountId] || { total: 0, unread: 0 }
            this.mailCountMap[accountId] = { total: item.total + 1, unread: item.unread + 1 }
        }
    }
})
