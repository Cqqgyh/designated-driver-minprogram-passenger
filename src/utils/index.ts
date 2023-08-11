/**
 * @description: uniapp中获取当前页面信息
 * @return {*}
 */
export function getCurrentPageInfo(): { route: string; pageInfo: any; fullPath: string } {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const returnObj = {
    route: `/${currentPage.route}`,
    pageInfo: currentPage,
    fullPath: ''
  }
  // uniapp+vue3中存在bug，小程序不能实时获取到fullPath，需要延迟获取
  setTimeout(() => {
    returnObj.fullPath = (currentPage as any).$page.fullPath
  }, 0)
  return returnObj
}
