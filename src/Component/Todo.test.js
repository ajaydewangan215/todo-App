import { fireEvent, render, screen } from '@testing-library/react'
import Todo from './Todo'

describe('Todo component', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    test('adds a task, toggles completion, and shows counts and filters', () => {
        render(<Todo />)

        const input = screen.getByPlaceholderText(/add here/i)
        fireEvent.change(input, { target: { value: 'Buy groceries' } })
        fireEvent.click(screen.getByTitle(/add item/i))

        expect(screen.getByText('Buy groceries')).toBeInTheDocument()

        const checkbox = screen.getByRole('checkbox')
        fireEvent.click(checkbox)

        expect(checkbox).toBeChecked()
        expect(screen.getByText(/completed count/i)).toHaveTextContent('1')
        expect(screen.getByText(/pending count/i)).toHaveTextContent('0')

        fireEvent.click(screen.getByRole('button', { name: /active/i }))
        expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: /all/i }))
        expect(screen.getByText('Buy groceries')).toBeInTheDocument()
    })
})
