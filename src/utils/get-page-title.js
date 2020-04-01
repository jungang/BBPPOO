import defaultSettings from '@/settings'

const title = defaultSettings.title || 'BPO运营数据分析工具'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
