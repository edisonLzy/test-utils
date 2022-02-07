import SuspenseComponent from '../components/Suspense.vue'
import { mount, flushPromises } from '../../src'
import { defineComponent } from '@vue/compat'

let mockShouldError = false
jest.mock('../utils', () => ({
  simulateDelay: () => {
    if (mockShouldError) {
      throw new Error('Error!')
    }
  }
}))

describe('suspense', () => {
  test('fallback state', () => {
    const wrapper = mount(SuspenseComponent)

    expect(wrapper.html()).toContain('Fallback content')
  })

  test('default state', async () => {
    const wrapper = mount(SuspenseComponent)

    await flushPromises()
    expect(wrapper.html()).toContain('Default content')
  })

  test('error state', async () => {
    mockShouldError = true
    const wrapper = mount(SuspenseComponent)

    await flushPromises()

    expect(wrapper.html()).toContain('Error!')
  })

  test('returns the element if it is a root element inside Suspense', () => {
    const Async = defineComponent({
      // works if there is a root element
      // template: '<div><h1>Hello</h1><span id="my-span">There</span></div>'
      // otherwise does not find the element
      template: '<h1>Hello</h1><span id="my-span">There</span>'
    })
    const Component = defineComponent({
      components: { Async },
      template: '<Suspense><Async/></Suspense>'
    })

    const wrapper = mount(Component)
    expect(wrapper.get('#my-span')).not.toBeNull()
  })
})
