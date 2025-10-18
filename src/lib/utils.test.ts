import { cn } from './utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', true && 'conditional')
      expect(result).toBe('base conditional')
    })

    it('should handle falsy values', () => {
      const result = cn('base', false && 'conditional', null, undefined)
      expect(result).toBe('base')
    })
  })
})
