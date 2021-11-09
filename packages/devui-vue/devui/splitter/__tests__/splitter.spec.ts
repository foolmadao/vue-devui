import { mount } from '@vue/test-utils'
import { wrap } from 'lodash'
import { ref } from 'vue'
import DSplitter from '../src/splitter'
import DSplitterPane from '../src/splitter-pane'
import { mouseMoveTrigger } from './event.helper'

describe('splitter', () => {
  describe('basic', () => {
    const testComponent = {
      components: {
        DSplitter,
        DSplitterPane,
      },
      template: `
        <d-splitter :orientation="orientation" :splitBarSize="splitBarSize" style="height: 500px; border: 1px solid #E3E5E9;">
            <template v-slot:DSplitterPane>
              <d-splitter-pane :size="size" :minSize="minSize" :maxSize="maxSize" :collapsible="collapsible" :collapsed="collapsed" @sizeChange="sizeChange">
                <div class="pane-content">
                  <h2>左侧面板</h2>
                  <div>左侧内容区域，宽度 30%，最小宽度 20%</div>
                </div>
              </d-splitter-pane>
              <d-splitter-pane size="50px">
                <div class="pane-content">
                  <h2>中间面板</h2>
                  <div>中间内容区域</div>
                </div>
              </d-splitter-pane>
              <d-splitter-pane>
                <div class="pane-content">
                  <h2>右侧面板</h2>
                  <div>右侧内容区域</div>
                </div>
              </d-splitter-pane>
            </template>
        </d-splitter>
      `,
      setup() {
        const orientation = ref('horizontal')
        const collapsible = ref(true)
        const collapsed = ref(false)
        const splitBarSize = ref('2px')
        const size = ref('30%')
        const minSize = ref('20%')
        const maxSize = ref('60%')
        const sizeChange = (size) => {
          console.log(size)
        }
        return {
          orientation,
          collapsible,
          collapsed,
          splitBarSize,
          size,
          minSize,
          maxSize,
          sizeChange,
        }
      },
    }

    let wrapper = null
    let splitterElement: HTMLElement
    beforeEach(() => {
      wrapper = mount(testComponent)
      splitterElement = wrapper.vm.$el
    })
    it('should create testComponent', () => {
      expect(wrapper.vm).toBeTruthy()
    })

    it('should create splitter container', () => {
      expect(splitterElement).toBeTruthy()
      expect(wrapper.classes()).toContain('devui-splitter-horizontal')
    })

    it('should render splitter-bar', () => {
      const handles = wrapper.findAll('.devui-splitter-bar')
      expect(handles.length).toBe(2)
    })

    it('should collapse left pane when collapseButton clicked', async () => {
      // const handleButton = wrapper.find('.prev.devui-collapse')
      // handleButton.trigger('click')
      // await wrapper.vm.$nextTick()
      // TODO: Jest 基于 jsdom，jsdom not support `clientWidth`，clientWidth 为0
      // const pane = wrapper.find('.devui-splitter-pane').element
      // expect(pane.clientWidth).toBe(0)
    })

    it('should add collapsed class when collapseButton clicked', async () => {
      const handleButton = wrapper.find('.prev.devui-collapse')
      handleButton.trigger('click')
      await wrapper.vm.$nextTick()
      expect(handleButton.classes()).toContain('collapsed')
    })

    it('should change collapse state', () => {
      wrapper = mount(
        Object.assign(testComponent, {
          setup() {
            const orientation = ref('horizontal')
            const collapsible = ref(false)
            const collapsed = ref(false)
            const splitBarSize = ref('2px')
            const size = ref('30%')
            const minSize = ref('20%')
            const maxSize = ref('60%')
            const sizeChange = (size) => {
              console.log(size)
            }
            return {
              orientation,
              collapsible,
              collapsed,
              splitBarSize,
              size,
              minSize,
              maxSize,
              sizeChange,
            }
          },
        })
      )
      expect(wrapper.find('.prev').classes()).not.toContain('devui-collapse')
    })

    it('should be collapsed', () => {
      wrapper = mount(
        Object.assign(testComponent, {
          setup() {
            const orientation = ref('horizontal')
            const collapsible = ref(true)
            const collapsed = ref(true)
            const splitBarSize = ref('2px')
            const size = ref('30%')
            const minSize = ref('20%')
            const maxSize = ref('60%')
            const sizeChange = (size) => {
              console.log(size)
            }
            return {
              orientation,
              collapsible,
              collapsed,
              splitBarSize,
              size,
              minSize,
              maxSize,
              sizeChange,
            }
          },
        })
      )
      expect(wrapper.find('.prev.devui-collapse').classes()).toContain(
        'collapsed'
      )
    })

    it('should change splitterBar size', async () => {
      // TODO: Jest 基于 jsdom，jsdom not support `clientWidth`，clientWidth 为0
      // 详细可以看 ReadME https://github.com/jsdom/jsdom
      // README 建议： `using Object.defineProperty() to change what various layout-related getters and methods return.` 待处理
      // expect(wrapper.find('.devui-splitter-bar').element.clientWidth).toBe(2)
    })

    it('should change splitter direction', () => {
      wrapper = mount(
        Object.assign(testComponent, {
          setup() {
            const orientation = ref('vertical')
            const collapsible = ref(true)
            const collapsed = ref(true)
            const splitBarSize = ref('2px')
            const size = ref('30%')
            const minSize = ref('20%')
            const maxSize = ref('60%')
            const sizeChange = (size) => {
              console.log(size)
            }
            return {
              orientation,
              collapsible,
              collapsed,
              splitBarSize,
              size,
              minSize,
              maxSize,
              sizeChange,
            }
          },
        })
      )
      expect(wrapper.classes()).toContain('devui-splitter-vertical')
    })

    it('should change pane size', async () => {
      wrapper = mount(
        Object.assign(testComponent, {
          setup() {
            const orientation = ref('vertical')
            const collapsible = ref(true)
            const collapsed = ref(true)
            const splitBarSize = ref('2px')
            const size = ref('40%')
            const minSize = ref('20%')
            const maxSize = ref('60%')
            const sizeChange = (size) => {
              console.log(size)
            }
            return {
              orientation,
              collapsible,
              collapsed,
              splitBarSize,
              size,
              minSize,
              maxSize,
              sizeChange,
            }
          },
        })
      )
      await wrapper.vm.$nextTick()
      const computedStyle = getComputedStyle(
        wrapper.find('.devui-splitter-pane').element
      )
      expect(computedStyle.flexBasis).toContain('40%')
    })

    it('should change pane size', () => {
      wrapper = mount(
        Object.assign(testComponent, {
          setup() {
            const orientation = ref('vertical')
            const collapsible = ref(true)
            const collapsed = ref(true)
            const splitBarSize = ref('2px')
            const size = ref(undefined)
            const minSize = ref('20%')
            const maxSize = ref('60%')
            const sizeChange = (size) => {
              console.log(size)
            }
            return {
              orientation,
              collapsible,
              collapsed,
              splitBarSize,
              size,
              minSize,
              maxSize,
              sizeChange,
            }
          },
        })
      )
      expect(wrapper.find('.devui-splitter-pane').classes()).not.toContain(
        'devui-splitter-pane-fixed'
      )
    })

    // 测试拖动时size最小边界
    it('should minimum size work', async () => {
      const leftPaneElement: HTMLElement = wrapper.find(
        '.devui-splitter-pane'
      ).element

      // TODO Jest 基于 jsdom，jsdom not support getBoundingClientRect
      const rect = leftPaneElement.getBoundingClientRect()
      const splitterBarElement: HTMLElement = wrapper.find(
        '.devui-splitter-bar'
      ).element
      // 模拟鼠标事件
      mouseMoveTrigger(
        splitterBarElement,
        { x: rect.right, y: rect.height },
        { x: rect.right - 2000, y: rect.height }
      )

      // TODO: Jest 基于 jsdom，jsdom not support `clientWidth`，clientWidth 为 0
    })
  })

  describe('vertical', () => {
    const testComponent = {
      components: {
        DSplitter,
        DSplitterPane,
      },
      template: `
        <d-splitter :orientation="orientation" style="height: 500px; border: 1px solid #E3E5E9;">
        <d-splitter-pane>
          <div class="pane-content">
            <h2>上面板</h2>
            <div>内容区域</div>
          </div>
        </d-splitter-pane>
        <d-splitter-pane :size="size" :minSize="minSize" :maxSize="maxSize">
          <div class="pane-content">
            <h2>下面板</h2>
            <div>内容区域</div>
          </div>
        </d-splitter-pane>
        <d-splitter-pane [size]="'100px'" [resizable]="false">
          <div class="pane-content">
            <h2>下面板</h2>
            <div>内容区域</div>
          </div>
        </d-splitter-pane>
      </d-splitter>
      `,
      setup() {
        const orientation = ref('vertical')
        const size = ref('100px')
        const minSize = ref('50px')
        const maxSize = ref('200px')
        return {
          orientation,
          size,
          minSize,
          maxSize,
        }
      },
    }

    let wrapper = null
    beforeEach(() => {
      wrapper = mount(testComponent)
    })

    it('should create vertical container', () => {
      expect(wrapper.vm.$el).toBeTruthy()
      expect(wrapper.classes()).toContain('devui-splitter-vertical')
    })

    // 测试拖动时 size 最大边界
    it('should right panel maximum size work', async () => {
      // TODO Jest 基于 jsdom，jsdom not support getBoundingClientRect
    })
  })
})