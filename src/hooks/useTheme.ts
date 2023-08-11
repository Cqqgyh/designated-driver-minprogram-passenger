import { useTmpiniaStore } from '@/tmui/tool/lib/tmpinia'

export const useTheme = () => {
  const tmPiniaStore = useTmpiniaStore()
  /**
   * @description: 切换暗黑模式/亮白模式
   */
  const toggleDarkOrLight = () => {
    tmPiniaStore.setTmVuetifyDark(!tmPiniaStore.tmStore.dark)
  }
  /**
   * @description: 切换主题颜色
   * @param color 颜色HexColor
   */
  const toggleThemeColor = (color: string) => {
    color = color.trim().toLocaleUpperCase()
    if (!color) {
      uni.showToast({
        title: '颜色不能为空'
      })
    }
    tmPiniaStore.setTmVuetifyAddTheme(`name-${color}`, color)
  }
  /**
   * @description: 通过颜色主题名称切换主题颜色
   * @param colorName
   */
  const toggleThemeColorByColorThemeName = (colorName: string) => {
    const color = tmPiniaStore.tmStore.colorList.find((item) => item.name === colorName)?.value
    if (!color) return
    toggleThemeColor(color)
  }
  return {
    toggleDarkOrLight,
    toggleThemeColor,
    toggleThemeColorByColorThemeName
  }
}
