export const isOnline = (a) => new Date().getTime() - new Date(a).getTime() < 120000
