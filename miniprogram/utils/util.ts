export const formatTime = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return (
        [year, month, day].map(formatNumber).join('/') +
        ' ' +
        [hour, minute, second].map(formatNumber).join(':')
    )
}

const formatNumber = (n: number) => {
    const s = n.toString()
    return s[1] ? s : '0' + s
}

export const updateAvatarFromCache = (userId: number, avatars: any): any => {
    const userInfo = avatars.filter((item:any) => item.id === userId)
    if (userInfo) {
        return userInfo[0].avatar
    } else {
        return null
    }
}
