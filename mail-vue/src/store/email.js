import { defineStore } from 'pinia'
import { EmailUnreadEnum } from '@/enums/email-enum.js'
import { sanitizeEmailHtml } from '@/utils/email-html.js'
import { emailDetail } from '@/request/email.js'

export const useEmailStore = defineStore('email', {
    state: () => ({
        deleteIds: 0,
        starScroll: null,
        emailScroll: null,
        cancelStarEmailId: 0,
        addStarEmailId: 0,
        contentData: {
            email: null,
            delType: null,
            showStar: true,
            showReply: true,
            showUnread: false
        },
        sendScroll: null,
        detailMap: {},
        searchParams: {
            text: '',
            type: 'subject',
            startDate: '',
            endDate: '',
        },
    }),
    persist: {
        pick: ['contentData'],
    },
    actions: {
        setSearchParams(params) {
            this.searchParams = {
                ...this.searchParams,
                ...params,
            }
        },
        fetchList(request) {
            return request(0)
        },
        async fetchDetail(emailId) {
            const existing = this.detailMap[emailId]
            if (existing?._full) return existing
            const detail = await emailDetail(emailId)
            if (detail?.content) detail.content = sanitizeEmailHtml(detail.content)
            if (!detail?.attList) detail.attList = []
            detail._full = true
            this.detailMap[emailId] = detail
            const currentId = this.contentData.email?.emailId
            if (currentId && currentId === emailId) {
                this.contentData.email = detail
            }
            return detail
        },
        applyFullList(list) {
            if (!list?.length) return
            const currentId = this.contentData.email?.emailId
            for (const item of list) {
                if (!item?.emailId) continue
                if (item.content) item.content = sanitizeEmailHtml(item.content)
                if (!item.attList) item.attList = []
                const prev = this.detailMap[item.emailId]
                if (prev?._full) continue
                const keepRead = prev?.unread === EmailUnreadEnum.READ
                    || (currentId === item.emailId && this.contentData.email?.unread === EmailUnreadEnum.READ)
                if (keepRead) {
                    item.unread = EmailUnreadEnum.READ
                }
                this.detailMap[item.emailId] = item
                if (currentId && item.emailId === currentId) {
                    this.contentData.email = item
                }
            }
        },
        toContentEmail(email) {
            const id = email?.emailId
            if (id && this.detailMap[id]) {
                return this.detailMap[id]
            }
            return {
                ...email,
                emailId: id || 0,
                content: '',
                text: '',
                attList: [],
                recipient: email?.recipient || '[]',
            }
        },
        markListRead(emailId) {
            const scrolls = [this.emailScroll, this.starScroll, this.sendScroll]
            for (const scroll of scrolls) {
                const list = scroll?.emailList
                if (!list?.length) continue
                const item = list.find(e => e.emailId === emailId)
                if (item) item.unread = EmailUnreadEnum.READ
            }
        },
    },
})
