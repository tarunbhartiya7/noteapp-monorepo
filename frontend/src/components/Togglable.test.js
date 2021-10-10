import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Togglable from './Togglable'
// import { prettyDOM } from '@testing-library/dom'

describe('<Togglable />', () => {
  let component

  beforeEach(() => {
    component = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv" />
      </Togglable>
    )
  })

  test('renders its children', () => {
    expect(component.container.querySelector('.testDiv')).toBeDefined()
  })

  test('at start the children are not displayed', () => {
    const div = component.container.querySelector('div')
    // console.log(prettyDOM(div))
    expect(div).not.toHaveClass('togglableContent')

    const button = component.getByText('show...')
    expect(button).toBeDefined()
  })

  test('after clicking the button, children are displayed', () => {
    const showButton = component.getByText('show...')
    fireEvent.click(showButton)

    const div = component.container.querySelector('div')
    expect(div).toHaveClass('togglableContent')
    // console.log(prettyDOM(div))
  })

  test('toggled content can be closed', () => {
    const button = component.getByText('show...')
    fireEvent.click(button)

    const closeButton = component.getByText('cancel')
    fireEvent.click(closeButton)

    const div = component.container.querySelector('div')
    // console.log(prettyDOM(div))
    expect(div).not.toHaveClass('togglableContent')
  })
})
