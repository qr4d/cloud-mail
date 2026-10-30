    import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', {
    state: () => ({
        currentAccountId: 0,
        currentAccount: {},
        changeUserAccountName: '',
        unreadCountMap: {}
    }),
    actions: {
        updateUnreadCount(map) {
            this.unreadCountMap = { ...this.unreadCountMap, ...map }
        },
        decrementUnread(accountId) {
            if (this.unreadCountMap[accountId] > 0) {
                this.unreadCountMap[accountId]--
            }
        },
        incrementUnread(accountId) {
            this.unreadCountMap[accountId] = (this.unreadCountMap[accountId] || 0) + 1
        }
    }
})